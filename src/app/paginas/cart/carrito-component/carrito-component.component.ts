import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe, NgFor } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../../core/cart.service';


@Component({
  selector: 'app-carrito-component',
  imports: [CommonModule, RouterModule, CurrencyPipe],
  templateUrl: './carrito-component.component.html',
  styleUrl: './carrito-component.component.css'
})
export class CarritoComponentComponent {
  constructor(public cart: CartService, private router: Router) {}

  dec(it: CartItem) { 
    // Simplemente disminuir la cantidad. Si llega a 0, el servicio lo eliminará automáticamente
    this.cart.setQty(it.slug, it.qty - 1);
  }
  
  inc(it: CartItem) { 
    this.cart.setQty(it.slug, it.qty + 1); 
  }
  
  back() { 
    this.router.navigateByUrl('/catalogo'); 
  }
  
  pagar() { 
    this.router.navigateByUrl('/checkout'); 
  }
}
