export interface ProductDetailDb {
  readonly id: string;

  readonly productId: string;

  readonly addonId: string;

  readonly priceOverride: number | null;

  readonly available: boolean;
}
