export interface ProductResponse {
  readonly id: string;

  readonly name: string;

  readonly description: string | null;

  readonly price: number;

  readonly categoryId: string;

  readonly categoryName: string;

  readonly available: boolean;

  readonly createdAt: string;
}
