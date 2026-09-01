import { Component, computed, signal } from '@angular/core';

import { SummaryCards } from '../../components/orders-history/summary-cards/summary-cards';
import { FiltersBar } from '../../components/orders-history/filters-bar/filters-bar';
import { OrdersTable } from '../../components/orders-history/orders-table/orders-table';
import { OrderDetails } from '../../components/order/order-details/order-details';
import { OrdersStore } from '../../services/orders-store';
import { OrderResponse } from '../../models/api/order.api';

@Component({
  selector: 'app-orders-history',
  imports: [SummaryCards, FiltersBar, OrdersTable, OrderDetails],
  templateUrl: './orders-history.html',
  styleUrl: './orders-history.css',
})
export class OrdersHistory {
  searchQuery = signal('');
  selectedOrder = signal<OrderResponse | null>(null);

  readonly filteredOrders = computed(() => {
    const query = this.searchQuery();
    const delivered = this.ordersStore.deliveredOrders();
    return query ? delivered.filter((order) => String(order.orderNumber).includes(query)) : delivered;
  });

  constructor(readonly ordersStore: OrdersStore) {}

  onFiltered(query: string): void {
    this.searchQuery.set(query);
  }

  onViewOrder(order: OrderResponse): void {
    this.selectedOrder.set(order);
  }

  closeDetails(): void {
    this.selectedOrder.set(null);
  }
}
