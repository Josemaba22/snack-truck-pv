import { Component, computed, input, output, signal } from '@angular/core';

import { OrderResponse, OrderStatus } from '../../../models/api/order.api';
import { OrderCard } from '../order-card/order-card';

const PAGE_SIZE = 4;
const SWIPE_THRESHOLD_PX = 50;

@Component({
  selector: 'app-order-card-list',
  imports: [OrderCard],
  templateUrl: './order-card-list.html',
  styleUrl: './order-card-list.css',
})
export class OrderCardList {
  orders = input.required<OrderResponse[]>();

  advance = output<{ id: string; nextStatus: OrderStatus }>();

  private readonly requestedPage = signal(0);

  private swipeStartX: number | null = null;

  readonly pageCount = computed(() => Math.max(1, Math.ceil(this.orders().length / PAGE_SIZE)));

  readonly currentPage = computed(() => Math.min(this.requestedPage(), this.pageCount() - 1));

  readonly pages = computed(() => Array.from({ length: this.pageCount() }, (_, index) => index));

  readonly pagedOrders = computed(() => {
    const start = this.currentPage() * PAGE_SIZE;
    return this.orders().slice(start, start + PAGE_SIZE);
  });

  goToPage(page: number): void {
    this.requestedPage.set(Math.min(Math.max(page, 0), this.pageCount() - 1));
  }

  onSwipeStart(event: PointerEvent): void {
    this.swipeStartX = event.clientX;
  }

  onSwipeEnd(event: PointerEvent): void {
    if (this.swipeStartX === null) {
      return;
    }

    const deltaX = event.clientX - this.swipeStartX;
    this.swipeStartX = null;

    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) {
      return;
    }

    this.goToPage(this.currentPage() + (deltaX > 0 ? 1 : -1));
  }
}
