import { Component, computed, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';

import { OrderResponse, OrderStatus } from '../../../models/api/order.api';

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  PENDING: 'IN_PROGRESS',
  IN_PROGRESS: 'READY',
  READY: 'COMPLETED',
};

const ACTION_LABEL: Partial<Record<OrderStatus, string>> = {
  PENDING: 'Iniciar preparación',
  IN_PROGRESS: 'Marcar listo',
  READY: 'Entregar',
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Pendiente',
  IN_PROGRESS: 'En proceso',
  READY: 'Listo',
  COMPLETED: 'Entregado',
  CANCELLED: 'Cancelado',
};

@Component({
  selector: 'app-order-card',
  imports: [DatePipe],
  templateUrl: './order-card.html',
  styleUrl: './order-card.css',
})
export class OrderCard {
  order = input.required<OrderResponse>();

  advance = output<{ id: string; nextStatus: OrderStatus }>();

  readonly statusLabel = computed(() => STATUS_LABEL[this.order().status] ?? this.order().status);

  readonly actionLabel = computed(() => ACTION_LABEL[this.order().status as OrderStatus] ?? null);

  readonly relativeTime = computed(() => {
    const created = new Date(this.order().createdAt).getTime();
    const minutes = Math.max(0, Math.round((Date.now() - created) / 60000));
    return minutes <= 0 ? 'justo ahora' : `hace ${minutes} min`;
  });

  onAdvance(): void {
    const next = NEXT_STATUS[this.order().status as OrderStatus];
    if (next) {
      this.advance.emit({ id: this.order().id, nextStatus: next });
    }
  }
}
