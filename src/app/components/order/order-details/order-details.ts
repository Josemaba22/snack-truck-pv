import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderResponse, OrderDetailAddonResponse } from '../../../models/api/order.api';
import { AddonSummary } from '../../../models/ui/cart-item.ui';
import { SelectedAddons } from '../../products/selected-addons/selected-addons';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, SelectedAddons],
  templateUrl: './order-details.html',
  styleUrl: './order-details.css',
})
export class OrderDetails {
  order = input.required<OrderResponse>();

  toAddonSummaries(addons: OrderDetailAddonResponse[]): AddonSummary[] {
    return addons.map((addon) => ({
      addonId: addon.addonId,
      addonName: addon.addonName,
      addonPrice: addon.unitPrice,
    }));
  }
}
