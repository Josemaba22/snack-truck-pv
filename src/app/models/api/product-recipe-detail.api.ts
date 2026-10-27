export interface ProductRecipeDetailResponse {
  readonly id: string;

  readonly productId: string;

  readonly ingredientId: string;

  readonly ingredientName: string;

  readonly ingredientPrice: number;

  readonly isBase: boolean;

  // No viene de la API: se completa desde la tabla local de ingredientes (ver CatalogRepository.getRecipe).
  readonly ingredientImageUrl?: string | null;
}

export interface ProductRecipeDetailRequest {
  readonly ingredientId: string;

  readonly isBase: boolean | null;
}
