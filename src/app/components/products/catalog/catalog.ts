import { Component, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import { Category } from '../category/category';
import { CategoriesApiService } from '../../../services/categories-api';
import { ProductsApiService } from '../../../services/products-api';
import { CategoryUi } from '../../../models/ui/category.ui';
import { ProductResponse } from '../../../models/api/product.api';

@Component({
  selector: 'app-catalog',
  imports: [CommonModule, Category],
  standalone: true,
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog implements OnInit {
  categoriesUi = signal<CategoryUi[]>([]);
  productsByCategory = signal<Map<string, ProductResponse[]>>(new Map());
  selectedCategory = signal<CategoryUi | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  productSelected = output<ProductResponse>();

  constructor(
    private readonly categoriesApi: CategoriesApiService,
    private readonly productsApi: ProductsApiService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      categories: this.categoriesApi.getAll(),
      products: this.productsApi.getAll(),
    }).subscribe({
      next: ({ categories, products }) => {
        const categoriesUi: CategoryUi[] = categories
          .slice()
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((category) => ({ ...category, dropdown: false }));

        const productsMap = new Map<string, ProductResponse[]>();
        for (const product of products) {
          const existing = productsMap.get(product.categoryId) ?? [];
          existing.push(product);
          productsMap.set(product.categoryId, existing);
        }

        this.categoriesUi.set(categoriesUi);
        this.productsByCategory.set(productsMap);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar el catálogo');
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  getProductsForCategory(categoryId: string): ProductResponse[] {
    return this.productsByCategory().get(categoryId) ?? [];
  }

  selectCategory(category: CategoryUi): void {
    this.selectedCategory.set(category);
  }

  clearSelection(): void {
    this.selectedCategory.set(null);
  }
}
