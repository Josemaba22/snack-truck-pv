import { Component, OnInit, computed, input, output, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { IngredientPicker } from '../ingredient-picker/ingredient-picker';
import { CatalogRepository } from '../../../services/catalog-repository';
import { ProductResponse } from '../../../models/api/product.api';
import { IngredientSummary } from '../../../models/ui/cart-item.ui';

export interface CustomProductSaved {
  readonly addedIngredients: IngredientSummary[];

  readonly removedIngredients: IngredientSummary[];
}

@Component({
  selector: 'app-custom-product',
  standalone: true,
  imports: [CurrencyPipe, IngredientPicker],
  templateUrl: './custom-product.html',
  styleUrl: './custom-product.css',
})
export class CustomProduct implements OnInit {
  product = input.required<ProductResponse>();
  initialAddedIngredients = input<IngredientSummary[]>([]);
  initialRemovedIngredients = input<IngredientSummary[]>([]);

  back = output<void>();
  saved = output<CustomProductSaved>();

  baseIngredients = signal<IngredientSummary[]>([]);
  extraIngredients = signal<IngredientSummary[]>([]);
  includedBaseIds = signal<Set<string>>(new Set());
  addedExtras = signal<IngredientSummary[]>([]);
  loading = signal(true);

  readonly addedExtraIds = computed(
    () => new Set(this.addedExtras().map((ingredient) => ingredient.ingredientId)),
  );

  // Ambos paneles comparten columnas y reparten la altura por filas, así las celdas miden igual.
  // Se elige el número de columnas que da la celda más grande en un área aproximadamente 2:1.
  readonly gridColumns = computed(() => {
    const baseCount = this.baseIngredients().length;
    const extraCount = this.extraIngredients().length;
    let best = 1;
    let bestSize = 0;
    for (let cols = 1; cols <= Math.max(baseCount, extraCount, 1); cols++) {
      const rows =
        Math.max(1, Math.ceil(baseCount / cols)) + Math.max(1, Math.ceil(extraCount / cols));
      const size = Math.min(2 / cols, 1 / rows);
      if (size > bestSize) {
        best = cols;
        bestSize = size;
      }
    }
    return best;
  });

  readonly baseRows = computed(() =>
    Math.max(1, Math.ceil(this.baseIngredients().length / this.gridColumns())),
  );

  readonly extraRows = computed(() =>
    Math.max(1, Math.ceil(this.extraIngredients().length / this.gridColumns())),
  );

  readonly removedBaseIngredients = computed(() =>
    this.baseIngredients().filter(
      (ingredient) => !this.includedBaseIds().has(ingredient.ingredientId),
    ),
  );

  constructor(private readonly catalog: CatalogRepository) {}

  ngOnInit(): void {
    this.addedExtras.set(this.initialAddedIngredients());
    const initiallyRemovedIds = new Set(
      this.initialRemovedIngredients().map((ingredient) => ingredient.ingredientId),
    );

    this.catalog
      .getRecipe(this.product().id)
      .then((details) => {
        const base: IngredientSummary[] = [];
        const extras: IngredientSummary[] = [];

        for (const detail of details) {
          const summary: IngredientSummary = {
            ingredientId: detail.ingredientId,
            ingredientName: detail.ingredientName,
            ingredientPrice: detail.ingredientPrice,
            ingredientImageUrl: detail.ingredientImageUrl ?? null,
          };

          if (detail.isBase) {
            base.push(summary);
          } else {
            extras.push(summary);
          }
        }

        this.baseIngredients.set(base);
        this.extraIngredients.set(extras);
        this.includedBaseIds.set(
          new Set(
            base
              .map((ingredient) => ingredient.ingredientId)
              .filter((id) => !initiallyRemovedIds.has(id)),
          ),
        );
        this.loading.set(false);
      })
      .catch((err) => {
        console.error('No se pudo cargar la receta del producto', err);
        this.loading.set(false);
      });
  }

  onBaseIngredientToggled(ingredient: IngredientSummary): void {
    this.includedBaseIds.update((current) => {
      const next = new Set(current);
      if (next.has(ingredient.ingredientId)) {
        next.delete(ingredient.ingredientId);
      } else {
        next.add(ingredient.ingredientId);
      }
      return next;
    });
  }

  onExtraToggled(ingredient: IngredientSummary): void {
    this.addedExtras.update((current) => {
      const exists = current.some((item) => item.ingredientId === ingredient.ingredientId);
      return exists
        ? current.filter((item) => item.ingredientId !== ingredient.ingredientId)
        : [...current, ingredient];
    });
  }

  save(): void {
    this.saved.emit({
      addedIngredients: this.addedExtras(),
      removedIngredients: this.removedBaseIngredients(),
    });
  }
}
