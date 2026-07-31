import { Injectable, computed, signal } from '@angular/core';

import { CartItemUi, cartItemTotal, AddonSummary } from '../models/ui/cart-item.ui';
import { ProductResponse } from '../models/api/product.api';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly itemsSignal = signal<CartItemUi[]>([]);
  private readonly notesSignal = signal<string | null>(null);

  readonly items = this.itemsSignal.asReadonly();
  readonly notes = this.notesSignal.asReadonly();

  readonly total = computed(() =>
    this.itemsSignal().reduce((sum, item) => sum + cartItemTotal(item), 0),
  );

  readonly isEmpty = computed(() => this.itemsSignal().length === 0);

  addProduct(product: ProductResponse, addons: AddonSummary[]): void {
    const item: CartItemUi = {
      cartItemId: crypto.randomUUID(),
      product,
      selectedAddons: addons,
    };
    this.itemsSignal.update((items) => [...items, item]);
  }

  updateAddons(cartItemId: string, addons: AddonSummary[]): void {
    this.itemsSignal.update((items) =>
      items.map((item) => (item.cartItemId === cartItemId ? { ...item, selectedAddons: addons } : item)),
    );
  }

  removeItem(cartItemId: string): void {
    this.itemsSignal.update((items) => items.filter((item) => item.cartItemId !== cartItemId));
  }

  setNotes(notes: string): void {
    this.notesSignal.set(notes.trim().length > 0 ? notes : null);
  }

  clear(): void {
    this.itemsSignal.set([]);
    this.notesSignal.set(null);
  }
}
