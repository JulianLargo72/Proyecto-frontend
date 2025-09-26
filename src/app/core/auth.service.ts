import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _logged$ = new BehaviorSubject<boolean>(false);
  logged$ = this._logged$.asObservable();

  // DEMO: credenciales
  private demo = { user: 'admin', pass: 'admin123' };

  constructor(private router: Router) {}

  login(user: string, pass: string): boolean {
    const ok = user === this.demo.user && pass === this.demo.pass;
    this._logged$.next(ok);
    return ok;
  }

  logout() {
    this._logged$.next(false);
    this.router.navigateByUrl('/');
  }

  get isLogged() {
    return this._logged$.value;
  }
}

