import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import Dexie from 'dexie';
import { IDBFactory } from 'fake-indexeddb';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CatalogRepository } from './catalog-repository';
import { LocalDb } from './local-db';
import { OrdersApiService } from './orders-api';
import { OrdersRepository } from './orders-repository';
import { SyncService } from './sync';
import { OrderResponse } from '../models/api/order.api';
import { CartItemUi } from '../models/ui/cart-item.ui';

const item: CartItemUi = {
  cartItemId: 'ci1',
  product: {
    id: 'p1',
    name: 'Marquesita',
    description: null,
    price: 45,
    categoryId: 'c1',
    categoryName: 'Dulces',
    available: true,
    imageUrl: null,
    createdAt: '2026-01-01T00:00:00',
  },
  addedIngredients: [],
  removedIngredients: [],
};

function serverOrder(overrides: Partial<OrderResponse> = {}): OrderResponse {
  return {
    id: 'srv-1',
    clientOrderId: null,
    orderNumber: 7,
    status: 'PENDING',
    subtotal: 45,
    total: 45,
    notes: null,
    customerName: null,
    paymentMethod: 'CASH',
    createdAt: '2026-10-19T10:00:00',
    completedAt: null,
    items: [],
    ...overrides,
  };
}

describe('SyncService', () => {
  let db: LocalDb;
  let repository: OrdersRepository;
  let ordersApi: { create: any; getAll: any; updateStatus: any };
  let sync: SyncService;

  beforeEach(() => {
    Dexie.dependencies.indexedDB = new IDBFactory();
    db = new LocalDb();
    repository = new OrdersRepository(db);
    ordersApi = {
      create: vi.fn(),
      getAll: vi.fn(() => of([])),
      updateStatus: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: LocalDb, useValue: db },
        { provide: OrdersApiService, useValue: ordersApi },
        {
          provide: CatalogRepository,
          useValue: { refresh: () => Promise.resolve(), seedIfEmpty: () => Promise.resolve() },
        },
      ],
    });
    sync = TestBed.inject(SyncService);
  });

  it('envía la creación con clientOrderId y luego el cambio de estatus, en orden', async () => {
    const order = await repository.create({ items: [item], notes: null, customerName: null });
    await repository.changeStatus(order.id, 'IN_PROGRESS');

    ordersApi.create.mockReturnValue(of(serverOrder({ clientOrderId: order.id })));
    ordersApi.updateStatus.mockReturnValue(of(serverOrder({ status: 'IN_PROGRESS' })));

    await sync.sync();

    expect(ordersApi.create).toHaveBeenCalledWith(
      expect.objectContaining({ clientOrderId: order.id, createdAt: order.createdAt }),
    );
    expect(ordersApi.updateStatus).toHaveBeenCalledWith('srv-1', 'IN_PROGRESS', expect.any(String));

    const synced = await db.orders.get(order.id);
    expect(synced).toMatchObject({ serverId: 'srv-1', orderNumber: 7, displayNumber: '7', syncState: 'synced' });
    expect(await db.outbox.count()).toBe(0);
  });

  it('conserva la cola cuando no hay red y reintenta después', async () => {
    const order = await repository.create({ items: [item], notes: null, customerName: null });
    ordersApi.create.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 0 })));

    await sync.sync();

    expect(await db.outbox.count()).toBe(1);
    expect((await db.orders.get(order.id))?.syncState).toBe('pending');

    ordersApi.create.mockReturnValue(of(serverOrder({ clientOrderId: order.id })));
    await sync.sync();

    // Si ya había un ciclo en curso, la pasada extra termina un poco después.
    await vi.waitFor(async () => expect(await db.outbox.count()).toBe(0));
  });

  it('marca como fallida una creación rechazada y no envía sus cambios posteriores', async () => {
    const order = await repository.create({ items: [item], notes: null, customerName: null });
    await repository.changeStatus(order.id, 'READY');
    ordersApi.create.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 409, error: { message: 'Product is not available' } })),
    );

    await sync.sync();

    expect(ordersApi.updateStatus).not.toHaveBeenCalled();
    expect((await db.orders.get(order.id))?.syncState).toBe('failed');
    expect((await db.outbox.toArray()).map((e) => e.failed)).toEqual([true, false]);
  });

  it('descarga órdenes del servidor sin pisar las que tienen cambios pendientes', async () => {
    const local = await repository.create({ items: [item], notes: null, customerName: null });
    await db.outbox.clear();
    await db.orders.update(local.id, { serverId: 'srv-2', syncState: 'synced' });
    await repository.changeStatus(local.id, 'READY');

    ordersApi.updateStatus.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 0 })));
    ordersApi.getAll.mockReturnValue(
      of([
        serverOrder({ id: 'srv-2', clientOrderId: local.id, status: 'PENDING' }),
        serverOrder({ id: 'srv-9', orderNumber: 9 }),
      ]),
    );

    await sync.sync();

    expect((await db.orders.get(local.id))?.status).toBe('READY');
    expect(await db.orders.get('srv-9')).toMatchObject({ serverId: 'srv-9', displayNumber: '9' });
  });
});
