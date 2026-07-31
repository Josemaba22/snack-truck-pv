import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddonSummary } from '../../../models/ui/cart-item.ui';

@Component({
  selector: 'app-selected-addons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selected-addons.html',
  styleUrl: './selected-addons.css',
})
export class SelectedAddons {
  addons = input.required<AddonSummary[]>();

  interactive = input(false);

  removed = output<string>();
}
