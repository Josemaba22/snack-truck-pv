import { CategoryDb } from '../db/category.db';
import { ProductAddonDb } from '../db/product-addon.db';
import { ProductDb } from '../db/product.db';

export interface ProductView extends ProductDb {
  readonly category: CategoryDb;

  readonly addons: ProductAddonDb[];
}
