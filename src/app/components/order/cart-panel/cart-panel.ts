import { Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CartService } from '../../../services/cart';
import { Dialog } from '../../../shared/dialog/dialog';
import { SelectedAddons } from '../../products/selected-addons/selected-addons';
import { CartItemUi, cartItemTotal } from '../../../models/ui/cart-item.ui';

@Component({
  selector: 'app-cart-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, Dialog, SelectedAddons],
  templateUrl: './cart-panel.html',
  styleUrl: './cart-panel.css',
})
export class CartPanel {
  addSnack = output<void>();
  editItem = output<CartItemUi>();
  cancelledOrder = output<void>();
  checkout = output<void>();

  confirmCancelOpen = signal(false);

  constructor(readonly cart: CartService) {}

  lineTotal(item: CartItemUi): number {
    return cartItemTotal(item);
  }

  onNotesChange(value: string): void {
    this.cart.setNotes(value);
  }

  removeItem(cartItemId: string): void {
    this.cart.removeItem(cartItemId);
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
