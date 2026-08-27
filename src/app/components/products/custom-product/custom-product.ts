import { Component, OnInit, computed, input, output, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { ProductAddons } from '../product-addons/product-addons';
import { SelectedAddons } from '../selected-addons/selected-addons';
import { ProductDetailsApiService } from '../../../services/product-details-api';
import { ProductResponse } from '../../../models/api/product.api';
import { AddonSummary } from '../../../models/ui/cart-item.ui';

@Component({
  selector: 'app-custom-product',
  standalone: true,
  imports: [CurrencyPipe, ProductAddons, SelectedAddons],
  templateUrl: './custom-product.html',
  styleUrl: './custom-product.css',
})
export class CustomProduct implements OnInit {
  product = input.required<ProductResponse>();
  initialAddons = input<AddonSummary[]>([]);

  back = output<void>();
  saved = output<AddonSummary[]>();

  availableAddons = signal<AddonSummary[]>([]);
  selectedAddons = signal<AddonSummary[]>([]);
  extrasOpen = signal(false);
  loading = signal(true);

  readonly selectedIds = computed(() => new Set(this.selectedAddons().map((addon) => addon.addonId)));

  constructor(private readonly productDetailsApi: ProductDetailsApiService) {}

  ngOnInit(): void {
    this.selectedAddons.set(this.initialAddons());

    this.productDetailsApi.getByProduct(this.product().id).subscribe({
      next: (details) => {
        this.availableAddons.set(
          details.map((detail) => ({
            addonId: detail.addonId,
            addonName: detail.addonName,
            addonPrice: detail.addonPrice,
          })),
        );
        this.loading.set(false);
      },
      error: (err) => {
        console.error('No se pudieron cargar los extras del producto', err);
        this.loading.set(false);
      },
    });
  }

  toggleExtras(): void {
    this.extrasOpen.update((value) => !value);
  }

  onAddonToggled(addon: AddonSummary): void {
    this.selectedAddons.update((current) => {
      const exists = current.some((a) => a.addonId === addon.addonId);
      return exists ? current.filter((a) => a.addonId !== addon.addonId) : [...current, addon];
    });
  }

  onAddonRemoved(addonId: string): void {
    this.selectedAddons.update((current) => current.filter((a) => a.addonId !== addonId));
  }

  save(): void {
    this.saved.emit(this.selectedAddons());
  }
}
