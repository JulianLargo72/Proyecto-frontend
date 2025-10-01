import { CurrencyPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProductService, Celular } from '../../../core/product.service';
import { CartService} from '../../../core/cart.service';


@Component({
  selector: 'app-detalle-prod-component',
  standalone: true,
  imports: [RouterModule, CurrencyPipe, NgIf],
  templateUrl: './detalle-prod-component.component.html',
  styleUrl: './detalle-prod-component.component.css'
})
export class DetalleProdComponentComponent {
  celular?: Celular;
  loading: boolean = true;
  error: string = '';

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

    // Cargar el producto desde el servicio
    this.productService.getBySlug(slug).subscribe({
      next: (producto) => {
        if (producto) {
          this.celular = producto;
        } else {
          this.error = 'Producto no encontrado';
          // Redirigir al catálogo después de 2 segundos
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
        // Redirigir al catálogo después de 2 segundos
        setTimeout(() => {
          this.router.navigateByUrl('/catalogo');
        }, 2000);
      }
    });
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
