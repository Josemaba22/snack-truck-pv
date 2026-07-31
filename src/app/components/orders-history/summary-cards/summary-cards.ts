import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderResponse } from '../../../models/api/order.api';

@Component({
  selector: 'app-summary-cards',
  imports: [CommonModule],
  templateUrl: './summary-cards.html',
  styleUrl: './summary-cards.css',
})
export class SummaryCards {
  orders = input.required<OrderResponse[]>();

  readonly count = computed(() => this.orders().length);

  readonly totalSales = computed(() => this.orders().reduce((sum, order) => sum + order.total, 0));
}
