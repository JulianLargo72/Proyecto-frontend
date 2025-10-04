import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { ProductService, Celular } from '../../../core/product.service';
import { AccesorioService, Accesorio } from '../../../core/accesorio.service';
import { OfertaService, Oferta } from '../../../core/oferta.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  // Control de tabs
  tabActiva: 'productos' | 'accesorios' | 'ofertas' = 'productos';

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

  // Ofertas
  ofertas: Oferta[] = [];
  ofertaEditando: Oferta | null = null;
  modoEdicionOferta = false;
  mostrarFormularioOferta = false;
  ofertaForm!: Oferta;

  constructor(
    public authService: AuthService,
    private productService: ProductService,
    private accesorioService: AccesorioService,
    private ofertaService: OfertaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ofertaForm = this.crearOfertaVacia();
    this.cargarProductos();
    this.cargarAccesorios();
    this.cargarOfertas();
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
      this.productService.actualizarProducto(this.productoEditando.slug, this.productoForm).subscribe({
        next: () => console.log('Producto actualizado correctamente'),
        error: (err) => console.error('Error al actualizar producto:', err)
      });
    } else {
      this.productService.agregarProducto(this.productoForm).subscribe({
        next: () => console.log('Producto agregado correctamente'),
        error: (err) => console.error('Error al agregar producto:', err)
      });
    }

    this.cerrarFormularioProducto();
  }

  eliminarProducto(slug: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productService.eliminarProducto(slug).subscribe({
        next: (success) => {
          if (success) {
            console.log('Producto eliminado correctamente');
          }
        },
        error: (err) => console.error('Error al eliminar producto:', err)
      });
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
      this.accesorioForm.slug = this.accesorioService.generarSlug(this.accesorioForm.nombre);
    }

    if (this.modoEdicionAccesorio && this.accesorioEditando) {
      this.accesorioService.actualizarAccesorio(this.accesorioEditando.slug, this.accesorioForm).subscribe({
        next: () => console.log('Accesorio actualizado correctamente'),
        error: (err) => console.error('Error al actualizar accesorio:', err)
      });
    } else {
      this.accesorioService.agregarAccesorio(this.accesorioForm).subscribe({
        next: () => console.log('Accesorio agregado correctamente'),
        error: (err) => console.error('Error al agregar accesorio:', err)
      });
    }

    this.cerrarFormularioAccesorio();
  }

  eliminarAccesorio(slug: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este accesorio?')) {
      this.accesorioService.eliminarAccesorio(slug).subscribe({
        next: (success) => {
          if (success) {
            console.log('Accesorio eliminado correctamente');
          }
        },
        error: (err) => console.error('Error al eliminar accesorio:', err)
      });
    }
  }

  cerrarFormularioAccesorio(): void {
    this.mostrarFormularioAccesorio = false;
    this.accesorioForm = this.crearAccesorioVacio();
    this.accesorioEditando = null;
  }

  // ============ MÉTODOS GENERALES ============
  cambiarTab(tab: 'productos' | 'accesorios' | 'ofertas'): void {
    this.tabActiva = tab;
  }

  cerrarSesion(): void {
    this.authService.logout();
  }

  // ============ MÉTODOS DE OFERTAS ============
  cargarOfertas(): void {
    this.ofertaService.getOfertasCache().subscribe({
      next: (ofertas) => {
        this.ofertas = ofertas;
      }
    });
  }

  crearOfertaVacia(): Oferta {
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
      camara: '',
      descuento: 0
    };
  }

  abrirFormularioNuevaOferta(): void {
    this.modoEdicionOferta = false;
    this.ofertaForm = this.crearOfertaVacia();
    this.mostrarFormularioOferta = true;
  }

  editarOferta(oferta: Oferta): void {
    this.modoEdicionOferta = true;
    this.ofertaEditando = oferta;
    this.ofertaForm = { ...oferta };
    this.mostrarFormularioOferta = true;
  }

  guardarOferta(): void {
    if (!this.ofertaForm.slug || this.ofertaForm.slug === '') {
      this.ofertaForm.slug = this.ofertaService.generarSlug(this.ofertaForm.nombre);
    }

    if (this.modoEdicionOferta && this.ofertaEditando) {
      this.ofertaService.actualizarOferta(this.ofertaEditando.slug, this.ofertaForm).subscribe({
        next: () => console.log('Oferta actualizada correctamente'),
        error: (err) => console.error('Error al actualizar oferta:', err)
      });
    } else {
      this.ofertaService.agregarOferta(this.ofertaForm).subscribe({
        next: () => console.log('Oferta agregada correctamente'),
        error: (err) => console.error('Error al agregar oferta:', err)
      });
    }

    this.cerrarFormularioOferta();
  }

  eliminarOferta(slug: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta oferta?')) {
      this.ofertaService.eliminarOferta(slug).subscribe({
        next: (success) => {
          if (success) {
            console.log('Oferta eliminada correctamente');
          }
        },
        error: (err) => console.error('Error al eliminar oferta:', err)
      });
    }
  }

  cerrarFormularioOferta(): void {
    this.mostrarFormularioOferta = false;
    this.ofertaForm = this.crearOfertaVacia();
    this.ofertaEditando = null;
  }
}
