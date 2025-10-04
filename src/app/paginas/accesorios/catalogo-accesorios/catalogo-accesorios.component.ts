import { CurrencyPipe, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { AccesorioService, Accesorio } from '../../../core/accesorio.service';

@Component({
  selector: 'app-catalogo-accesorios',
  standalone: true,
  imports: [CurrencyPipe, RouterModule, RouterLink],
  templateUrl: './catalogo-accesorios.component.html',
  styleUrl: './catalogo-accesorios.component.css'
})
export class CatalogoAccesoriosComponent implements OnInit {
  accesorios: Accesorio[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(private accesorioService: AccesorioService) {}

  ngOnInit(): void {
    this.loadAccesorios();
  }

  loadAccesorios(): void {
    this.loading = true;
    this.error = '';
    
    // Usar el cache reactivo para que se actualice automáticamente con los cambios CRUD
    this.accesorioService.getAccesoriosCache().subscribe({
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

  onImgError(ev: Event) {
    const el = ev.target as HTMLImageElement;
    el.src = '/img/placeholder.png'; // fallback en caso de error
  }
}
