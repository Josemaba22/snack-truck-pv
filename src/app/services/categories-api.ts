import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../core/api-config';
import { CategoryRequest, CategoryResponse } from '../models/api/category.api';

@Injectable({ providedIn: 'root' })
export class CategoriesApiService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<CategoryResponse[]> {
    return this.http.get<CategoryResponse[]>(`${API_BASE_URL}/categories`);
  }

  getById(id: string): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(`${API_BASE_URL}/categories/${id}`);
  }

  create(request: CategoryRequest): Observable<CategoryResponse> {
    return this.http.post<CategoryResponse>(`${API_BASE_URL}/categories`, request);
  }

  update(id: string, request: CategoryRequest): Observable<CategoryResponse> {
    return this.http.put<CategoryResponse>(`${API_BASE_URL}/categories/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/categories/${id}`);
  }
}
