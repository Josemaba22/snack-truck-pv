import { Component, computed, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { liveQuery } from 'dexie';
import { from } from 'rxjs';

import { Category } from '../category/category';
import { LocalDb } from '../../../services/local-db';
import { SyncService } from '../../../services/sync';
import { CategoryUi } from '../../../models/ui/category.ui';
import { CategoryResponse } from '../../../models/api/category.api';
import { ProductResponse } from '../../../models/api/product.api';

@Component({
  selector: 'app-catalog',
  imports: [Category],
  standalone: true,
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog {
  selectedCategory = signal<CategoryUi | null>(null);

  productSelected = output<ProductResponse>();

  // Se lee de IndexedDB y se actualiza sola cuando la sincronización refresca el catálogo.
  private readonly categories = toSignal(
    from(liveQuery<CategoryResponse[] | null>(() => this.db.categories.orderBy('displayOrder').toArray())),
    { initialValue: null as CategoryResponse[] | null },
  );
  private readonly products = toSignal(
    from(liveQuery(() => this.db.products.toArray())),
    { initialValue: [] as ProductResponse[] },
  );

  readonly categoriesUi = computed<CategoryUi[]>(() =>
    (this.categories() ?? []).map((category) => ({ ...category, dropdown: false })),
  );

  readonly productsByCategory = computed(() => {
    const productsMap = new Map<string, ProductResponse[]>();
    for (const product of this.products().filter((p) => p.available)) {
      const existing = productsMap.get(product.categoryId) ?? [];
      existing.push(product);
      productsMap.set(product.categoryId, existing);
    }
    return productsMap;
  });

  // Hasta que no haya catálogo guardado se muestra cargando (o el aviso si no hay conexión).
  readonly loading = computed(() => this.categories() === null);
  readonly empty = computed(() => this.categories()?.length === 0);

  constructor(
    private readonly db: LocalDb,
    readonly sync: SyncService,
  ) {}

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
