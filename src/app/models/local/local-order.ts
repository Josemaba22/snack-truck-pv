import { OrderResponse } from '../api/order.api';

export type SyncState = 'pending' | 'synced' | 'failed';

// Orden tal como vive en IndexedDB. `id` es el clientOrderId (o el id del servidor si la orden
// nació en otro lado); el id real del servidor se guarda aparte en `serverId`.
export interface LocalOrder extends Omit<OrderResponse, 'orderNumber' | 'clientOrderId'> {
  // null mientras la orden no se haya sincronizado.
  readonly orderNumber: number | null;

  // Folio provisional para órdenes creadas en este dispositivo; 0 si vino del servidor.
  readonly localNumber: number;

  // Lo que la UI muestra: el número real o el provisional ("L-3").
  readonly displayNumber: string;

  readonly serverId: string | null;

  readonly syncState: SyncState;

  readonly syncError: string | null;
}

export type OutboxEntryType = 'create-order' | 'update-status';

export interface OutboxEntry {
  readonly seq?: number;

  readonly orderId: string;

  readonly type: OutboxEntryType;

  // Solo para update-status.
  readonly status?: string;

  // Momento en que ocurrió la acción en el dispositivo.
  readonly at: string;

  readonly attempts: number;

  // Rechazada por el servidor (4xx): no se reintenta y bloquea los cambios posteriores de su orden.
  readonly failed: boolean;

  readonly lastError: string | null;
}
