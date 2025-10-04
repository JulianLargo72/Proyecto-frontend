import { CurrencyPipe, NgFor } from '@angular/common';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProductService, Celular } from '../../../core/product.service';

@Component({
  selector: 'app-catalogo-component',
  standalone: true,
  imports: [CurrencyPipe, RouterModule, RouterLink],
  templateUrl: './catalogo-component.component.html',
  styleUrl: './catalogo-component.component.css'
})
export class CatalogoComponentComponent implements OnInit, OnDestroy {
  private readonly productService = inject(ProductService);
  
  // Estado del componente
  celulares: Celular[] = [];
  loading = true;
  error = '';
  
  // Subject para manejo de suscripciones
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadCelulares();
  }

  ngOnDestroy(): void {
    // Completar todas las suscripciones para prevenir memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCelulares(): void {
    this.loading = true;
    this.error = '';
    
    // Usar el cache reactivo para que se actualice automáticamente con los cambios CRUD
    this.productService.getProductosCache()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.celulares = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar productos:', err);
          this.error = 'Error al cargar los productos. Por favor, intenta nuevamente.';
          this.loading = false;
        }
      });
  }

  onImgError(event: Event): void {
    const element = event.target as HTMLImageElement;
    element.src = '/img/placeholder.png';
  }
}
