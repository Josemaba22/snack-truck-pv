import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Catalog } from '../../components/products/catalog/catalog';
import { CustomProduct, CustomProductSaved } from '../../components/products/custom-product/custom-product';
import { CartPanel } from '../../components/order/cart-panel/cart-panel';
import { PaymentForm } from '../../components/payment/payment-form/payment-form';
import { CartService } from '../../services/cart';
import { ProductResponse } from '../../models/api/product.api';
import { IngredientSummary, CartItemUi } from '../../models/ui/cart-item.ui';

type PosStep = 'catalog' | 'personalize' | 'summary' | 'payment';

@Component({
  selector: 'app-pos',
  imports: [CommonModule, Catalog, CustomProduct, CartPanel, PaymentForm],
  templateUrl: './pos.html',
  styleUrl: './pos.css',
})
export class Pos {
  step = signal<PosStep>('catalog');

  selectedProduct = signal<ProductResponse | null>(null);
  editingCartItemId = signal<string | null>(null);
  editingInitialAddedIngredients = signal<IngredientSummary[]>([]);
  editingInitialRemovedIngredients = signal<IngredientSummary[]>([]);

  constructor(
    private readonly cart: CartService,
    private readonly router: Router,
  ) {}

  onProductSelected(product: ProductResponse): void {
    this.selectedProduct.set(product);
    this.editingCartItemId.set(null);
    this.editingInitialAddedIngredients.set([]);
    this.editingInitialRemovedIngredients.set([]);
    this.step.set('personalize');
  }

  onEditItem(item: CartItemUi): void {
    this.selectedProduct.set(item.product);
    this.editingCartItemId.set(item.cartItemId);
    this.editingInitialAddedIngredients.set(item.addedIngredients);
    this.editingInitialRemovedIngredients.set(item.removedIngredients);
    this.step.set('personalize');
  }

  onPersonalizeBack(): void {
    this.step.set(this.editingCartItemId() ? 'summary' : 'catalog');
  }

  onSnackSaved(saved: CustomProductSaved): void {
    const editingId = this.editingCartItemId();
    if (editingId) {
      this.cart.updateIngredients(editingId, saved.addedIngredients, saved.removedIngredients);
    } else {
      const product = this.selectedProduct();
      if (product) {
        this.cart.addProduct(product, saved.addedIngredients, saved.removedIngredients);
      }
    }

    this.selectedProduct.set(null);
    this.editingCartItemId.set(null);
    this.editingInitialAddedIngredients.set([]);
    this.editingInitialRemovedIngredients.set([]);
    this.step.set('summary');
  }

  onAddSnack(): void {
    this.step.set('catalog');
  }

  onCheckout(): void {
    this.step.set('payment');
  }

  onOrderCancelled(): void {
    this.step.set('catalog');
  }

  onOrderPaid(): void {
    this.step.set('catalog');
    this.router.navigate(['/kitchen']);
  }
}
