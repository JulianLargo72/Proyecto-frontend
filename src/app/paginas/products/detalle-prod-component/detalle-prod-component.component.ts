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

  constructor(
    private cart: CartService,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    // 1) intenta desde el servicio
    this.celular = this.productService.getBySlug(slug);

    // 2) fallback si llegaste con state desde el catálogo (opcional)
    if (!this.celular && history.state?.producto) {
      this.celular = history.state.producto;
    }

    // 3) último fallback: vuelve al catálogo
    if (!this.celular) {
      this.router.navigateByUrl('/catalogo');
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
