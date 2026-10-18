import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../core/api-config';
import { ProductRequest, ProductResponse } from '../models/api/product.api';

@Injectable({ providedIn: 'root' })
export class ProductsApiService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<ProductResponse[]> {
    return this.http.get<ProductResponse[]>(`${API_BASE_URL}/products`);
  }

  getById(id: string): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${API_BASE_URL}/products/${id}`);
  }

  create(request: ProductRequest): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(`${API_BASE_URL}/products`, request);
  }

  update(id: string, request: ProductRequest): Observable<ProductResponse> {
    return this.http.put<ProductResponse>(`${API_BASE_URL}/products/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/products/${id}`);
  }

  // JPEG, PNG o WebP, máx. 5MB. La API valida por magic bytes.
  uploadImage(id: string, file: File): Observable<ProductResponse> {
    const body = new FormData();
    body.append('file', file);
    return this.http.put<ProductResponse>(`${API_BASE_URL}/products/${id}/image`, body);
  }

  deleteImage(id: string): Observable<ProductResponse> {
    return this.http.delete<ProductResponse>(`${API_BASE_URL}/products/${id}/image`);
  }
}
