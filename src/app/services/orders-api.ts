import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../core/api-config';
import { OrderRequest, OrderResponse, OrderStatus } from '../models/api/order.api';

@Injectable({ providedIn: 'root' })
export class OrdersApiService {
  constructor(private readonly http: HttpClient) {}

  create(request: OrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${API_BASE_URL}/orders`, request);
  }

  getAll(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(`${API_BASE_URL}/orders`);
  }

  updateStatus(id: string, status: OrderStatus): Observable<OrderResponse> {
    return this.http.patch<OrderResponse>(`${API_BASE_URL}/orders/${id}/status`, { status });
  }
}
