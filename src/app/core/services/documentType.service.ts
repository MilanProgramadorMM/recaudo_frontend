import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import baseUrl from './api';
import { CookieService } from 'ngx-cookie-service';

export interface DocumentTypeResponseDto {
  id: number;        
  name: string;
  description?: string;
  status: string;     
}

export interface DocumentTypeCreateDto {
  name: string;
  description?: string;
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
export class DocumentService {
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

  getAll(): Observable<DefaultResponseDto<DocumentTypeResponseDto[]>> {
    return this.http.get<DefaultResponseDto<DocumentTypeResponseDto[]>>(
      `${baseUrl}document-type/get-all`,
      { headers: this.getHeaders() }
    );
  }

  getById(id: number): Observable<DefaultResponseDto<DocumentTypeResponseDto>> {
    return this.http.get<DefaultResponseDto<DocumentTypeResponseDto>>(
      `${baseUrl}document-type/${id}`,
      { headers: this.getHeaders() }
    );
  }

  create(document: Omit<DocumentTypeResponseDto, 'code'>): Observable<DefaultResponseDto<DocumentTypeResponseDto>> {
    return this.http.post<DefaultResponseDto<DocumentTypeResponseDto>>(
      `${baseUrl}document-type/create`,
      document,
      { headers: this.getHeaders() }
    );
  }

  edit(id: number, document: Omit<DocumentTypeResponseDto, 'code'>): Observable<DefaultResponseDto<DocumentTypeResponseDto>> {
    return this.http.put<DefaultResponseDto<DocumentTypeResponseDto>>(
      `${baseUrl}document-type/edit/${id}`,
      document,
      { headers: this.getHeaders() }
    );
  }

  delete(id: number): Observable<DefaultResponseDto<DocumentTypeResponseDto>> {
    return this.http.delete<DefaultResponseDto<DocumentTypeResponseDto>>(
      `${baseUrl}document-type/delete/${id}`,
      { headers: this.getHeaders() }
    );
  }
}
