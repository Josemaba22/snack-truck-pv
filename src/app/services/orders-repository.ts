import { Injectable } from '@angular/core';

import { LocalDb } from './local-db';
import { localIsoNow } from '../core/local-time';
import { lineSubtotal, sumAmounts } from '../core/order-math';
import { OrderDetailResponse, OrderResponse, OrderStatus } from '../models/api/order.api';
import { CartItemUi } from '../models/ui/cart-item.ui';
import { LocalOrder } from '../models/local/local-order';

// Mismas transiciones que la API; el operador puede corregir una etapa equivocada.
const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['IN_PROGRESS', 'READY'],
  IN_PROGRESS: ['PENDING', 'READY'],
  READY: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
  COMPLETED: ['READY'],
};

export interface NewOrderInput {
  readonly items: CartItemUi[];

  readonly customerName: string | null;
}

export function fromServerOrder(order: OrderResponse): LocalOrder {
  const { clientOrderId, ...rest } = order;
  return {
    ...rest,
    id: clientOrderId ?? order.id,
    serverId: order.id,
    localNumber: 0,
    displayNumber: String(order.orderNumber),
    syncState: 'synced',
    syncError: null,
  };
}

// Escribe en IndexedDB y encola el cambio; nunca habla con la red (eso es del SyncService).
@Injectable({ providedIn: 'root' })
export class OrdersRepository {
  constructor(private readonly db: LocalDb) {}

  async create(input: NewOrderInput): Promise<LocalOrder> {
    const now = localIsoNow();
    const items = input.items.map(toOrderDetail);
    const subtotal = sumAmounts(items.map((item) => item.subtotal));
    const id = crypto.randomUUID();

    return this.db.transaction('rw', [this.db.orders, this.db.outbox], async () => {
      const last = await this.db.orders.orderBy('localNumber').last();
      const localNumber = (last?.localNumber ?? 0) + 1;

      const order: LocalOrder = {
        id,
        serverId: null,
        orderNumber: null,
        localNumber,
        displayNumber: `L-${localNumber}`,
        status: 'PENDING',
        subtotal,
        total: subtotal,
        customerName: input.customerName,
        paymentMethod: 'CASH',
        createdAt: now,
        completedAt: null,
        items,
        syncState: 'pending',
        syncError: null,
      };

      await this.db.orders.add(order);
      await this.db.outbox.add({
        orderId: id,
        type: 'create-order',
        at: now,
        attempts: 0,
        failed: false,
        lastError: null,
      });
      return order;
    });
  }

  async changeStatus(orderId: string, target: OrderStatus): Promise<void> {
    await this.db.transaction('rw', [this.db.orders, this.db.outbox], () =>
      this.applyStatus(orderId, target),
    );
  }

  // Entrega la orden de una vez: el avance PENDING -> IN_PROGRESS -> READY de cocina es solo
  // visual, así que aquí se registran los pasos intermedios que la API exige, en una sola escritura.
  async complete(orderId: string): Promise<void> {
    await this.db.transaction('rw', [this.db.orders, this.db.outbox], async () => {
      const order = await this.db.orders.get(orderId);
      if (!order) {
        throw new Error(`Orden desconocida: ${orderId}`);
      }
      if (order.status === 'PENDING') {
        await this.applyStatus(orderId, 'IN_PROGRESS');
      }
      if (order.status === 'PENDING' || order.status === 'IN_PROGRESS') {
        await this.applyStatus(orderId, 'READY');
      }
      await this.applyStatus(orderId, 'COMPLETED');
    });
  }

  private async applyStatus(orderId: string, target: OrderStatus): Promise<void> {
    const order = await this.db.orders.get(orderId);
    if (!order) {
      throw new Error(`Orden desconocida: ${orderId}`);
    }
    if (!ALLOWED_TRANSITIONS[order.status].includes(target)) {
      throw new Error(`Transición no permitida: ${order.status} -> ${target}`);
    }

    const now = localIsoNow();
    let completedAt = order.completedAt;
    if (target === 'COMPLETED') {
      completedAt = now;
    } else if (order.status === 'COMPLETED') {
      completedAt = null;
    }

    await this.db.orders.update(orderId, { status: target, completedAt });
    await this.db.outbox.add({
      orderId,
      type: 'update-status',
      status: target,
      at: now,
      attempts: 0,
      failed: false,
      lastError: null,
    });
  }
}

function toOrderDetail(item: CartItemUi): OrderDetailResponse {
  const quantity = 1;
  const ingredients = [
    ...item.addedIngredients.map((ingredient) => ({
      id: crypto.randomUUID(),
      ingredientId: ingredient.ingredientId,
      ingredientName: ingredient.ingredientName,
      unitPrice: ingredient.ingredientPrice,
      action: 'ADDED' as const,
    })),
    // Quitar un ingrediente base nunca descuenta del precio.
    ...item.removedIngredients.map((ingredient) => ({
      id: crypto.randomUUID(),
      ingredientId: ingredient.ingredientId,
      ingredientName: ingredient.ingredientName,
      unitPrice: 0,
      action: 'REMOVED' as const,
    })),
  ];

  return {
    id: crypto.randomUUID(),
    productId: item.product.id,
    productName: item.product.name,
    quantity,
    unitPrice: item.product.price,
    notes: item.notes,
    ingredients,
    subtotal: lineSubtotal(
      item.product.price,
      item.addedIngredients.map((ingredient) => ingredient.ingredientPrice),
      quantity,
    ),
  };
}
