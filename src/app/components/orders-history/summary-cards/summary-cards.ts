import { Component, computed, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { LocalOrder } from '../../../models/local/local-order';

@Component({
  selector: 'app-summary-cards',
  imports: [CurrencyPipe],
  templateUrl: './summary-cards.html',
  styleUrl: './summary-cards.css',
})
export class SummaryCards {
  orders = input.required<LocalOrder[]>();

  readonly count = computed(() => this.orders().length);

  readonly totalSales = computed(() => this.orders().reduce((sum, order) => sum + order.total, 0));
}
