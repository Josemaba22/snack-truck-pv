import { ProductResponse } from '../api/product.api';

export interface AddonSummary {
  readonly addonId: string;

  readonly addonName: string;

  readonly addonPrice: number;
}

export interface CartItemUi {
  readonly cartItemId: string;

  readonly product: ProductResponse;

  readonly selectedAddons: AddonSummary[];
}

export function cartItemTotal(item: CartItemUi): number {
  return item.product.price + item.selectedAddons.reduce((sum, addon) => sum + addon.addonPrice, 0);
}
