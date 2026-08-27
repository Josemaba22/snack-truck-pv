import { Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { AddonSummary } from '../../../models/ui/cart-item.ui';

@Component({
  selector: 'app-selected-addons',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './selected-addons.html',
  styleUrl: './selected-addons.css',
})
export class SelectedAddons {
  addons = input.required<AddonSummary[]>();

  interactive = input(false);

  removed = output<string>();
}
