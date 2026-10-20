import { Component, computed, output, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { Dialog } from '../../../shared/dialog/dialog';
import { CartService } from '../../../services/cart';
import { OrdersStore } from '../../../services/orders-store';

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
  back = output<void>();

  inputBuffer = signal('');
  submitting = signal(false);
  errorMessage = signal<string | null>(null);
  confirmPayOpen = signal(false);
  customerName = signal('');

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

  setCustomerName(value: string): void {
    this.customerName.set(value);
  }

  confirm(): void {
    this.confirmPayOpen.set(false);

    if (!this.canConfirm()) {
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

    this.ordersStore
      .create({
        items: this.cart.items(),
        notes: this.cart.notes(),
        customerName: this.customerName().trim().length > 0 ? this.customerName().trim() : null,
      })
      .then(() => {
        this.submitting.set(false);
        this.cart.clear();
        this.customerName.set('');
        this.paid.emit();
      })
      .catch((err) => {
        this.submitting.set(false);
        this.errorMessage.set('No se pudo guardar la orden. Intenta de nuevo.');
        console.error(err);
      });
  }
}
