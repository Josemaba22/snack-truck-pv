import { Component, input, output } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { LocalOrder } from '../../../models/local/local-order';

@Component({
  selector: 'app-orders-table',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './orders-table.html',
  styleUrl: './orders-table.css',
})
export class OrdersTable {
  orders = input.required<LocalOrder[]>();

  viewOrder = output<LocalOrder>();
}
