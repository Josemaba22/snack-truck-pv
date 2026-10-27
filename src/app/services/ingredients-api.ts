import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../core/api-config';
import { IngredientRequest, IngredientResponse } from '../models/api/ingredient.api';

@Injectable({ providedIn: 'root' })
export class IngredientsApiService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<IngredientResponse[]> {
    return this.http.get<IngredientResponse[]>(`${API_BASE_URL}/ingredients`);
  }

  getById(id: string): Observable<IngredientResponse> {
    return this.http.get<IngredientResponse>(`${API_BASE_URL}/ingredients/${id}`);
  }

  create(request: IngredientRequest): Observable<IngredientResponse> {
    return this.http.post<IngredientResponse>(`${API_BASE_URL}/ingredients`, request);
  }

  update(id: string, request: IngredientRequest): Observable<IngredientResponse> {
    return this.http.put<IngredientResponse>(`${API_BASE_URL}/ingredients/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/ingredients/${id}`);
  }

  // JPEG, PNG o WebP, máx. 5MB. La API valida por magic bytes.
  uploadImage(id: string, file: File): Observable<IngredientResponse> {
    const body = new FormData();
    body.append('file', file);
    return this.http.put<IngredientResponse>(`${API_BASE_URL}/ingredients/${id}/image`, body);
  }

  deleteImage(id: string): Observable<IngredientResponse> {
    return this.http.delete<IngredientResponse>(`${API_BASE_URL}/ingredients/${id}/image`);
  }
}
