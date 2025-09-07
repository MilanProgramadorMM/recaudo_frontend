import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import baseUrl from './api';
import { CookieService } from 'ngx-cookie-service';

// Para listar amortizaciones
export interface AmortizationDto {
  id: number;        // opcional para creación
  code?: string;      
  name: string;
  description?: string;
  procedure: string;
  status: string;     
}

// Para crear o actualizar una nueva amortización
export interface CreateAmortizationDto {
  code: string;      // lo devuelve el backend
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
export class AmortizationService {
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

  getAll(): Observable<DefaultResponseDto<AmortizationDto[]>> {
    return this.http.get<DefaultResponseDto<AmortizationDto[]>>(
      `${baseUrl}amortization-type/get-all`,
      { headers: this.getHeaders() }
    );
  }

  getById(id: number): Observable<DefaultResponseDto<AmortizationDto>> {
    return this.http.get<DefaultResponseDto<AmortizationDto>>(
      `${baseUrl}amortization-type/${id}`,
      { headers: this.getHeaders() }
    );
  }

  create(amortization: Omit<AmortizationDto, 'code'>): Observable<DefaultResponseDto<AmortizationDto>> {
    return this.http.post<DefaultResponseDto<AmortizationDto>>(
      `${baseUrl}amortization-type/create`,
      amortization,
      { headers: this.getHeaders() }
    );
  }

  edit(id: number, amortization: Omit<AmortizationDto, 'code'>): Observable<DefaultResponseDto<AmortizationDto>> {
    return this.http.put<DefaultResponseDto<AmortizationDto>>(
      `${baseUrl}amortization-type/edit/${id}`,
      amortization,
      { headers: this.getHeaders() }
    );
  }

  delete(id: number): Observable<DefaultResponseDto<AmortizationDto>> {
    return this.http.delete<DefaultResponseDto<AmortizationDto>>(
      `${baseUrl}amortization-type/delete/${id}`,
      { headers: this.getHeaders() }
    );
  }
}
