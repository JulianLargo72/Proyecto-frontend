import { Injectable } from '@angular/core';

export interface CartItem {
  slug: string;
  nombre: string;
  precio: number;
  foto: string;
  qty: number;
  tipo?: 'producto' | 'accesorio'; // Opcional: para diferenciar el tipo de item
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private items: CartItem[] = [];

  getItems() { return this.items; }

  add(item: Omit<CartItem, 'qty'>, qty = 1) {
    const found = this.items.find(i => i.slug === item.slug);
    if (found) found.qty += qty;
    else this.items.push({ ...item, qty });
  }

  setQty(slug: string, qty: number) {
    const it = this.items.find(i => i.slug === slug);
    if (!it) return;
    
    // Si la cantidad es 0 o menor, eliminar el producto
    if (qty <= 0) {
      this.remove(slug);
    } else {
      it.qty = qty;
    }
  }

  remove(slug: string) {
    this.items = this.items.filter(i => i.slug !== slug);
  }

  clear() { this.items = []; }

  get total() {
    return this.items.reduce((sum, i) => sum + i.precio * i.qty, 0);
  }
}
