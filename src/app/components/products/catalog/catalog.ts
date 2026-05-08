import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Category } from '../category/category';
import { ProductsRepository } from '../../../services/products-repository';
import { SeedData } from '../../../services/seed-data';
import { CategoryUi } from '../../../models/ui/category.ui';
import { ProductView } from '../../../models/view/product.view';

@Component({
  selector: 'app-catalog',
  imports: [CommonModule, Category],
  standalone: true,
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog implements OnInit {
  categoriesUi = signal<CategoryUi[]>([]);
  productsByCategory = signal<Map<string, ProductView[]>>(new Map());
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly seedData: SeedData,
  ) {}

  async ngOnInit(): Promise<void> {
    // Poblar datos iniciales si no existen
    await this.seedData.seed();
    // Luego cargar los datos
    await this.loadData();
  }

  async loadData(): Promise<void> {
    try {
      this.loading.set(true);
      this.error.set(null);

      // Cargar categorías y productos
      const [categories, products] = await Promise.all([
        this.productsRepository.getCategories(),
        this.productsRepository.getProducts(),
      ]);

      // Transformar categorías a CategoryUi
      const categoriesUi: CategoryUi[] = categories.map((cat) => ({
        ...cat,
        dropdown: false,
      }));

      // Agrupar productos por categoría
      const productsMap = new Map<string, ProductView[]>();
      for (const product of products) {
        const existing = productsMap.get(product.categoryId) || [];
        existing.push(product);
        productsMap.set(product.categoryId, existing);
      }

      this.categoriesUi.set(categoriesUi);
      this.productsByCategory.set(productsMap);
    } catch (err) {
      this.error.set('Error al cargar los datos');
      console.error(err);
    } finally {
      this.loading.set(false);
    }
  }

  getProductsForCategory(categoryId: string): ProductView[] {
    return this.productsByCategory().get(categoryId) || [];
  }
}
