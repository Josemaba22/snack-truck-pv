import { Component, computed, output, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { Dialog } from '../../../shared/dialog/dialog';
import { CartService } from '../../../services/cart';
import { OrdersApiService } from '../../../services/orders-api';
import { OrdersStore } from '../../../services/orders-store';
import { OrderRequest } from '../../../models/api/order.api';

const QUICK_BILLS = [50, 100, 200, 500];
const KEY_DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

@Component({
  selector: 'app-payment-form',
  imports: [CurrencyPipe, Dialog],
  templateUrl: './payment-form.html',
  styleUrl: './payment-form.css',
})
export class PaymentForm {
  readonly quickBills = QUICK_BILLS;
  readonly digits = KEY_DIGITS;

  paid = output<void>();

  inputBuffer = signal('');
  submitting = signal(false);
  errorMessage = signal<string | null>(null);
  confirmPayOpen = signal(false);

  readonly total = computed(() => this.cart.total());

  readonly amountReceived = computed(() => {
    const parsed = parseFloat(this.inputBuffer());
    return Number.isNaN(parsed) ? 0 : parsed;
  });

  readonly missingAmount = computed(() => Math.max(this.total() - this.amountReceived(), 0));
  readonly change = computed(() => Math.max(this.amountReceived() - this.total(), 0));
  readonly canConfirm = computed(
    () => this.missingAmount() === 0 && !this.cart.isEmpty() && !this.submitting(),
  );

  constructor(
    readonly cart: CartService,
    private readonly ordersApi: OrdersApiService,
    private readonly ordersStore: OrdersStore,
  ) {}

  appendDigit(digit: string): void {
    if (digit === '.' && this.inputBuffer().includes('.')) {
      return;
    }
    this.inputBuffer.update((value) => value + digit);
  }

  backspace(): void {
    this.inputBuffer.update((value) => value.slice(0, -1));
  }

  addBill(value: number): void {
    const next = this.amountReceived() + value;
    this.inputBuffer.set(String(next));
  }

  openConfirmDialog(): void {
    if (!this.canConfirm()) {
      return;
    }
    this.confirmPayOpen.set(true);
  }

  dismissConfirmDialog(): void {
    this.confirmPayOpen.set(false);
  }

  confirm(): void {
    this.confirmPayOpen.set(false);

    if (!this.canConfirm()) {
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

    const request: OrderRequest = {
      items: this.cart.items().map((item) => ({
        productId: item.product.id,
        quantity: 1,
        selectedAddonIds: item.selectedAddons.map((addon) => addon.addonId),
      })),
      notes: this.cart.notes(),
      paymentMethod: 'CASH',
    };

    this.ordersApi.create(request).subscribe({
      next: () => {
        this.submitting.set(false);
        this.cart.clear();
        this.ordersStore.refresh();
        this.paid.emit();
      },
      error: (err) => {
        this.submitting.set(false);
        this.errorMessage.set('No se pudo crear la orden. Verifica los datos e intenta de nuevo.');
        console.error(err);
      },
    });
  }
}
