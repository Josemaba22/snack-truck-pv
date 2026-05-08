import { Injectable } from '@angular/core';

import { IndexedDbService } from './indexeddb';

import { ProductView } from '../models/view/product.view';
import { CategoryDb } from '../models/db/category.db';

@Injectable({
  providedIn: 'root',
})
export class ProductsRepository {
  constructor(private readonly db: IndexedDbService) {}

  // ========== PRODUCTOS ==========

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

  async getProductsByCategory(categoryId: string): Promise<ProductView[]> {
    const products = await this.db.getProductsByCategory(categoryId);
    const categories = await this.db.categories.toArray();
    const productDetails = await this.db.productDetails.toArray();
    const addons = await this.db.addons.toArray();

    return products.map((product) => {
      const category = categories.find((c) => c.id === product.categoryId)!;
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

  // ========== CATEGORÍAS ==========

  /**
   * Obtiene todas las categorías
   */
  async getCategories(): Promise<CategoryDb[]> {
    return this.db.getCategories();
  }

  /**
   * Obtiene una categoría por ID
   */
  async getCategoryById(id: string): Promise<CategoryDb | undefined> {
    return this.db.getCategoryById(id);
  }

  /**
   * Agrega una nueva categoría
   */
  async addCategory(category: CategoryDb): Promise<string> {
    return this.db.addCategory(category);
  }

  /**
   * Actualiza una categoría
   */
  async updateCategory(id: string, changes: Partial<CategoryDb>): Promise<void> {
    return this.db.updateCategory(id, changes);
  }

  /**
   * Elimina una categoría
   */
  async deleteCategory(id: string): Promise<void> {
    return this.db.deleteCategory(id);
  }
}
