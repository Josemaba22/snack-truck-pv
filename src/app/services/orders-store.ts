import { Injectable, computed, signal } from '@angular/core';
import { timer } from 'rxjs';

import { OrdersApiService } from './orders-api';
import { OrderResponse } from '../models/api/order.api';

const POLL_INTERVAL_MS = 12000;

const ACTIVE_STATUSES = new Set(['PENDING', 'IN_PROGRESS', 'READY']);

@Injectable({ providedIn: 'root' })
export class OrdersStore {
  private readonly ordersSignal = signal<OrderResponse[]>([]);

  readonly orders = this.ordersSignal.asReadonly();

  readonly activeOrders = computed(() =>
    this.ordersSignal().filter((order) => ACTIVE_STATUSES.has(order.status)),
  );

  readonly deliveredOrders = computed(() =>
    this.ordersSignal().filter((order) => order.status === 'COMPLETED'),
  );

  constructor(private readonly ordersApi: OrdersApiService) {
    timer(0, POLL_INTERVAL_MS).subscribe(() => this.refresh());
  }

  refresh(): void {
    this.ordersApi.getAll().subscribe({
      next: (orders) => this.ordersSignal.set(orders),
      error: (error) => console.error('No se pudieron cargar las órdenes', error),
    });
  }
}
