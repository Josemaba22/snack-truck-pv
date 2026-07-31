import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderResponse } from '../../../models/api/order.api';

@Component({
  selector: 'app-orders-table',
  imports: [CommonModule],
  templateUrl: './orders-table.html',
  styleUrl: './orders-table.css',
})
export class OrdersTable {
  orders = input.required<OrderResponse[]>();

  viewOrder = output<OrderResponse>();
}
