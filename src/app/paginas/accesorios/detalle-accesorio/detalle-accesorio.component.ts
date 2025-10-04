import { CurrencyPipe, NgIf } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AccesorioService, Accesorio } from '../../../core/accesorio.service';
import { CartService } from '../../../core/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-detalle-accesorio',
  standalone: true,
  imports: [RouterModule, CurrencyPipe, NgIf],
  templateUrl: './detalle-accesorio.component.html',
  styleUrl: './detalle-accesorio.component.css'
})
export class DetalleAccesorioComponent implements OnDestroy {
  accesorio?: Accesorio;
  loading: boolean = true;
  error: string = '';
  private subscription?: Subscription;

  constructor(
    private cart: CartService,
    private route: ActivatedRoute,
    private router: Router,
    private accesorioService: AccesorioService
  ) {}

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.loading = true;
    this.error = '';

    // Suscribirse al cache reactivo para obtener actualizaciones en tiempo real
    this.subscription = this.accesorioService.getBySlug(slug).subscribe({
      next: (accesorio) => {
        if (accesorio) {
          this.accesorio = accesorio;
          this.error = '';
        } else if (!this.loading) {
          // Solo mostrar error si ya terminó la carga inicial y el accesorio desapareció
          this.error = 'Accesorio no encontrado o fue eliminado';
          setTimeout(() => {
            this.router.navigateByUrl('/accesorios');
          }, 2000);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar el accesorio:', err);
        this.error = 'Error al cargar el accesorio';
        this.loading = false;
        setTimeout(() => {
          this.router.navigateByUrl('/accesorios');
        }, 2000);
      }
    });
  }

  ngOnDestroy() {
    // Limpiar suscripción para evitar memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  volver() {
    this.router.navigateByUrl('/accesorios');
  }

  agregarAlCarrito() {
    if (!this.accesorio) return;
    const { slug, nombre, precio, foto } = this.accesorio;
    this.cart.add({ slug, nombre, precio, foto, tipo: 'accesorio' }, 1);
    this.router.navigateByUrl('/carrito');
  }
}
