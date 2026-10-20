import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { liveQuery } from 'dexie';
import { firstValueFrom, from } from 'rxjs';

import { CatalogRepository } from './catalog-repository';
import { LocalDb } from './local-db';
import { fromServerOrder } from './orders-repository';
import { OrdersApiService } from './orders-api';
import { OrderRequest, OrderStatus } from '../models/api/order.api';
import { LocalOrder, OutboxEntry } from '../models/local/local-order';

const SYNC_INTERVAL_MS = 30_000;
const CATALOG_MAX_AGE_MS = 5 * 60_000;

// Rechazos definitivos del servidor: reintentar no los arregla (408/429 sí son transitorios).
function isRejection(error: unknown): error is HttpErrorResponse {
  return (
    error instanceof HttpErrorResponse &&
    error.status >= 400 &&
    error.status < 500 &&
    error.status !== 408 &&
    error.status !== 429
  );
}

function errorMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    return error.error?.message ?? error.message;
  }
  return error instanceof Error ? error.message : String(error);
}

// Vacía la cola de cambios hacia la API, baja órdenes y catálogo, y expone el estado de conexión.
// En iOS no hay Background Sync, así que todo ocurre con la app abierta.
@Injectable({ providedIn: 'root' })
export class SyncService {
  readonly online = signal(navigator.onLine);
  readonly syncing = signal(false);

  readonly pendingCount = toSignal(
    from(liveQuery(() => this.db.outbox.filter((entry) => !entry.failed).count())),
    { initialValue: 0 },
  );
  readonly failedCount = toSignal(
    from(liveQuery(() => this.db.outbox.filter((entry) => entry.failed).count())),
    { initialValue: 0 },
  );

  private running = false;
  private rerunRequested = false;
  private lastCatalogRefresh = 0;

  constructor(
    private readonly db: LocalDb,
    private readonly ordersApi: OrdersApiService,
    private readonly catalog: CatalogRepository,
  ) {
    window.addEventListener('online', () => {
      this.online.set(true);
      this.lastCatalogRefresh = 0;
      void this.sync();
    });
    window.addEventListener('offline', () => this.online.set(false));
    setInterval(() => void this.sync(), SYNC_INTERVAL_MS);

    // Evita que Safari borre IndexedDB (y con ella las órdenes aún sin sincronizar).
    void navigator.storage?.persist?.();
    void this.sync();
  }

  async sync(): Promise<void> {
    // Sin catálogo guardado se usa el empaquetado, así la app arranca aunque no haya API.
    await this.catalog.seedIfEmpty().catch((error) => console.error('Sin catálogo inicial', error));

    if (!this.online()) {
      return;
    }
    if (this.running) {
      // Algo cambió durante el ciclo en curso: se hace otra pasada al terminar.
      this.rerunRequested = true;
      return;
    }
    this.running = true;
    this.syncing.set(true);
    try {
      await this.refreshCatalogIfStale();
      await this.flushOutbox();
      await this.pullOrders();
    } finally {
      this.running = false;
      this.syncing.set(false);
    }
    if (this.rerunRequested) {
      this.rerunRequested = false;
      await this.sync();
    }
  }

  // Devuelve a la cola lo que el servidor rechazó, por si ya se corrigió la causa.
  async retryFailed(): Promise<void> {
    await this.db.transaction('rw', [this.db.orders, this.db.outbox], async () => {
      const failed = await this.db.outbox.filter((entry) => entry.failed).toArray();
      for (const entry of failed) {
        await this.db.outbox.update(entry.seq!, { failed: false, lastError: null });
        if (entry.type === 'create-order') {
          await this.db.orders.update(entry.orderId, { syncState: 'pending', syncError: null });
        }
      }
    });
    await this.sync();
  }

  private async refreshCatalogIfStale(): Promise<void> {
    if (Date.now() - this.lastCatalogRefresh < CATALOG_MAX_AGE_MS) {
      return;
    }
    try {
      await this.catalog.refresh();
      this.lastCatalogRefresh = Date.now();
    } catch (error) {
      console.error('No se pudo actualizar el catálogo', error);
    }
  }

  private async flushOutbox(): Promise<void> {
    const entries = await this.db.outbox.orderBy('seq').toArray();
    // Si un cambio de una orden fue rechazado, los siguientes de esa orden no se envían.
    const blockedOrders = new Set<string>();

    for (const entry of entries) {
      if (entry.failed) {
        blockedOrders.add(entry.orderId);
        continue;
      }
      if (blockedOrders.has(entry.orderId)) {
        continue;
      }

      const order = await this.db.orders.get(entry.orderId);
      if (!order) {
        await this.db.outbox.delete(entry.seq!);
        continue;
      }

      try {
        await this.send(entry, order);
        await this.db.outbox.delete(entry.seq!);
      } catch (error) {
        if (isRejection(error)) {
          await this.markFailed(entry, errorMessage(error));
          blockedOrders.add(entry.orderId);
          continue;
        }
        // Sin red o error del servidor: se conserva el orden y se reintenta en el siguiente ciclo.
        await this.db.outbox.update(entry.seq!, {
          attempts: entry.attempts + 1,
          lastError: errorMessage(error),
        });
        return;
      }
    }
  }

  private async send(entry: OutboxEntry, order: LocalOrder): Promise<void> {
    if (entry.type === 'create-order') {
      const created = await firstValueFrom(this.ordersApi.create(toOrderRequest(order)));
      await this.db.orders.update(order.id, {
        serverId: created.id,
        orderNumber: created.orderNumber,
        displayNumber: String(created.orderNumber),
        subtotal: created.subtotal,
        total: created.total,
        items: created.items,
        syncState: 'synced',
        syncError: null,
      });
      return;
    }

    if (!order.serverId) {
      throw new Error('La orden aún no existe en el servidor');
    }
    await firstValueFrom(
      this.ordersApi.updateStatus(order.serverId, entry.status as OrderStatus, entry.at),
    );
  }

  private async markFailed(entry: OutboxEntry, message: string): Promise<void> {
    await this.db.transaction('rw', [this.db.orders, this.db.outbox], async () => {
      await this.db.outbox.update(entry.seq!, { failed: true, lastError: message });
      if (entry.type === 'create-order') {
        await this.db.orders.update(entry.orderId, { syncState: 'failed', syncError: message });
      }
    });
  }

  private async pullOrders(): Promise<void> {
    let serverOrders;
    try {
      serverOrders = await firstValueFrom(this.ordersApi.getAll());
    } catch (error) {
      console.error('No se pudieron descargar las órdenes', error);
      return;
    }

    await this.db.transaction('rw', [this.db.orders, this.db.outbox], async () => {
      // Lo que tiene cambios sin enviar manda sobre lo que diga el servidor.
      const withPendingChanges = new Set((await this.db.outbox.toArray()).map((e) => e.orderId));

      for (const serverOrder of serverOrders) {
        const incoming = fromServerOrder(serverOrder);
        if (withPendingChanges.has(incoming.id)) {
          continue;
        }
        const existing = await this.db.orders.get(incoming.id);
        await this.db.orders.put(
          existing ? { ...incoming, localNumber: existing.localNumber } : incoming,
        );
      }
    });
  }
}

function toOrderRequest(order: LocalOrder): OrderRequest {
  return {
    items: order.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      extraIngredientIds: item.ingredients
        .filter((ingredient) => ingredient.action === 'ADDED')
        .map((ingredient) => ingredient.ingredientId),
      removedIngredientIds: item.ingredients
        .filter((ingredient) => ingredient.action === 'REMOVED')
        .map((ingredient) => ingredient.ingredientId),
    })),
    notes: order.notes,
    customerName: order.customerName,
    paymentMethod: order.paymentMethod,
    clientOrderId: order.id,
    createdAt: order.createdAt,
  };
}
