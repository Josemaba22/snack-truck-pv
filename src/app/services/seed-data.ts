import { Injectable } from '@angular/core';

import { IndexedDbService } from './indexeddb';
import { CategoryDb } from '../models/db/category.db';
import { ProductDb } from '../models/db/product.db';
import { ProductAddonDb } from '../models/db/product-addon.db';
import { ProductDetailDb } from '../models/db/product-detail.db';

@Injectable({
  providedIn: 'root',
})
export class SeedData {
  constructor(private readonly db: IndexedDbService) {}

  /**
   * Pobla la base de datos con datos de ejemplo
   */
  async seed(): Promise<void> {
    // Verificar si ya hay datos
    const categoriesCount = await this.db.getCategoriesCount();
    if (categoriesCount > 0) {
      console.log('La base de datos ya tiene datos, omitiendo seed');
      return;
    }

    console.log('Poblando base de datos con datos de ejemplo...');

    // ========== CATEGORÍAS ==========
    const categories: CategoryDb[] = [
      { id: 'cat-1', name: 'Bebidas', description: 'Bebidas frías y calientes', displayOrder: 1 },
      { id: 'cat-2', name: 'Snacks', description: 'Botanas y expendedores', displayOrder: 2 },
      { id: 'cat-3', name: 'Dulces', description: 'Dulces y golosinas', displayOrder: 3 },
      {
        id: 'cat-4',
        name: 'Comida Rápida',
        description: 'Comida rápida y sandwiches',
        displayOrder: 4,
      },
    ];

    // ========== ADDONS (Extras) ==========
    const addons: ProductAddonDb[] = [
      { id: 'addon-1', name: 'Azúcar', price: 0, available: true },
      { id: 'addon-2', name: 'Leche', price: 5, available: true },
      { id: 'addon-3', name: 'Hielo', price: 0, available: true },
      { id: 'addon-4', name: 'Limón', price: 0, available: true },
      { id: 'addon-5', name: 'Salsa extra', price: 5, available: true },
    ];

    // ========== PRODUCTOS ==========
    const products: ProductDb[] = [
      // Bebidas
      {
        id: 'prod-1',
        categoryId: 'cat-1',
        name: 'Agua mineral',
        description: 'Agua natural 500ml',
        price: 15,
        available: true,
        createdAt: '2024-01-01',
      },
      {
        id: 'prod-2',
        categoryId: 'cat-1',
        name: 'Refresco',
        description: 'Refresco de cola 600ml',
        price: 25,
        available: true,
        createdAt: '2024-01-01',
      },
      {
        id: 'prod-3',
        categoryId: 'cat-1',
        name: 'Jugo de naranja',
        description: 'Jugo natural 400ml',
        price: 30,
        available: true,
        createdAt: '2024-01-01',
      },
      {
        id: 'prod-4',
        categoryId: 'cat-1',
        name: 'Café latte',
        description: 'Café con leche caliente',
        price: 35,
        available: true,
        createdAt: '2024-01-01',
      },
      {
        id: 'prod-5',
        categoryId: 'cat-1',
        name: 'Smoothie',
        description: 'Batido de frutas',
        price: 40,
        available: true,
        createdAt: '2024-01-01',
      },

      // Snacks
      {
        id: 'prod-6',
        categoryId: 'cat-2',
        name: 'Papas fritas',
        description: 'Papas crocantes',
        price: 25,
        available: true,
        createdAt: '2024-01-01',
      },
      {
        id: 'prod-7',
        categoryId: 'cat-2',
        name: 'Nachos',
        description: 'Nachos con queso',
        price: 30,
        available: true,
        createdAt: '2024-01-01',
      },
      {
        id: 'prod-8',
        categoryId: 'cat-2',
        name: 'Palomitas',
        description: 'Palomitas de maíz',
        price: 20,
        available: true,
        createdAt: '2024-01-01',
      },
      {
        id: 'prod-9',
        categoryId: 'cat-2',
        name: 'Galletas saladas',
        description: 'Galletas crackers',
        price: 15,
        available: true,
        createdAt: '2024-01-01',
      },

      // Dulces
      {
        id: 'prod-10',
        categoryId: 'cat-3',
        name: 'Chocolate',
        description: 'Chocolate con leche',
        price: 15,
        available: true,
        createdAt: '2024-01-01',
      },
      {
        id: 'prod-11',
        categoryId: 'cat-3',
        name: 'Gomitas',
        description: 'Gomitas de frutas',
        price: 12,
        available: true,
        createdAt: '2024-01-01',
      },
      {
        id: 'prod-12',
        categoryId: 'cat-3',
        name: 'Caramelos',
        description: 'Caramelos masticables',
        price: 8,
        available: true,
        createdAt: '2024-01-01',
      },
      {
        id: 'prod-13',
        categoryId: 'cat-3',
        name: 'Paleta',
        description: 'Paleta de hielo',
        price: 10,
        available: true,
        createdAt: '2024-01-01',
      },

      // Comida rápida
      {
        id: 'prod-14',
        categoryId: 'cat-4',
        name: 'Hot dog',
        description: 'Pan con salchicha',
        price: 35,
        available: true,
        createdAt: '2024-01-01',
      },
      {
        id: 'prod-15',
        categoryId: 'cat-4',
        name: 'Hamburguesa',
        description: 'Hamburguesa sencilla',
        price: 50,
        available: true,
        createdAt: '2024-01-01',
      },
      {
        id: 'prod-16',
        categoryId: 'cat-4',
        name: 'Taco',
        description: 'Taco de carne',
        price: 25,
        available: true,
        createdAt: '2024-01-01',
      },
      {
        id: 'prod-17',
        categoryId: 'cat-4',
        name: 'Pizza slice',
        description: 'Rebanada de pizza',
        price: 40,
        available: true,
        createdAt: '2024-01-01',
      },
    ];

    // ========== DETALLES DE PRODUCTOS (relación producto-addon) ==========
    const productDetails: ProductDetailDb[] = [
      // Bebidas pueden llevar hielo, limón, azúcar
      {
        id: 'det-1',
        productId: 'prod-1',
        addonId: 'addon-3',
        priceOverride: null,
        available: true,
      },
      {
        id: 'det-2',
        productId: 'prod-1',
        addonId: 'addon-4',
        priceOverride: null,
        available: true,
      },
      {
        id: 'det-3',
        productId: 'prod-2',
        addonId: 'addon-3',
        priceOverride: null,
        available: true,
      },
      {
        id: 'det-4',
        productId: 'prod-3',
        addonId: 'addon-1',
        priceOverride: null,
        available: true,
      },
      {
        id: 'det-5',
        productId: 'prod-4',
        addonId: 'addon-1',
        priceOverride: null,
        available: true,
      },
      {
        id: 'det-6',
        productId: 'prod-4',
        addonId: 'addon-2',
        priceOverride: null,
        available: true,
      },
      {
        id: 'det-7',
        productId: 'prod-5',
        addonId: 'addon-1',
        priceOverride: null,
        available: true,
      },

      // Snacks pueden llevar salsa extra
      { id: 'det-8', productId: 'prod-6', addonId: 'addon-5', priceOverride: 5, available: true },
      { id: 'det-9', productId: 'prod-7', addonId: 'addon-5', priceOverride: 5, available: true },
      { id: 'det-10', productId: 'prod-8', addonId: 'addon-5', priceOverride: 5, available: true },

      // Comida rápida
      { id: 'det-11', productId: 'prod-14', addonId: 'addon-5', priceOverride: 5, available: true },
      { id: 'det-12', productId: 'prod-15', addonId: 'addon-5', priceOverride: 5, available: true },
      { id: 'det-13', productId: 'prod-16', addonId: 'addon-5', priceOverride: 3, available: true },
    ];

    // ========== GUARDAR EN INDEXEDDB ==========
    await this.db.transaction(
      'rw',
      [this.db.categories, this.db.products, this.db.addons, this.db.productDetails],
      async () => {
        // Agregar categorías
        for (const category of categories) {
          await this.db.categories.add(category);
        }

        // Agregar addons
        for (const addon of addons) {
          await this.db.addons.add(addon);
        }

        // Agregar productos
        for (const product of products) {
          await this.db.products.add(product);
        }

        // Agregar detalles de productos
        for (const detail of productDetails) {
          await this.db.productDetails.add(detail);
        }
      },
    );

    console.log('✅ Datos de ejemplo agregados correctamente');
    console.log(`   - ${categories.length} categorías`);
    console.log(`   - ${products.length} productos`);
    console.log(`   - ${addons.length} addons`);
    console.log(`   - ${productDetails.length} detalles de productos`);
  }

  /**
   * Limpia todos los datos de la base de datos
   */
  async clear(): Promise<void> {
    await this.db.clearAll();
    console.log('✅ Base de datos limpiada');
  }
}

