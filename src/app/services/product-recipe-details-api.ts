import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../core/api-config';
import {
  ProductRecipeDetailRequest,
  ProductRecipeDetailResponse,
} from '../models/api/product-recipe-detail.api';

@Injectable({ providedIn: 'root' })
export class ProductRecipeDetailsApiService {
  constructor(private readonly http: HttpClient) {}

  getByProduct(productId: string): Observable<ProductRecipeDetailResponse[]> {
    return this.http.get<ProductRecipeDetailResponse[]>(this.url(productId));
  }

  getById(productId: string, detailId: string): Observable<ProductRecipeDetailResponse> {
    return this.http.get<ProductRecipeDetailResponse>(`${this.url(productId)}/${detailId}`);
  }

  create(
    productId: string,
    request: ProductRecipeDetailRequest,
  ): Observable<ProductRecipeDetailResponse> {
    return this.http.post<ProductRecipeDetailResponse>(this.url(productId), request);
  }

  update(
    productId: string,
    detailId: string,
    request: ProductRecipeDetailRequest,
  ): Observable<ProductRecipeDetailResponse> {
    return this.http.put<ProductRecipeDetailResponse>(
      `${this.url(productId)}/${detailId}`,
      request,
    );
  }

  delete(productId: string, detailId: string): Observable<void> {
    return this.http.delete<void>(`${this.url(productId)}/${detailId}`);
  }

  private url(productId: string): string {
    return `${API_BASE_URL}/products/${productId}/recipe-details`;
  }
}
