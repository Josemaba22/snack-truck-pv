import { Injectable, computed, signal } from '@angular/core';
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

  // Etapa de cocina (en preparación / lista) solo en memoria: no se escribe en IndexedDB ni se
  // sincroniza hasta que la orden se entrega.
  private readonly stages = signal<Record<string, OrderStatus>>({});

  readonly activeOrders = computed(() =>
    this.orders()
      .filter((order) => ACTIVE_STATUSES.has(order.status))
      .map((order) => {
        const stage = this.stages()[order.id];
        return stage ? { ...order, status: stage } : order;
      })
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
    const persisted = this.orders().find((order) => order.id === orderId)?.status;
    if (status === 'COMPLETED') {
      await this.repository.complete(orderId);
      this.clearStage(orderId);
      void this.sync.sync();
    } else if (persisted === 'COMPLETED') {
      // Deshacer una entrega sí es un cambio real.
      await this.repository.changeStatus(orderId, status);
      void this.sync.sync();
    } else {
      this.stages.update((stages) => ({ ...stages, [orderId]: status }));
    }
  }

  private clearStage(orderId: string): void {
    this.stages.update(({ [orderId]: _, ...rest }) => rest);
  }
}
