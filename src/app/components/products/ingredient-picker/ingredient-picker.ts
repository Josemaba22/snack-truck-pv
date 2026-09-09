import { Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { IngredientSummary } from '../../../models/ui/cart-item.ui';

@Component({
  selector: 'app-ingredient-picker',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './ingredient-picker.html',
  styleUrl: './ingredient-picker.css',
})
export class IngredientPicker {
  ingredients = input.required<IngredientSummary[]>();

  selectedIds = input<Set<string>>(new Set());

  showPrice = input(true);

  emptyMessage = input('Este producto no tiene ingredientes disponibles');

  toggled = output<IngredientSummary>();

  isSelected(ingredient: IngredientSummary): boolean {
    return this.selectedIds().has(ingredient.ingredientId);
  }
}
