import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../core/api-config';
import { ProductRecipeDetailResponse } from '../models/api/product-recipe-detail.api';

@Injectable({ providedIn: 'root' })
export class ProductRecipeDetailsApiService {
  constructor(private readonly http: HttpClient) {}

  getByProduct(productId: string): Observable<ProductRecipeDetailResponse[]> {
    return this.http.get<ProductRecipeDetailResponse[]>(
      `${API_BASE_URL}/products/${productId}/recipe-details`,
    );
  }
}
