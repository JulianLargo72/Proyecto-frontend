import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, catchError, of } from 'rxjs';

export interface Usuario {
  id: number;
  username: string;
  password: string;
  nombre: string;
  email: string;
  rol: string;
}

export interface UsuarioAutenticado {
  id: number;
  username: string;
  nombre: string;
  email: string;
  rol: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private usuariosUrl = '/data/usuarios.json';
  
  private _currentUser$ = new BehaviorSubject<UsuarioAutenticado | null>(null);
  currentUser$ = this._currentUser$.asObservable();

  constructor() {
    // Restaurar sesión desde localStorage
    this.restoreSession();
  }

  private restoreSession(): void {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this._currentUser$.next(user);
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    }
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http.get<Usuario[]>(this.usuariosUrl).pipe(
      map(usuarios => {
        const usuario = usuarios.find(
          u => u.username === username && u.password === password
        );

        if (usuario) {
          const usuarioAuth: UsuarioAutenticado = {
            id: usuario.id,
            username: usuario.username,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol
          };
          
          // Guardar en localStorage
          localStorage.setItem('currentUser', JSON.stringify(usuarioAuth));
          this._currentUser$.next(usuarioAuth);
          return true;
        }
        return false;
      }),
      catchError(() => of(false))
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this._currentUser$.next(null);
    this.router.navigateByUrl('/');
  }

  get isLogged(): boolean {
    return this._currentUser$.value !== null;
  }

  get currentUser(): UsuarioAutenticado | null {
    return this._currentUser$.value;
  }

  get isAdmin(): boolean {
    return this.currentUser?.rol === 'admin' || false;
  }
}

