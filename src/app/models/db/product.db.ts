export interface ProductDb {
  readonly id: string;

  readonly name: string;

  readonly description: string | null;

  readonly price: number;

  readonly categoryId: string;

  readonly available: boolean;

  readonly createdAt: string;
}
