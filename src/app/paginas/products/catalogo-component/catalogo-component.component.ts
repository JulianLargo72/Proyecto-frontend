import { CurrencyPipe, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/product.service';

@Component({
  selector: 'app-catalogo-component',
  standalone: true,
  imports: [CurrencyPipe,RouterModule, RouterLink],
  templateUrl: './catalogo-component.component.html',
  styleUrl: './catalogo-component.component.css'
})
export class CatalogoComponentComponent implements OnInit {

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.celulares = [
        {
          nombre: 'Samsung Galaxy S24 Ultra 256GB',
          precio: 3649900,  // COP
          foto: 'https://media.falabella.com/falabellaCO/127936384_01/w=1500,h=1500,fit=pad',
          slug: 'Samsung-Galaxy-S24-Ultra'
        },
        {
          nombre: 'Samsung Galaxy S24 FE',
          precio: 2699900,
          foto: 'https://media.falabella.com/falabellaCO/73142852_1/w=1500,h=1500,fit=pad',
          slug: 'Samsung-Galaxy-S24-FE'
        },
        {
          nombre: 'Xiaomi Redmi Note 13 256GB',
          precio: 1499900,
          foto: 'https://media.falabella.com/falabellaCO/129848285_01/w=1500,h=1500,fit=pad',
          slug: 'Xiaomi-Redmi-Note-13'
        },
        {
          nombre: 'Xiaomi Redmi 12 256GB',
          precio: 1189533,
          foto: 'https://www.alkosto.com/medias/750Wx750H-master-hotfolder-transfer-incoming-deposit-hybris-interfaces-IN-media-product-6941812731246-001.jpg?context=bWFzdGVyfGltYWdlc3wyMDUxNTJ8aW1hZ2UvanBlZ3xhR0ZoTDJoaU9TOHhNemcwTWprMU1UQXhNak00TWk4M05UQlhlRGMxTUVoZmJXRnpkR1Z5TDJodmRHWnZiR1JsY2k5MGNtRnVjMlpsY2k5cGJtTnZiV2x1Wnk5a1pYQnZjMmwwTDJoNVluSnBjeTFwYm5SbGNtWmhZMlZ6TDBsT0wyMWxaR2xoTDNCeWIyUjFZM1F2TmprME1UZ3hNamN6TVRJME5sOHdNREV1YW5Cbnw5ZmQwMTY0NDBiZDlkNTQ1ODU0ZDQ0MTI0Y2U4YjUxNTZiNzlmMDllYmMyYTUzYzI3OTA0Njk4NGFjZTBlMWRi',
          slug: 'Xiaomi-Redmi-12'
        },
        {
          nombre: 'Apple iPhone 15 128GB',
          precio: 3899900,
          foto: 'https://exitocol.vtexassets.com/arquivos/ids/22695882/iphone-15-128gb-nuevo-negro.jpg?v=638697002090670000',
          slug: 'Apple-iPhone-15'
        },
        {
          nombre: 'Motorola Edge 50 Neo 5G 256GB',
          precio: 799900,
          foto: 'https://media.falabella.com/falabellaCO/73004861_1/w=1500,h=1500,fit=pad',
          slug: 'Motorola-Edge-50-Neo-5G'
        },
        {
          nombre: 'Samsung Galaxy A54 5G',
          precio: 1499900,
          foto: 'https://www.alkosto.com/medias/8806094990720-001-750Wx750H?context=bWFzdGVyfGltYWdlc3wxMjQwNnxpbWFnZS93ZWJwfGFESXpMMmc0WWk4eE5ETTNOelV3TXpBek1UTXlOaTg0T0RBMk1EazBPVGt3TnpJd1h6QXdNVjgzTlRCWGVEYzFNRWd8ZGQ0NDEwNGM0ZjI4ZWIyMTEyYWI5OWE5NzM4MDg3MmYyZDIyMjA1YzJmMWY2NjA1YjRjMTI0ZTFiNDFkMmQwYg',
          slug: 'Samsung-Galaxy-A54-5G'
        },
        {
          nombre: 'Google Pixel 8 128GB',
          precio: 3199900,
          foto: 'https://media.falabella.com/falabellaCO/142770947_01/w=1500,h=1500,fit=pad',
          slug: 'Google-Pixel-8'
        },
        {
          nombre: 'OnePlus Nord CE3 5G',
          precio: 1299900,
          foto: 'https://http2.mlstatic.com/D_NQ_NP_965543-MCO70395717340_072023-O.webp',
          slug: 'OnePlus-Nord-CE3-5G'
        },
        {
          nombre: 'Poco X6 Pro 5G',
          precio: 2099900,
          foto: 'https://media.falabella.com/falabellaCO/128594791_01/w=1500,h=1500,fit=pad',
          slug: 'Poco-X6-Pro-5G'
        }]
    }, 100);

    
    //this.productService.setCelulares(conSlug);
  }

  celulares!: any[];

  onImgError(ev: Event) {
    const el = ev.target as HTMLImageElement;
    el.src = '/img/placeholder.png'; // fallback en caso de error
  }

  slugify(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize('NFD')                // quita acentos
    .replace(/[\u0300-\u036f]/g, '') // remueve diacríticos
    .replace(/[^a-z0-9]+/g, '-')     // reemplaza espacios/caracteres por guión
    .replace(/(^-|-$)/g, '');        // quita guiones al inicio/fin
}
}
