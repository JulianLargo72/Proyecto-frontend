import { CurrencyPipe, NgFor } from '@angular/common';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AccesorioService, Accesorio } from '../../../core/accesorio.service';

@Component({
  selector: 'app-catalogo-accesorios',
  standalone: true,
  imports: [CurrencyPipe, RouterModule, RouterLink],
  templateUrl: './catalogo-accesorios.component.html',
  styleUrl: './catalogo-accesorios.component.css'
})
export class CatalogoAccesoriosComponent implements OnInit, OnDestroy {
  private readonly accesorioService = inject(AccesorioService);
  
  // Estado del componente
  accesorios: Accesorio[] = [];
  loading = true;
  error = '';
  
  // Subject para manejo de suscripciones
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadAccesorios();
  }

  ngOnDestroy(): void {
    // Completar todas las suscripciones para prevenir memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAccesorios(): void {
    this.loading = true;
    this.error = '';
    
    // Usar el cache reactivo para que se actualice automáticamente con los cambios CRUD
    this.accesorioService.getAccesoriosCache()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.accesorios = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar accesorios:', err);
          this.error = 'Error al cargar los accesorios. Por favor, intenta nuevamente.';
          this.loading = false;
        }
      });
  }

  onImgError(event: Event): void {
    const element = event.target as HTMLImageElement;
    element.src = '/img/placeholder.png';
  }
}
