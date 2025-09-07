import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import baseUrl from './api';
import { CookieService } from 'ngx-cookie-service';

// DTO de respuesta de OtherDiscounts
export interface OtherDiscountsDto {
    id?: number;
    name: string;
    description?: string;
    procedure: string;
    status: string;
}

// DTO para crear/editar
export interface CreateOtherDiscountsDto {
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
export class OtherDiscountsService {
    constructor(
        private http: HttpClient,
        private cookieService: CookieService
    ) { }

    private getHeaders(): HttpHeaders {
        const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
        return new HttpHeaders({
            Authorization: `Bearer ${token}`
        });
    }

    getAll(): Observable<DefaultResponseDto<OtherDiscountsDto[]>> {
        return this.http.get<DefaultResponseDto<OtherDiscountsDto[]>>(
            `${baseUrl}discounts/get-all`,
            { headers: this.getHeaders() }
        );
    }

    getById(id: number): Observable<DefaultResponseDto<OtherDiscountsDto>> {
        return this.http.get<DefaultResponseDto<OtherDiscountsDto>>(
            `${baseUrl}discounts/${id}`,
            { headers: this.getHeaders() }
        );
    }

    create(discount: CreateOtherDiscountsDto): Observable<DefaultResponseDto<OtherDiscountsDto>> {
        return this.http.post<DefaultResponseDto<OtherDiscountsDto>>(
            `${baseUrl}discounts/create`,
            discount,
            { headers: this.getHeaders() }
        );
    }

    edit(id: number, discount: CreateOtherDiscountsDto): Observable<DefaultResponseDto<OtherDiscountsDto>> {
        return this.http.put<DefaultResponseDto<OtherDiscountsDto>>(
            `${baseUrl}discounts/edit/${id}`,
            discount,
            { headers: this.getHeaders() }
        );
    }

    delete(id: number): Observable<DefaultResponseDto<OtherDiscountsDto>> {
        return this.http.delete<DefaultResponseDto<OtherDiscountsDto>>(
            `${baseUrl}discounts/delete/${id}`,
            { headers: this.getHeaders() }
        );
    }
}
