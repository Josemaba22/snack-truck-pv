import { Injectable } from '@angular/core';

import { IndexedDbService } from './indexeddb';

import { ProductView } from '../models/view/product.view';

@Injectable({
  providedIn: 'root',
})
export class ProductsRepository {
  constructor(private readonly db: IndexedDbService) {}

  async getProducts(): Promise<ProductView[]> {
    const [products, categories, productDetails, addons] = await Promise.all([
      this.db.products.toArray(),
      this.db.categories.toArray(),
      this.db.productDetails.toArray(),
      this.db.addons.toArray(),
    ]);

    return products.map((product) => {
      const category = categories.find((category) => category.id === product.categoryId)!;

      const productAddons = productDetails
        .filter((detail) => detail.productId === product.id)
        .map((detail) => {
          const addon = addons.find((addon) => addon.id === detail.addonId)!;

          return {
            ...addon,
            price: detail.priceOverride ?? addon.price,
          };
        });

      return {
        ...product,
        category,
        addons: productAddons,
      };
    });
  }
}
