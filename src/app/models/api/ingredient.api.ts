export interface IngredientResponse {
  readonly id: string;

  readonly name: string;

  readonly price: number;

  readonly available: boolean;
}

export interface IngredientRequest {
  readonly name: string;

  readonly price: number;

  readonly available: boolean | null;
}
