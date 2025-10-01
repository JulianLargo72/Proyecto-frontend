import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, map } from 'rxjs';

export interface Celular {
  slug: string;
  nombre: string;
  precio: number;
  foto: string;
  referencia: string;
  bateria: string;
  sistema: string;
  procesador: string;
  ram: string;
  almacenamiento: string;
  pantalla: string;
  camara: string;
}


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private jsonUrl = '/data/productos.json';
  
  // Cache local de productos para el CRUD
  private productosCache$ = new BehaviorSubject<Celular[]>([]);

  constructor() {
    this.loadProductos();
  }

  private loadProductos(): void {
    this.getCelulares().subscribe({
      next: (productos) => this.productosCache$.next(productos),
      error: (err) => console.error('Error al cargar productos:', err)
    });
  }

  // Obtener todos los celulares desde el JSON
  getCelulares(): Observable<Celular[]> {
    return this.http.get<Celular[]>(this.jsonUrl);
  }

  // Obtener productos desde el cache
  getProductosCache(): Observable<Celular[]> {
    return this.productosCache$.asObservable();
  }

  // Obtener un celular por slug desde el JSON
  getBySlug(slug: string): Observable<Celular | undefined> {
    return new Observable(observer => {
      this.getCelulares().subscribe({
        next: (celulares) => {
          const celular = celulares.find(c => c.slug === slug);
          observer.next(celular);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  // CRUD Methods (trabajan con el cache local)
  
  agregarProducto(producto: Celular): void {
    const productos = this.productosCache$.value;
    this.productosCache$.next([...productos, producto]);
  }

  actualizarProducto(slug: string, productoActualizado: Celular): void {
    const productos = this.productosCache$.value;
    const index = productos.findIndex(p => p.slug === slug);
    
    if (index !== -1) {
      productos[index] = productoActualizado;
      this.productosCache$.next([...productos]);
    }
  }

  eliminarProducto(slug: string): void {
    const productos = this.productosCache$.value;
    const productosFiltrados = productos.filter(p => p.slug !== slug);
    this.productosCache$.next(productosFiltrados);
  }

  // Generar slug automáticamente desde el nombre
  generarSlug(nombre: string): string {
    return nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
