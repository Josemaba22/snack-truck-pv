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

  readonly paymentMethod: PaymentMethod;
}

export interface OrderStatusUpdateRequest {
  readonly status: OrderStatus;
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

  readonly orderNumber: number;

  // El cliente nunca produce 'CANCELLED', pero el tipo lo admite por honestidad con lo que la API puede devolver.
  readonly status: OrderStatus | 'CANCELLED';

  readonly subtotal: number;

  readonly total: number;

  readonly notes: string | null;

  readonly paymentMethod: PaymentMethod;

  readonly createdAt: string;

  readonly completedAt: string | null;

  readonly items: OrderDetailResponse[];
}
