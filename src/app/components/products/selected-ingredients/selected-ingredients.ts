import { Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { IngredientSummary } from '../../../models/ui/cart-item.ui';

@Component({
  selector: 'app-selected-ingredients',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './selected-ingredients.html',
  styleUrl: './selected-ingredients.css',
})
export class SelectedIngredients {
  ingredients = input.required<IngredientSummary[]>();

  interactive = input(false);

  showPrice = input(true);

  emptyMessage = input('Sin extras');

  removed = output<string>();
}
