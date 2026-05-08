import Dexie, { Table } from 'dexie';

import { CategoryDb } from '../models/db/category.db';
import { ProductDb } from '../models/db/product.db';
import { ProductAddonDb } from '../models/db/product-addon.db';
import { ProductDetailDb } from '../models/db/product-detail.db';

export class IndexedDbService extends Dexie {
  categories!: Table<CategoryDb>;
  products!: Table<ProductDb>;
  addons!: Table<ProductAddonDb>;
  productDetails!: Table<ProductDetailDb>;

  constructor() {
    super('snack-truck-pv-db');

    this.version(1).stores({
      categories: 'id, displayOrder',
      products: 'id, categoryId, available',
      addons: 'id',
      productDetails: 'id, productId, addonId',
    });
  }
}
