import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../core/api-config';
import {
  OrderRequest,
  OrderResponse,
  OrderStatus,
  OrderStatusUpdateRequest,
} from '../models/api/order.api';

@Injectable({ providedIn: 'root' })
export class OrdersApiService {
  constructor(private readonly http: HttpClient) {}

  create(request: OrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${API_BASE_URL}/orders`, request);
  }

  getById(id: string): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${API_BASE_URL}/orders/${id}`);
  }

  getAll(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(`${API_BASE_URL}/orders`);
  }

  updateStatus(id: string, status: OrderStatus, changedAt: string): Observable<OrderResponse> {
    const body: OrderStatusUpdateRequest = { status, changedAt };
    return this.http.patch<OrderResponse>(`${API_BASE_URL}/orders/${id}/status`, body);
  }
}
