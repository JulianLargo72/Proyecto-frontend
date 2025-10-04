import { CurrencyPipe, NgFor } from '@angular/common';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { OfertaService, Oferta } from '../../../core/oferta.service';

@Component({
  selector: 'app-catalogo-ofertas',
  standalone: true,
  imports: [CurrencyPipe, RouterModule, RouterLink],
  templateUrl: './catalogo-ofertas.component.html',
  styleUrl: './catalogo-ofertas.component.css'
})
export class CatalogoOfertasComponent implements OnInit, OnDestroy {
  private readonly ofertaService = inject(OfertaService);
  
  // Estado del componente
  ofertas: Oferta[] = [];
  loading = true;
  error = '';
  
  // Subject para manejo de suscripciones
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadOfertas();
  }

  ngOnDestroy(): void {
    // Completar todas las suscripciones para prevenir memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadOfertas(): void {
    this.loading = true;
    this.error = '';
    
    // Usar el cache reactivo para que se actualice automáticamente con los cambios CRUD
    this.ofertaService.getOfertasCache()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.ofertas = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar ofertas:', err);
          this.error = 'Error al cargar las ofertas. Por favor, intenta nuevamente.';
          this.loading = false;
        }
      });
  }

  // Calcular precio con descuento
  calcularPrecioFinal(oferta: Oferta): number {
    return this.ofertaService.calcularPrecioConDescuento(oferta);
  }

  onImgError(event: Event): void {
    const element = event.target as HTMLImageElement;
    element.src = '/img/placeholder.png';
  }
}
