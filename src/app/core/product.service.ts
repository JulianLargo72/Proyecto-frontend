import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, map, catchError, of } from 'rxjs';
import { SlugUtil } from './utils/slug.util';

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
  private readonly jsonUrl = 'data/productos.json';
  
  // Cache local de productos para el CRUD
  private productosCache$ = new BehaviorSubject<Celular[]>([]);
  private cacheLoaded = false;

  constructor() {
    this.loadProductos();
  }

  private loadProductos(): void {
    if (this.cacheLoaded) return;

    this.getCelulares().subscribe({
      next: (productos) => {
        this.productosCache$.next(productos);
        this.cacheLoaded = true;
      },
      error: (err) => console.error('Error al cargar productos:', err)
    });
  }

  // Obtener todos los celulares desde el JSON
  getCelulares(): Observable<Celular[]> {
    return this.http.get<Celular[]>(this.jsonUrl).pipe(
      tap(productos => {
        if (!this.cacheLoaded) {
          this.productosCache$.next(productos);
          this.cacheLoaded = true;
        }
      }),
      catchError(error => {
        console.error('Error al obtener productos:', error);
        return of([]);
      })
    );
  }

  // Obtener productos desde el cache
  getProductosCache(): Observable<Celular[]> {
    return this.productosCache$.asObservable();
  }

  // Obtener un celular por slug desde el cache (reactivo)
  getBySlug(slug: string): Observable<Celular | undefined> {
    return this.productosCache$.pipe(
      map(celulares => celulares.find(c => c.slug === slug))
    );
  }

  // CRUD Methods (trabajan con el cache local y retornan Observables para consistencia)
  
  agregarProducto(producto: Omit<Celular, 'slug'>): Observable<Celular> {
    const nuevoProducto: Celular = {
      ...producto,
      slug: SlugUtil.generar(producto.nombre)
    };

    const productos = this.productosCache$.value;
    this.productosCache$.next([...productos, nuevoProducto]);

    return of(nuevoProducto);
  }

  actualizarProducto(slug: string, productoActualizado: Partial<Celular>): Observable<Celular | undefined> {
    const productos = this.productosCache$.value;
    const index = productos.findIndex(p => p.slug === slug);
    
    if (index === -1) {
      console.warn(`Producto con slug "${slug}" no encontrado`);
      return of(undefined);
    }

    const productoModificado = { ...productos[index], ...productoActualizado };
    const nuevosProductos = [
      ...productos.slice(0, index),
      productoModificado,
      ...productos.slice(index + 1)
    ];

    this.productosCache$.next(nuevosProductos);

    return of(productoModificado);
  }

  eliminarProducto(slug: string): Observable<boolean> {
    const productos = this.productosCache$.value;
    const productosFiltrados = productos.filter(p => p.slug !== slug);

    if (productos.length === productosFiltrados.length) {
      console.warn(`Producto con slug "${slug}" no encontrado para eliminar`);
      return of(false);
    }

    this.productosCache$.next(productosFiltrados);

    return of(true);
  }

  // Generar slug automáticamente desde el nombre (delegado a utilidad)
  generarSlug(nombre: string): string {
    return SlugUtil.generar(nombre);
  }
}
