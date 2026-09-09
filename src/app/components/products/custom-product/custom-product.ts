import { Component, OnInit, computed, input, output, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { IngredientPicker } from '../ingredient-picker/ingredient-picker';
import { SelectedIngredients } from '../selected-ingredients/selected-ingredients';
import { ProductRecipeDetailsApiService } from '../../../services/product-recipe-details-api';
import { ProductResponse } from '../../../models/api/product.api';
import { IngredientSummary } from '../../../models/ui/cart-item.ui';

export interface CustomProductSaved {
  readonly addedIngredients: IngredientSummary[];

  readonly removedIngredients: IngredientSummary[];
}

@Component({
  selector: 'app-custom-product',
  standalone: true,
  imports: [CurrencyPipe, IngredientPicker, SelectedIngredients],
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
  extrasOpen = signal(false);
  loading = signal(true);

  readonly addedExtraIds = computed(
    () => new Set(this.addedExtras().map((ingredient) => ingredient.ingredientId)),
  );

  readonly removedBaseIngredients = computed(() =>
    this.baseIngredients().filter(
      (ingredient) => !this.includedBaseIds().has(ingredient.ingredientId),
    ),
  );

  constructor(private readonly productRecipeDetailsApi: ProductRecipeDetailsApiService) {}

  ngOnInit(): void {
    this.addedExtras.set(this.initialAddedIngredients());
    const initiallyRemovedIds = new Set(
      this.initialRemovedIngredients().map((ingredient) => ingredient.ingredientId),
    );

    this.productRecipeDetailsApi.getByProduct(this.product().id).subscribe({
      next: (details) => {
        const base: IngredientSummary[] = [];
        const extras: IngredientSummary[] = [];

        for (const detail of details) {
          const summary: IngredientSummary = {
            ingredientId: detail.ingredientId,
            ingredientName: detail.ingredientName,
            ingredientPrice: detail.ingredientPrice,
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
      },
      error: (err) => {
        console.error('No se pudo cargar la receta del producto', err);
        this.loading.set(false);
      },
    });
  }

  toggleExtras(): void {
    this.extrasOpen.update((value) => !value);
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

  onExtraRemoved(ingredientId: string): void {
    this.addedExtras.update((current) =>
      current.filter((ingredient) => ingredient.ingredientId !== ingredientId),
    );
  }

  save(): void {
    this.saved.emit({
      addedIngredients: this.addedExtras(),
      removedIngredients: this.removedBaseIngredients(),
    });
  }
}
