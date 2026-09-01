import { Component, input, output } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { OrderResponse } from '../../../models/api/order.api';

@Component({
  selector: 'app-orders-table',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './orders-table.html',
  styleUrl: './orders-table.css',
})
export class OrdersTable {
  orders = input.required<OrderResponse[]>();

  viewOrder = output<OrderResponse>();
}
