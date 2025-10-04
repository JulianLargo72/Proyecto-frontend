import { CurrencyPipe, NgIf } from '@angular/common';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AccesorioService, Accesorio } from '../../../core/accesorio.service';
import { CartService } from '../../../core/cart.service';
import { APP_ROUTES } from '../../../core/constants/app.constants';

@Component({
  selector: 'app-detalle-accesorio',
  standalone: true,
  imports: [RouterModule, CurrencyPipe, NgIf],
  templateUrl: './detalle-accesorio.component.html',
  styleUrl: './detalle-accesorio.component.css'
})
export class DetalleAccesorioComponent implements OnInit, OnDestroy {
  private readonly cart = inject(CartService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly accesorioService = inject(AccesorioService);

  // Estado del componente
  accesorio?: Accesorio;
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

    this.loadAccesorio(slug);
  }

  ngOnDestroy(): void {
    // Completar todas las suscripciones para prevenir memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAccesorio(slug: string): void {
    this.loading = true;
    this.error = '';

    // Suscribirse al cache reactivo para obtener actualizaciones en tiempo real
    this.accesorioService.getBySlug(slug)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (accesorio) => {
          if (accesorio) {
            this.accesorio = accesorio;
            this.error = '';
          } else if (!this.loading) {
            // Solo mostrar error si ya terminó la carga inicial y el accesorio desapareció
            this.handleError('Accesorio no encontrado o fue eliminado');
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar el accesorio:', err);
          this.handleError('Error al cargar el accesorio');
        }
      });
  }

  private handleError(mensaje: string): void {
    this.error = mensaje;
    this.loading = false;
    setTimeout(() => {
      this.router.navigateByUrl(APP_ROUTES.accesorios);
    }, 2000);
  }

  volver(): void {
    this.router.navigateByUrl(APP_ROUTES.accesorios);
  }

  agregarAlCarrito(): void {
    if (!this.accesorio) {
      console.warn('No se puede agregar al carrito: accesorio no disponible');
      return;
    }

    const { slug, nombre, precio, foto } = this.accesorio;
    this.cart.add({ slug, nombre, precio, foto, tipo: 'accesorio' }, 1);
    this.router.navigateByUrl(APP_ROUTES.carrito);
  }
}
