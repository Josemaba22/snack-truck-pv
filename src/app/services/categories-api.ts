import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../core/api-config';
import { CategoryResponse } from '../models/api/category.api';

@Injectable({ providedIn: 'root' })
export class CategoriesApiService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<CategoryResponse[]> {
    return this.http.get<CategoryResponse[]>(`${API_BASE_URL}/categories`);
  }
}
