import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';

import { CategoryResponse } from '../models/api/category.api';
import { IngredientResponse } from '../models/api/ingredient.api';
import { ProductRecipeDetailResponse } from '../models/api/product-recipe-detail.api';
import { ProductResponse } from '../models/api/product.api';
import { LocalOrder, OutboxEntry } from '../models/local/local-order';

@Injectable({ providedIn: 'root' })
export class LocalDb extends Dexie {
  categories!: Table<CategoryResponse, string>;
  products!: Table<ProductResponse, string>;
  ingredients!: Table<IngredientResponse, string>;
  recipeDetails!: Table<ProductRecipeDetailResponse, string>;
  orders!: Table<LocalOrder, string>;
  outbox!: Table<OutboxEntry, number>;

  constructor() {
    super('snack-truck-pv-db');

    this.version(1).stores({
      categories: 'id, displayOrder',
      products: 'id, categoryId, available',
      addons: 'id',
      productDetails: 'id, productId, addonId',
    });

    // Esquema offline: espejo del catálogo de la API + órdenes locales + cola de sincronización.
    this.version(2)
      .stores({
        categories: 'id, displayOrder',
        products: 'id, categoryId',
        ingredients: 'id',
        recipeDetails: 'id, productId',
        orders: 'id, serverId, status, syncState, createdAt, localNumber',
        outbox: '++seq, orderId',
        addons: null,
        productDetails: null,
      })
      .upgrade((tx) =>
        // Las filas de v1 tenían otra forma (CategoryDb/ProductDb); el catálogo se vuelve a bajar.
        Promise.all([tx.table('categories').clear(), tx.table('products').clear()]),
      );

    // La nota deja de ser de la orden y pasa a cada snack: las órdenes guardadas conservan la
    // suya en el primer snack. No cambian los índices.
    this.version(3)
      .stores({})
      .upgrade((tx) =>
        tx
          .table('orders')
          .toCollection()
          .modify((order: { notes?: string | null; items: { notes?: string | null }[] }) => {
            order.items.forEach((item, index) => {
              item.notes = index === 0 ? (order.notes ?? null) : null;
            });
            delete order.notes;
          }),
      );
  }
}
