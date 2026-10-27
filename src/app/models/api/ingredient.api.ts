export interface IngredientResponse {
  readonly id: string;

  readonly name: string;

  readonly price: number;

  readonly available: boolean;

  readonly imageUrl: string | null;
}

export interface IngredientRequest {
  readonly name: string;

  readonly price: number;

  readonly available: boolean | null;
}
