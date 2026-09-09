import { ProductResponse } from '../api/product.api';

export interface IngredientSummary {
  readonly ingredientId: string;

  readonly ingredientName: string;

  readonly ingredientPrice: number;
}

export interface CartItemUi {
  readonly cartItemId: string;

  readonly product: ProductResponse;

  readonly addedIngredients: IngredientSummary[];

  readonly removedIngredients: IngredientSummary[];
}

export function cartItemTotal(item: CartItemUi): number {
  return (
    item.product.price +
    item.addedIngredients.reduce((sum, ingredient) => sum + ingredient.ingredientPrice, 0)
  );
}
