import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';

export interface Accesorio {
  slug: string;
  nombre: string;
  marca: string;
  precio: number;
  foto: string;
  informacion_adicional: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccesorioService {
  private accesoriosCache$ = new BehaviorSubject<Accesorio[]>([]);
  private cacheLoaded = false;

  constructor(private http: HttpClient) {
    // Cargar accesorios al inicializar el servicio
    this.loadAccesorios();
  }

  // Cargar accesorios desde el JSON y almacenar en cache
  private loadAccesorios(): void {
    if (this.cacheLoaded) return;

    this.http.get<Accesorio[]>('/data/accesorios.json').pipe(
      catchError(error => {
        console.error('Error al cargar accesorios:', error);
        return of([]);
      })
    ).subscribe(accesorios => {
      this.accesoriosCache$.next(accesorios);
      this.cacheLoaded = true;
    });
  }

  // Obtener todos los accesorios desde el JSON (para carga inicial)
  getAccesorios(): Observable<Accesorio[]> {
    return this.http.get<Accesorio[]>('/data/accesorios.json').pipe(
      tap(accesorios => {
        if (!this.cacheLoaded) {
          this.accesoriosCache$.next(accesorios);
          this.cacheLoaded = true;
        }
      }),
      catchError(error => {
        console.error('Error al obtener accesorios:', error);
        return of([]);
      })
    );
  }

  // Obtener accesorios desde el cache (reactivo)
  getAccesoriosCache(): Observable<Accesorio[]> {
    return this.accesoriosCache$.asObservable();
  }

  // Obtener un accesorio por slug desde el cache (reactivo)
  getBySlug(slug: string): Observable<Accesorio | undefined> {
    return this.accesoriosCache$.pipe(
      map(accesorios => accesorios.find(a => a.slug === slug))
    );
  }

  // Agregar un nuevo accesorio (CRUD - Create)
  agregarAccesorio(accesorio: Omit<Accesorio, 'slug'>): Observable<Accesorio> {
    const nuevoAccesorio: Accesorio = {
      ...accesorio,
      slug: this.generarSlug(accesorio.nombre)
    };

    const accesoriosActuales = this.accesoriosCache$.value;
    const nuevosAccesorios = [...accesoriosActuales, nuevoAccesorio];
    this.accesoriosCache$.next(nuevosAccesorios);

    // TODO: En producción, hacer POST al backend
    // return this.http.post<Accesorio>('/api/accesorios', nuevoAccesorio);
    return of(nuevoAccesorio);
  }

  // Actualizar un accesorio existente (CRUD - Update)
  actualizarAccesorio(slug: string, accesorioActualizado: Partial<Accesorio>): Observable<Accesorio | undefined> {
    const accesoriosActuales = this.accesoriosCache$.value;
    const index = accesoriosActuales.findIndex(a => a.slug === slug);

    if (index === -1) {
      console.warn(`Accesorio con slug "${slug}" no encontrado`);
      return of(undefined);
    }

    const accesorioModificado = { ...accesoriosActuales[index], ...accesorioActualizado };
    const nuevosAccesorios = [
      ...accesoriosActuales.slice(0, index),
      accesorioModificado,
      ...accesoriosActuales.slice(index + 1)
    ];

    this.accesoriosCache$.next(nuevosAccesorios);

    // TODO: En producción, hacer PUT al backend
    // return this.http.put<Accesorio>(`/api/accesorios/${slug}`, accesorioModificado);
    return of(accesorioModificado);
  }

  // Eliminar un accesorio (CRUD - Delete)
  eliminarAccesorio(slug: string): Observable<boolean> {
    const accesoriosActuales = this.accesoriosCache$.value;
    const nuevosAccesorios = accesoriosActuales.filter(a => a.slug !== slug);

    if (accesoriosActuales.length === nuevosAccesorios.length) {
      console.warn(`Accesorio con slug "${slug}" no encontrado para eliminar`);
      return of(false);
    }

    this.accesoriosCache$.next(nuevosAccesorios);

    // TODO: En producción, hacer DELETE al backend
    // return this.http.delete(`/api/accesorios/${slug}`).pipe(map(() => true));
    return of(true);
  }

  // Generar slug a partir del nombre
  private generarSlug(nombre: string): string {
    return nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
      .replace(/[^a-z0-9\s-]/g, '') // Eliminar caracteres especiales
      .trim()
      .replace(/\s+/g, '-') // Espacios a guiones
      .replace(/-+/g, '-'); // Múltiples guiones a uno solo
  }
}
