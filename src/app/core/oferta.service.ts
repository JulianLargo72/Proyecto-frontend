import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, map, catchError, of } from 'rxjs';
import { SlugUtil } from './utils/slug.util';

export interface Oferta {
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
  descuento: number;
}

@Injectable({
  providedIn: 'root'
})
export class OfertaService {
  private http = inject(HttpClient);
  private readonly jsonUrl = '/data/ofertas.json';
  
  // Cache local de ofertas para el CRUD (Patrón Observer)
  private ofertasCache$ = new BehaviorSubject<Oferta[]>([]);
  private cacheLoaded = false;

  constructor() {
    this.loadOfertas();
  }

  private loadOfertas(): void {
    if (this.cacheLoaded) return;

    this.getOfertas().subscribe({
      next: (ofertas) => {
        this.ofertasCache$.next(ofertas);
        this.cacheLoaded = true;
      },
      error: (err) => console.error('Error al cargar ofertas:', err)
    });
  }

  // Obtener todas las ofertas desde el JSON
  getOfertas(): Observable<Oferta[]> {
    return this.http.get<Oferta[]>(this.jsonUrl).pipe(
      tap(ofertas => {
        if (!this.cacheLoaded) {
          this.ofertasCache$.next(ofertas);
          this.cacheLoaded = true;
        }
      }),
      catchError(error => {
        console.error('Error al obtener ofertas:', error);
        return of([]);
      })
    );
  }

  // Obtener ofertas desde el cache (reactivo)
  getOfertasCache(): Observable<Oferta[]> {
    return this.ofertasCache$.asObservable();
  }

  // Obtener una oferta por slug desde el cache (reactivo)
  getBySlug(slug: string): Observable<Oferta | undefined> {
    return this.ofertasCache$.pipe(
      map(ofertas => ofertas.find(o => o.slug === slug))
    );
  }

  // Calcular precio con descuento
  calcularPrecioConDescuento(oferta: Oferta): number {
    return oferta.precio * (1 - oferta.descuento / 100);
  }

  // CRUD Methods (trabajan con el cache local y retornan Observables para consistencia)
  
  agregarOferta(oferta: Omit<Oferta, 'slug'>): Observable<Oferta> {
    const nuevaOferta: Oferta = {
      ...oferta,
      slug: SlugUtil.generar(oferta.nombre)
    };

    const ofertas = this.ofertasCache$.value;
    this.ofertasCache$.next([...ofertas, nuevaOferta]);

    return of(nuevaOferta);
  }

  actualizarOferta(slug: string, ofertaActualizada: Partial<Oferta>): Observable<Oferta | undefined> {
    const ofertas = this.ofertasCache$.value;
    const index = ofertas.findIndex(o => o.slug === slug);
    
    if (index === -1) {
      console.warn(`Oferta con slug "${slug}" no encontrada`);
      return of(undefined);
    }

    const ofertaModificada = { ...ofertas[index], ...ofertaActualizada };
    const nuevasOfertas = [
      ...ofertas.slice(0, index),
      ofertaModificada,
      ...ofertas.slice(index + 1)
    ];

    this.ofertasCache$.next(nuevasOfertas);

    return of(ofertaModificada);
  }

  eliminarOferta(slug: string): Observable<boolean> {
    const ofertas = this.ofertasCache$.value;
    const ofertasFiltradas = ofertas.filter(o => o.slug !== slug);

    if (ofertas.length === ofertasFiltradas.length) {
      console.warn(`Oferta con slug "${slug}" no encontrada para eliminar`);
      return of(false);
    }

    this.ofertasCache$.next(ofertasFiltradas);

    return of(true);
  }

  // Generar slug automáticamente desde el nombre (delegado a utilidad)
  generarSlug(nombre: string): string {
    return SlugUtil.generar(nombre);
  }
}
