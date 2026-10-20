export type OrderStatus = 'PENDING' | 'IN_PROGRESS' | 'READY' | 'COMPLETED';

export type PaymentMethod = 'CASH' | 'CARD' | 'TRANSFER';

export type IngredientAction = 'ADDED' | 'REMOVED';

export interface OrderItemRequest {
  readonly productId: string;

  readonly quantity: number;

  readonly extraIngredientIds: string[];

  readonly removedIngredientIds: string[];
}

export interface OrderRequest {
  readonly items: OrderItemRequest[];

  readonly notes: string | null;

  readonly customerName: string | null;

  readonly paymentMethod: PaymentMethod;

  // UUID generado en el dispositivo: hace idempotente el reintento de una creación.
  readonly clientOrderId: string;

  // Momento en que se tomó la orden en el dispositivo (hora local, sin zona).
  readonly createdAt: string;
}

export interface OrderStatusUpdateRequest {
  readonly status: OrderStatus;

  // Momento en que se hizo el cambio en el dispositivo (hora local, sin zona).
  readonly changedAt: string;
}

export interface OrderDetailIngredientResponse {
  readonly id: string;

  readonly ingredientId: string;

  readonly ingredientName: string;

  readonly unitPrice: number;

  readonly action: IngredientAction;
}

export interface OrderDetailResponse {
  readonly id: string;

  readonly productId: string;

  readonly productName: string;

  readonly quantity: number;

  readonly unitPrice: number;

  readonly ingredients: OrderDetailIngredientResponse[];

  readonly subtotal: number;
}

export interface OrderResponse {
  readonly id: string;

  readonly clientOrderId: string | null;

  readonly orderNumber: number;

  readonly status: OrderStatus;

  readonly subtotal: number;

  readonly total: number;

  readonly notes: string | null;

  readonly customerName: string | null;

  readonly paymentMethod: PaymentMethod;

  readonly createdAt: string;

  readonly completedAt: string | null;

  readonly items: OrderDetailResponse[];
}
