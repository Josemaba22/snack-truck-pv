import { Injectable, computed, signal } from '@angular/core';

import { CartItemUi, cartItemTotal, IngredientSummary } from '../models/ui/cart-item.ui';
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

  addProduct(
    product: ProductResponse,
    addedIngredients: IngredientSummary[],
    removedIngredients: IngredientSummary[],
  ): void {
    const item: CartItemUi = {
      cartItemId: crypto.randomUUID(),
      product,
      addedIngredients,
      removedIngredients,
    };
    this.itemsSignal.update((items) => [...items, item]);
  }

  updateIngredients(
    cartItemId: string,
    addedIngredients: IngredientSummary[],
    removedIngredients: IngredientSummary[],
  ): void {
    this.itemsSignal.update((items) =>
      items.map((item) =>
        item.cartItemId === cartItemId ? { ...item, addedIngredients, removedIngredients } : item,
      ),
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
