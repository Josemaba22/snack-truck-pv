import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Catalog } from '../../components/products/catalog/catalog';
import { CustomProduct } from '../../components/products/custom-product/custom-product';
import { CartPanel } from '../../components/order/cart-panel/cart-panel';
import { PaymentForm } from '../../components/payment/payment-form/payment-form';
import { CartService } from '../../services/cart';
import { ProductResponse } from '../../models/api/product.api';
import { AddonSummary, CartItemUi } from '../../models/ui/cart-item.ui';

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
  editingInitialAddons = signal<AddonSummary[]>([]);

  constructor(
    private readonly cart: CartService,
    private readonly router: Router,
  ) {}

  onProductSelected(product: ProductResponse): void {
    this.selectedProduct.set(product);
    this.editingCartItemId.set(null);
    this.editingInitialAddons.set([]);
    this.step.set('personalize');
  }

  onEditItem(item: CartItemUi): void {
    this.selectedProduct.set(item.product);
    this.editingCartItemId.set(item.cartItemId);
    this.editingInitialAddons.set(item.selectedAddons);
    this.step.set('personalize');
  }

  onPersonalizeBack(): void {
    this.step.set(this.editingCartItemId() ? 'summary' : 'catalog');
  }

  onSnackSaved(addons: AddonSummary[]): void {
    const editingId = this.editingCartItemId();
    if (editingId) {
      this.cart.updateAddons(editingId, addons);
    } else {
      const product = this.selectedProduct();
      if (product) {
        this.cart.addProduct(product, addons);
      }
    }

    this.selectedProduct.set(null);
    this.editingCartItemId.set(null);
    this.editingInitialAddons.set([]);
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
