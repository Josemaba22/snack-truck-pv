import { Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { OrderDetailIngredientResponse } from '../../../models/api/order.api';
import { LocalOrder } from '../../../models/local/local-order';
import { IngredientSummary } from '../../../models/ui/cart-item.ui';
import { SelectedIngredients } from '../../products/selected-ingredients/selected-ingredients';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CurrencyPipe, SelectedIngredients],
  templateUrl: './order-details.html',
  styleUrl: './order-details.css',
})
export class OrderDetails {
  order = input.required<LocalOrder>();

  addedIngredients(ingredients: OrderDetailIngredientResponse[]): IngredientSummary[] {
    return ingredients
      .filter((ingredient) => ingredient.action === 'ADDED')
      .map((ingredient) => ({
        ingredientId: ingredient.ingredientId,
        ingredientName: ingredient.ingredientName,
        ingredientPrice: ingredient.unitPrice,
      }));
  }

  removedIngredients(ingredients: OrderDetailIngredientResponse[]): IngredientSummary[] {
    return ingredients
      .filter((ingredient) => ingredient.action === 'REMOVED')
      .map((ingredient) => ({
        ingredientId: ingredient.ingredientId,
        ingredientName: ingredient.ingredientName,
        ingredientPrice: ingredient.unitPrice,
      }));
  }
}
