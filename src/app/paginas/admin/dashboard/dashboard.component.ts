import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { ProductService, Celular } from '../../../core/product.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  productos: Celular[] = [];
  productoEditando: Celular | null = null;
  modoEdicion = false;
  mostrarFormulario = false;

  // Formulario del producto
  productoForm: Celular = this.crearProductoVacio();

  constructor(
    public authService: AuthService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productService.getProductosCache().subscribe({
      next: (productos) => {
        this.productos = productos;
      }
    });
  }

  crearProductoVacio(): Celular {
    return {
      slug: '',
      nombre: '',
      precio: 0,
      foto: '',
      referencia: '',
      bateria: '',
      sistema: '',
      procesador: '',
      ram: '',
      almacenamiento: '',
      pantalla: '',
      camara: ''
    };
  }

  abrirFormularioNuevo(): void {
    this.modoEdicion = false;
    this.productoForm = this.crearProductoVacio();
    this.mostrarFormulario = true;
  }

  editarProducto(producto: Celular): void {
    this.modoEdicion = true;
    this.productoEditando = producto;
    this.productoForm = { ...producto };
    this.mostrarFormulario = true;
  }

  guardarProducto(): void {
    // Generar slug si no existe
    if (!this.productoForm.slug || this.productoForm.slug === '') {
      this.productoForm.slug = this.productService.generarSlug(this.productoForm.nombre);
    }

    if (this.modoEdicion && this.productoEditando) {
      this.productService.actualizarProducto(this.productoEditando.slug, this.productoForm);
    } else {
      this.productService.agregarProducto(this.productoForm);
    }

    this.cerrarFormulario();
  }

  eliminarProducto(slug: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productService.eliminarProducto(slug);
    }
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.productoForm = this.crearProductoVacio();
    this.productoEditando = null;
  }

  cerrarSesion(): void {
    this.authService.logout();
  }
}
