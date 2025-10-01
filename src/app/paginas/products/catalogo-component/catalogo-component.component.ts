import { CurrencyPipe, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { ProductService, Celular } from '../../../core/product.service';

@Component({
  selector: 'app-catalogo-component',
  standalone: true,
  imports: [CurrencyPipe, RouterModule, RouterLink],
  templateUrl: './catalogo-component.component.html',
  styleUrl: './catalogo-component.component.css'
})
export class CatalogoComponentComponent implements OnInit {
  celulares: Celular[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadCelulares();
  }

  loadCelulares(): void {
    this.loading = true;
    this.error = '';
    
    this.productService.getCelulares().subscribe({
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

  onImgError(ev: Event) {
    const el = ev.target as HTMLImageElement;
    el.src = '/img/placeholder.png'; // fallback en caso de error
  }
}
