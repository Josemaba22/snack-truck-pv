import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderResponse, OrderStatus } from '../../../models/api/order.api';
import { OrderCard } from '../order-card/order-card';

@Component({
  selector: 'app-order-card-list',
  standalone: true,
  imports: [CommonModule, OrderCard],
  templateUrl: './order-card-list.html',
  styleUrl: './order-card-list.css',
})
export class OrderCardList {
  orders = input.required<OrderResponse[]>();

  advance = output<{ id: string; nextStatus: OrderStatus }>();
}
