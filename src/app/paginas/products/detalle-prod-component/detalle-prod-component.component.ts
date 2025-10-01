import { CurrencyPipe, NgIf } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProductService, Celular } from '../../../core/product.service';
import { CartService} from '../../../core/cart.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-detalle-prod-component',
  standalone: true,
  imports: [RouterModule, CurrencyPipe, NgIf],
  templateUrl: './detalle-prod-component.component.html',
  styleUrl: './detalle-prod-component.component.css'
})
export class DetalleProdComponentComponent implements OnDestroy {
  celular?: Celular;
  loading: boolean = true;
  error: string = '';
  private subscription?: Subscription;

  constructor(
    private cart: CartService,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.loading = true;
    this.error = '';

    // Suscribirse al cache reactivo para obtener actualizaciones en tiempo real
    this.subscription = this.productService.getBySlug(slug).subscribe({
      next: (producto) => {
        if (producto) {
          this.celular = producto;
          this.error = '';
        } else if (!this.loading) {
          // Solo mostrar error si ya terminó la carga inicial y el producto desapareció
          this.error = 'Producto no encontrado o fue eliminado';
          setTimeout(() => {
            this.router.navigateByUrl('/catalogo');
          }, 2000);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar el producto:', err);
        this.error = 'Error al cargar el producto';
        this.loading = false;
        setTimeout(() => {
          this.router.navigateByUrl('/catalogo');
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
    this.router.navigateByUrl('/catalogo');
  }

  agregarAlCarrito() {
    if (!this.celular) return;
    const { slug, nombre, precio, foto } = this.celular;
    this.cart.add({ slug, nombre, precio, foto }, 1);
    this.router.navigateByUrl('/carrito');
  }
}
