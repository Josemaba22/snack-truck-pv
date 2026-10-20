import { Injectable, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { liveQuery } from 'dexie';
import { from } from 'rxjs';

import { LocalDb } from './local-db';
import { NewOrderInput, OrdersRepository } from './orders-repository';
import { SyncService } from './sync';
import { OrderStatus } from '../models/api/order.api';
import { LocalOrder } from '../models/local/local-order';

const ACTIVE_STATUSES = new Set<OrderStatus>(['PENDING', 'IN_PROGRESS', 'READY']);

// Lo que ve la UI: órdenes leídas de IndexedDB (se actualizan solas) y acciones que escriben
// en local y disparan la sincronización.
@Injectable({ providedIn: 'root' })
export class OrdersStore {
  readonly orders = toSignal(from(liveQuery(() => this.db.orders.toArray())), {
    initialValue: [] as LocalOrder[],
  });

  readonly activeOrders = computed(() =>
    this.orders()
      .filter((order) => ACTIVE_STATUSES.has(order.status))
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
  );

  readonly deliveredOrders = computed(() =>
    this.orders()
      .filter((order) => order.status === 'COMPLETED')
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  );

  constructor(
    private readonly db: LocalDb,
    private readonly repository: OrdersRepository,
    private readonly sync: SyncService,
  ) {}

  async create(input: NewOrderInput): Promise<LocalOrder> {
    const order = await this.repository.create(input);
    void this.sync.sync();
    return order;
  }

  async changeStatus(orderId: string, status: OrderStatus): Promise<void> {
    await this.repository.changeStatus(orderId, status);
    void this.sync.sync();
  }
}
