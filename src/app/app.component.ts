import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./compartidos/componentes/header/header.component";
import { HomeComponent } from './paginas/home/home.component';
import { FooterComponent } from './compartidos/componentes/footer/footer.component';
import { CatalogoComponentComponent } from './paginas/products/catalogo-component/catalogo-component.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
 
}
