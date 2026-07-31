import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../core/api-config';
import { ProductDetailResponse } from '../models/api/product-detail.api';

@Injectable({ providedIn: 'root' })
export class ProductDetailsApiService {
  constructor(private readonly http: HttpClient) {}

  getByProduct(productId: string): Observable<ProductDetailResponse[]> {
    return this.http.get<ProductDetailResponse[]>(`${API_BASE_URL}/products/${productId}/details`);
  }
}
