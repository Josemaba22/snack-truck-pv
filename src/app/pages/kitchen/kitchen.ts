import { Component } from '@angular/core';

import { OrderCardList } from '../../components/order/order-card-list/order-card-list';
import { OrdersStore } from '../../services/orders-store';
import { OrderStatus } from '../../models/api/order.api';

@Component({
  selector: 'app-kitchen',
  imports: [OrderCardList],
  templateUrl: './kitchen.html',
  styleUrl: './kitchen.css',
})
export class Kitchen {
  constructor(readonly ordersStore: OrdersStore) {}

  onAdvance(event: { id: string; nextStatus: OrderStatus }): void {
    this.ordersStore
      .changeStatus(event.id, event.nextStatus)
      .catch((err) => console.error('No se pudo actualizar el estatus de la orden', err));
  }
}
