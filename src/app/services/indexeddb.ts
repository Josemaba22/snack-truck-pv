import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';

import { CategoryDb } from '../models/db/category.db';
import { ProductDb } from '../models/db/product.db';
import { ProductAddonDb } from '../models/db/product-addon.db';
import { ProductDetailDb } from '../models/db/product-detail.db';

@Injectable({ providedIn: 'root' })
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

  // ========== CATEGORÍAS ==========

  /**
   * Obtiene todas las categorías ordenadas por displayOrder
   */
  async getCategories(): Promise<CategoryDb[]> {
    return this.categories.orderBy('displayOrder').toArray();
  }

  /**
   * Obtiene una categoría por su ID
   */
  async getCategoryById(id: string): Promise<CategoryDb | undefined> {
    return this.categories.get(id);
  }

  /**
   * Agrega una nueva categoría
   * @returns El ID generado
   */
  async addCategory(category: CategoryDb): Promise<string> {
    return this.categories.add(category);
  }

  /**
   * Actualiza una categoría existente
   */
  async updateCategory(id: string, changes: Partial<CategoryDb>): Promise<void> {
    await this.categories.update(id, changes);
  }

  /**
   * Elimina una categoría por su ID
   */
  async deleteCategory(id: string): Promise<void> {
    await this.categories.delete(id);
  }

  /**
   * Obtiene la cantidad de categorías
   */
  async getCategoriesCount(): Promise<number> {
    return this.categories.count();
  }

  // ========== PRODUCTOS ==========

  /**
   * Obtiene todos los productos
   */
  async getProducts(): Promise<ProductDb[]> {
    return this.products.toArray();
  }

  /**
   * Obtiene productos por categoría
   */
  async getProductsByCategory(categoryId: string): Promise<ProductDb[]> {
    return this.products.where('categoryId').equals(categoryId).toArray();
  }

  /**
   * Agrega un producto
   */
  async addProduct(product: ProductDb): Promise<string> {
    return this.products.add(product);
  }

  /**
   * Elimina un producto
   */
  async deleteProduct(id: string): Promise<void> {
    await this.products.delete(id);
  }

  // ========== UTILIDADES ==========

  /**
   * Limpia todas las tablas (útil para testing o reset)
   */
  async clearAll(): Promise<void> {
    await this.categories.clear();
    await this.products.clear();
    await this.addons.clear();
    await this.productDetails.clear();
  }
}
