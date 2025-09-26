import { Routes } from '@angular/router';
import { HomeComponent } from './paginas/home/home.component';
import { CatalogoComponentComponent } from './paginas/products/catalogo-component/catalogo-component.component';
import { DetalleProdComponentComponent } from './paginas/products/detalle-prod-component/detalle-prod-component.component';
import { CarritoComponentComponent } from './paginas/cart/carrito-component/carrito-component.component';
import { SoporteComponent } from './paginas/soporte/soporte.component';
import { LoginAdminComponent } from './paginas/auth/login-admin/login-admin.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'home', component: HomeComponent},
    {path: 'catalogo', component: CatalogoComponentComponent},
    {path: 'producto/:slug', component: DetalleProdComponentComponent},
    { path: 'carrito', component: CarritoComponentComponent },
    { path: 'soporte', component: SoporteComponent },
    { path: 'admin/login', component: LoginAdminComponent },
    { path: '**', redirectTo: '' }
];
