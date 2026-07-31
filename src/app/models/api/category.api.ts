export interface CategoryResponse {
  readonly id: string;

  readonly name: string;

  readonly description: string | null;

  readonly displayOrder: number;
}
