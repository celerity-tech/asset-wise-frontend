import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../../common/responses/api.response';
import { Location, LocationRequest } from '../types/location.types';

/**
 * Talks to the locations API. Thin by design: the Bearer token is attached by the
 * global auth interceptor, and the response envelope is unwrapped here so callers
 * only ever see domain types.
 */
@Injectable({ providedIn: 'root' })
export class LocationsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/locations`;

  list(): Observable<Location[]> {
    return this.http.get<ApiResponse<Location[]>>(this.baseUrl).pipe(map((response) => response.data));
  }

  create(body: LocationRequest): Observable<Location> {
    return this.http.post<ApiResponse<Location>>(this.baseUrl, body).pipe(map((response) => response.data));
  }

  update(id: string, body: LocationRequest): Observable<Location> {
    return this.http
      .patch<ApiResponse<Location>>(`${this.baseUrl}/${id}`, body)
      .pipe(map((response) => response.data));
  }

  /** Soft delete: the backend exposes no hard-delete endpoint. */
  archive(id: string): Observable<Location> {
    return this.http
      .delete<ApiResponse<Location>>(`${this.baseUrl}/${id}`, {})
      .pipe(map((response) => response.data));
  }
}
