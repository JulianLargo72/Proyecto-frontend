import { CurrencyPipe, NgIf } from '@angular/common';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { OfertaService, Oferta } from '../../../core/oferta.service';
import { CartService } from '../../../core/cart.service';
import { APP_ROUTES } from '../../../core/constants/app.constants';

@Component({
  selector: 'app-detalle-oferta',
  standalone: true,
  imports: [RouterModule, CurrencyPipe, NgIf],
  templateUrl: './detalle-oferta.component.html',
  styleUrl: './detalle-oferta.component.css'
})
export class DetalleOfertaComponent implements OnInit, OnDestroy {
  // Inyección moderna
  private readonly cart = inject(CartService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly ofertaService = inject(OfertaService);

  // Estado del componente
  oferta?: Oferta;
  loading = true;
  error = '';

  // Subject para manejo de suscripciones
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    
    if (!slug) {
      this.handleError('Slug no proporcionado');
      return;
    }

    this.loadOferta(slug);
  }

  ngOnDestroy(): void {
    // Completar todas las suscripciones para prevenir memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadOferta(slug: string): void {
    this.loading = true;
    this.error = '';

    // Suscribirse al cache reactivo para obtener actualizaciones en tiempo real
    this.ofertaService.getBySlug(slug)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (oferta) => {
          if (oferta) {
            this.oferta = oferta;
            this.error = '';
          } else if (!this.loading) {
            // Solo mostrar error si ya terminó la carga inicial y la oferta desapareció
            this.handleError('Oferta no encontrada o fue eliminada');
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar la oferta:', err);
          this.handleError('Error al cargar la oferta');
        }
      });
  }

  private handleError(mensaje: string): void {
    this.error = mensaje;
    this.loading = false;
    setTimeout(() => {
      this.router.navigate(['/ofertas']);
    }, 2000);
  }

  volver(): void {
    this.router.navigate(['/ofertas']);
  }

  // Calcular precio con descuento
  calcularPrecioFinal(): number {
    if (!this.oferta) return 0;
    return this.ofertaService.calcularPrecioConDescuento(this.oferta);
  }

  // Calcular ahorro
  calcularAhorro(): number {
    if (!this.oferta) return 0;
    return this.oferta.precio - this.calcularPrecioFinal();
  }

  agregarAlCarrito(): void {
    if (!this.oferta) {
      console.warn('No se puede agregar al carrito: oferta no disponible');
      return;
    }

    const { slug, nombre, foto } = this.oferta;
    const precioFinal = this.calcularPrecioFinal();
    
    this.cart.add({ slug, nombre, precio: precioFinal, foto, tipo: 'oferta' }, 1);
    this.router.navigateByUrl(APP_ROUTES.carrito);
  }
}
