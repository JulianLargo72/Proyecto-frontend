import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { ProductService, Celular } from '../../../core/product.service';
import { AccesorioService, Accesorio } from '../../../core/accesorio.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  // Control de tabs
  tabActiva: 'productos' | 'accesorios' = 'productos';

  // Productos
  productos: Celular[] = [];
  productoEditando: Celular | null = null;
  modoEdicionProducto = false;
  mostrarFormularioProducto = false;
  productoForm: Celular = this.crearProductoVacio();

  // Accesorios
  accesorios: Accesorio[] = [];
  accesorioEditando: Accesorio | null = null;
  modoEdicionAccesorio = false;
  mostrarFormularioAccesorio = false;
  accesorioForm: Accesorio = this.crearAccesorioVacio();

  constructor(
    public authService: AuthService,
    private productService: ProductService,
    private accesorioService: AccesorioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarAccesorios();
  }

  // ============ MÉTODOS DE PRODUCTOS ============
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

  abrirFormularioNuevoProducto(): void {
    this.modoEdicionProducto = false;
    this.productoForm = this.crearProductoVacio();
    this.mostrarFormularioProducto = true;
  }

  editarProducto(producto: Celular): void {
    this.modoEdicionProducto = true;
    this.productoEditando = producto;
    this.productoForm = { ...producto };
    this.mostrarFormularioProducto = true;
  }

  guardarProducto(): void {
    if (!this.productoForm.slug || this.productoForm.slug === '') {
      this.productoForm.slug = this.productService.generarSlug(this.productoForm.nombre);
    }

    if (this.modoEdicionProducto && this.productoEditando) {
      this.productService.actualizarProducto(this.productoEditando.slug, this.productoForm);
    } else {
      this.productService.agregarProducto(this.productoForm);
    }

    this.cerrarFormularioProducto();
  }

  eliminarProducto(slug: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productService.eliminarProducto(slug);
    }
  }

  cerrarFormularioProducto(): void {
    this.mostrarFormularioProducto = false;
    this.productoForm = this.crearProductoVacio();
    this.productoEditando = null;
  }

  // ============ MÉTODOS DE ACCESORIOS ============
  cargarAccesorios(): void {
    this.accesorioService.getAccesoriosCache().subscribe({
      next: (accesorios) => {
        this.accesorios = accesorios;
      }
    });
  }

  crearAccesorioVacio(): Accesorio {
    return {
      slug: '',
      nombre: '',
      marca: '',
      precio: 0,
      foto: '',
      informacion_adicional: ''
    };
  }

  abrirFormularioNuevoAccesorio(): void {
    this.modoEdicionAccesorio = false;
    this.accesorioForm = this.crearAccesorioVacio();
    this.mostrarFormularioAccesorio = true;
  }

  editarAccesorio(accesorio: Accesorio): void {
    this.modoEdicionAccesorio = true;
    this.accesorioEditando = accesorio;
    this.accesorioForm = { ...accesorio };
    this.mostrarFormularioAccesorio = true;
  }

  guardarAccesorio(): void {
    if (!this.accesorioForm.slug || this.accesorioForm.slug === '') {
      // Generar slug automáticamente basado en el nombre
      this.accesorioForm.slug = this.accesorioForm.nombre
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    }

    if (this.modoEdicionAccesorio && this.accesorioEditando) {
      this.accesorioService.actualizarAccesorio(this.accesorioEditando.slug, this.accesorioForm);
    } else {
      this.accesorioService.agregarAccesorio(this.accesorioForm);
    }

    this.cerrarFormularioAccesorio();
  }

  eliminarAccesorio(slug: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este accesorio?')) {
      this.accesorioService.eliminarAccesorio(slug);
    }
  }

  cerrarFormularioAccesorio(): void {
    this.mostrarFormularioAccesorio = false;
    this.accesorioForm = this.crearAccesorioVacio();
    this.accesorioEditando = null;
  }

  // ============ MÉTODOS GENERALES ============
  cambiarTab(tab: 'productos' | 'accesorios'): void {
    this.tabActiva = tab;
  }

  cerrarSesion(): void {
    this.authService.logout();
  }
}
