import { CurrencyPipe, NgIf } from '@angular/common';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProductService, Celular } from '../../../core/product.service';
import { CartService } from '../../../core/cart.service';
import { APP_ROUTES } from '../../../core/constants/app.constants';

@Component({
  selector: 'app-detalle-prod-component',
  standalone: true,
  imports: [RouterModule, CurrencyPipe, NgIf],
  templateUrl: './detalle-prod-component.component.html',
  styleUrl: './detalle-prod-component.component.css'
})
export class DetalleProdComponentComponent implements OnInit, OnDestroy {
  // Inyección moderna
  private readonly cart = inject(CartService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);

  // Estado del componente
  celular?: Celular;
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

    this.loadProducto(slug);
  }

  ngOnDestroy(): void {
    // Completar todas las suscripciones para prevenir memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadProducto(slug: string): void {
    this.loading = true;
    this.error = '';

    // Suscribirse al cache reactivo para obtener actualizaciones en tiempo real
    this.productService.getBySlug(slug)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (producto) => {
          if (producto) {
            this.celular = producto;
            this.error = '';
          } else if (!this.loading) {
            // Solo mostrar error si ya terminó la carga inicial y el producto desapareció
            this.handleError('Producto no encontrado o fue eliminado');
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar el producto:', err);
          this.handleError('Error al cargar el producto');
        }
      });
  }

  private handleError(mensaje: string): void {
    this.error = mensaje;
    this.loading = false;
    setTimeout(() => {
      this.router.navigateByUrl(APP_ROUTES.catalogo);
    }, 2000);
  }

  volver(): void {
    this.router.navigateByUrl(APP_ROUTES.catalogo);
  }

  agregarAlCarrito(): void {
    if (!this.celular) {
      console.warn('No se puede agregar al carrito: producto no disponible');
      return;
    }

    const { slug, nombre, precio, foto } = this.celular;
    this.cart.add({ slug, nombre, precio, foto, tipo: 'producto' }, 1);
    this.router.navigateByUrl(APP_ROUTES.carrito);
  }
}
