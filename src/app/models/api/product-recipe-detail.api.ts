export interface ProductRecipeDetailResponse {
  readonly id: string;

  readonly productId: string;

  readonly ingredientId: string;

  readonly ingredientName: string;

  readonly ingredientPrice: number;

  readonly isBase: boolean;
}

export interface ProductRecipeDetailRequest {
  readonly ingredientId: string;

  readonly isBase: boolean | null;
}
