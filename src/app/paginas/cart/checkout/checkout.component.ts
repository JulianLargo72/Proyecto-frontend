import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../core/cart.service';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, CurrencyPipe, RouterModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  // Datos del formulario
  formData = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    departamento: '',
    metodoPago: 'tarjeta',
    numeroTarjeta: '',
    nombreTarjeta: '',
    fechaExpiracion: '',
    cvv: ''
  };

  pedidoRealizado = false;
  numeroPedido = '';

  constructor(public cart: CartService, public router: Router) {}

  ngOnInit(): void {
    // Si el carrito está vacío, redirigir al catálogo
    if (this.cart.getItems().length === 0) {
      this.router.navigateByUrl('/catalogo');
    }
  }

  volver() {
    this.router.navigateByUrl('/carrito');
  }

  realizarPedido() {
    // Validación básica
    if (!this.formData.nombre || !this.formData.email || !this.formData.telefono || !this.formData.direccion) {
      alert('Por favor, completa todos los campos obligatorios');
      return;
    }

    // Generar número de pedido
    this.numeroPedido = 'PED-' + Date.now().toString().slice(-8);
    
    // Simular procesamiento del pedido
    this.pedidoRealizado = true;
    
    // Limpiar el carrito después de 2 segundos
    setTimeout(() => {
      this.cart.clear();
      this.router.navigateByUrl('/catalogo');
    }, 5000);
  }
}
