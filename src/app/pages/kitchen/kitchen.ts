import { Component } from '@angular/core';

import { OrderCardList } from '../../components/order/order-card-list/order-card-list';
import { OrdersStore } from '../../services/orders-store';
import { OrdersApiService } from '../../services/orders-api';
import { OrderStatus } from '../../models/api/order.api';

@Component({
  selector: 'app-kitchen',
  imports: [OrderCardList],
  templateUrl: './kitchen.html',
  styleUrl: './kitchen.css',
})
export class Kitchen {
  constructor(
    readonly ordersStore: OrdersStore,
    private readonly ordersApi: OrdersApiService,
  ) {}

  onAdvance(event: { id: string; nextStatus: OrderStatus }): void {
    this.ordersApi.updateStatus(event.id, event.nextStatus).subscribe({
      next: () => this.ordersStore.refresh(),
      error: (err) => console.error('No se pudo actualizar el estatus de la orden', err),
    });
  }
}
