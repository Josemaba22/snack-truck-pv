import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../core/api-config';
import { ProductResponse } from '../models/api/product.api';

@Injectable({ providedIn: 'root' })
export class ProductsApiService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<ProductResponse[]> {
    return this.http.get<ProductResponse[]>(`${API_BASE_URL}/products`);
  }
}
