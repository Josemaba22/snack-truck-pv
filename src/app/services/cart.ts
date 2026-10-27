import { Injectable, computed, signal } from '@angular/core';

import { CartItemUi, cartItemTotal, IngredientSummary } from '../models/ui/cart-item.ui';
import { ProductResponse } from '../models/api/product.api';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly itemsSignal = signal<CartItemUi[]>([]);

  readonly items = this.itemsSignal.asReadonly();

  readonly total = computed(() =>
    this.itemsSignal().reduce((sum, item) => sum + cartItemTotal(item), 0),
  );

  readonly isEmpty = computed(() => this.itemsSignal().length === 0);

  addProduct(
    product: ProductResponse,
    addedIngredients: IngredientSummary[],
    removedIngredients: IngredientSummary[],
    notes: string | null,
  ): void {
    const item: CartItemUi = {
      cartItemId: crypto.randomUUID(),
      product,
      addedIngredients,
      removedIngredients,
      notes,
    };
    this.itemsSignal.update((items) => [...items, item]);
  }

  updateItem(
    cartItemId: string,
    addedIngredients: IngredientSummary[],
    removedIngredients: IngredientSummary[],
    notes: string | null,
  ): void {
    this.itemsSignal.update((items) =>
      items.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, addedIngredients, removedIngredients, notes }
          : item,
      ),
    );
  }

  removeItem(cartItemId: string): void {
    this.itemsSignal.update((items) => items.filter((item) => item.cartItemId !== cartItemId));
  }

  clear(): void {
    this.itemsSignal.set([]);
  }
}
