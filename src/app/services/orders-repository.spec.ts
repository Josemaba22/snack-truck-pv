import Dexie from 'dexie';
import { IDBFactory } from 'fake-indexeddb';
import { beforeEach, describe, expect, it } from 'vitest';

import { LocalDb } from './local-db';
import { OrdersRepository } from './orders-repository';
import { CartItemUi } from '../models/ui/cart-item.ui';

const product = {
  id: 'p1',
  name: 'Marquesita',
  description: null,
  price: 45,
  categoryId: 'c1',
  categoryName: 'Dulces',
  available: true,
  imageUrl: null,
  createdAt: '2026-01-01T00:00:00',
};

const item: CartItemUi = {
  cartItemId: 'ci1',
  product,
  addedIngredients: [{ ingredientId: 'i1', ingredientName: 'Queso', ingredientPrice: 10 }],
  removedIngredients: [{ ingredientId: 'i2', ingredientName: 'Nutella', ingredientPrice: 12 }],
  notes: 'sin picante',
};

describe('OrdersRepository', () => {
  let db: LocalDb;
  let repository: OrdersRepository;

  beforeEach(() => {
    Dexie.dependencies.indexedDB = new IDBFactory();
    db = new LocalDb();
    repository = new OrdersRepository(db);
  });

  it('crea la orden en local con totales, folio provisional y entrada en la cola', async () => {
    const order = await repository.create({ items: [item], customerName: 'Ana' });

    expect(order.status).toBe('PENDING');
    expect(order.total).toBe(55);
    expect(order.displayNumber).toBe('L-1');
    expect(order.items[0].notes).toBe('sin picante');
    expect(order.items[0].ingredients.map((i) => [i.action, i.unitPrice])).toEqual([
      ['ADDED', 10],
      ['REMOVED', 0],
    ]);

    const outbox = await db.outbox.toArray();
    expect(outbox).toHaveLength(1);
    expect(outbox[0]).toMatchObject({ orderId: order.id, type: 'create-order', failed: false });
  });

  it('numera las órdenes locales de forma consecutiva', async () => {
    await repository.create({ items: [item], customerName: null });
    const second = await repository.create({ items: [item], customerName: null });

    expect(second.displayNumber).toBe('L-2');
  });

  it('permite avanzar y regresar el estatus, y encola cada cambio', async () => {
    const order = await repository.create({ items: [item], customerName: null });

    await repository.changeStatus(order.id, 'READY');
    await repository.changeStatus(order.id, 'COMPLETED');
    expect((await db.orders.get(order.id))?.completedAt).not.toBeNull();

    await repository.changeStatus(order.id, 'READY');
    const reverted = await db.orders.get(order.id);
    expect(reverted?.status).toBe('READY');
    expect(reverted?.completedAt).toBeNull();
    expect(await db.outbox.count()).toBe(4);
  });

  it('rechaza transiciones que la API no permite', async () => {
    const order = await repository.create({ items: [item], customerName: null });

    await expect(repository.changeStatus(order.id, 'COMPLETED')).rejects.toThrow();
    expect(await db.outbox.count()).toBe(1);
  });
});
