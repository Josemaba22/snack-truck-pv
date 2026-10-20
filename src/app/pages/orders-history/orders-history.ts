import { Component, computed, signal } from '@angular/core';

import { SummaryCards } from '../../components/orders-history/summary-cards/summary-cards';
import { FiltersBar, OrdersFilter } from '../../components/orders-history/filters-bar/filters-bar';
import { OrdersTable } from '../../components/orders-history/orders-table/orders-table';
import { OrderDetails } from '../../components/order/order-details/order-details';
import { OrdersStore } from '../../services/orders-store';
import { LocalOrder } from '../../models/local/local-order';

@Component({
  selector: 'app-orders-history',
  imports: [SummaryCards, FiltersBar, OrdersTable, OrderDetails],
  templateUrl: './orders-history.html',
  styleUrl: './orders-history.css',
})
export class OrdersHistory {
  filter = signal<OrdersFilter>({ query: '', date: '' });
  selectedOrder = signal<LocalOrder | null>(null);

  readonly filteredOrders = computed(() => {
    const { query, date } = this.filter();
    const text = query.toLowerCase();
    return this.ordersStore
      .deliveredOrders()
      .filter(
        (order) =>
          (!text ||
            order.displayNumber.toLowerCase().includes(text) ||
            (order.customerName ?? '').toLowerCase().includes(text)) &&
          (!date || order.createdAt.startsWith(date)),
      );
  });

  constructor(readonly ordersStore: OrdersStore) {}

  onFiltered(filter: OrdersFilter): void {
    this.filter.set(filter);
  }

  onViewOrder(order: LocalOrder): void {
    this.selectedOrder.set(order);
  }

  closeDetails(): void {
    this.selectedOrder.set(null);
  }
}
