import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddonSummary } from '../../../models/ui/cart-item.ui';

@Component({
  selector: 'app-product-addons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-addons.html',
  styleUrl: './product-addons.css',
})
export class ProductAddons {
  addons = input.required<AddonSummary[]>();

  selectedIds = input<Set<string>>(new Set());

  toggled = output<AddonSummary>();

  isSelected(addon: AddonSummary): boolean {
    return this.selectedIds().has(addon.addonId);
  }
}
