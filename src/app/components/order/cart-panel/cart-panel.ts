import { Component, output, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { CartService } from '../../../services/cart';
import { Dialog } from '../../../shared/dialog/dialog';
import { CartItemUi, cartItemTotal } from '../../../models/ui/cart-item.ui';

@Component({
  selector: 'app-cart-panel',
  standalone: true,
  imports: [CurrencyPipe, Dialog],
  templateUrl: './cart-panel.html',
  styleUrl: './cart-panel.css',
})
export class CartPanel {
  addSnack = output<void>();
  editItem = output<CartItemUi>();
  cancelledOrder = output<void>();
  checkout = output<void>();

  confirmCancelOpen = signal(false);
  itemPendingRemoval = signal<CartItemUi | null>(null);

  constructor(readonly cart: CartService) {}

  lineTotal(item: CartItemUi): number {
    return cartItemTotal(item);
  }

  openRemoveConfirm(item: CartItemUi): void {
    this.itemPendingRemoval.set(item);
  }

  confirmRemove(): void {
    const item = this.itemPendingRemoval();
    if (item) {
      this.cart.removeItem(item.cartItemId);
    }
    this.itemPendingRemoval.set(null);
  }

  dismissRemove(): void {
    this.itemPendingRemoval.set(null);
  }

  openCancelConfirm(): void {
    this.confirmCancelOpen.set(true);
  }

  confirmCancel(): void {
    this.confirmCancelOpen.set(false);
    this.cart.clear();
    this.cancelledOrder.emit();
  }

  dismissCancel(): void {
    this.confirmCancelOpen.set(false);
  }
}
