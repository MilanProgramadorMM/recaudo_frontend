import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import baseUrl from './api';
import { CookieService } from 'ngx-cookie-service';

// DTO de respuesta de Tax
export interface TaxTypeDto {
  id?: number;
  name: string;
  description?: string;
  procedure: string;
  status: string;
}

// DTO para crear/editar
export interface CreateTaxTypeDto {
  name: string;
  description?: string;
  procedure: string;
}

// DTO genérico de respuesta
export interface DefaultResponseDto<T> {
  status: string;
  message: string;
  details: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class TaxTypeService {
  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getAll(): Observable<DefaultResponseDto<TaxTypeDto[]>> {
    return this.http.get<DefaultResponseDto<TaxTypeDto[]>>(
      `${baseUrl}tax/get-all`,
      { headers: this.getHeaders() }
    );
  }

  getById(id: number): Observable<DefaultResponseDto<TaxTypeDto>> {
    return this.http.get<DefaultResponseDto<TaxTypeDto>>(
      `${baseUrl}tax/${id}`,
      { headers: this.getHeaders() }
    );
  }

  create(tax: CreateTaxTypeDto): Observable<DefaultResponseDto<TaxTypeDto>> {
    return this.http.post<DefaultResponseDto<TaxTypeDto>>(
      `${baseUrl}tax/create`,
      tax,
      { headers: this.getHeaders() }
    );
  }

  edit(id: number, tax: CreateTaxTypeDto): Observable<DefaultResponseDto<TaxTypeDto>> {
    return this.http.put<DefaultResponseDto<TaxTypeDto>>(
      `${baseUrl}tax/edit/${id}`,
      tax,
      { headers: this.getHeaders() }
    );
  }

  delete(id: number): Observable<DefaultResponseDto<TaxTypeDto>> {
    return this.http.delete<DefaultResponseDto<TaxTypeDto>>(
      `${baseUrl}tax/delete/${id}`,
      { headers: this.getHeaders() }
    );
  }
}
