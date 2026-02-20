import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core"
import { CookieService } from "ngx-cookie-service";
import { Observable } from "rxjs";
import baseUrl from "./api";

// DTO de respuesta de Insurance
export interface InsuranceResponseDto {
    id?: number;
    name: string;
    description?: string;
    procedure: string;
    status: string;
}

// DTO para crear/editar
export interface InsuranceCreateDto {
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
export class InsuranceService {

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

    getAll(): Observable<DefaultResponseDto<InsuranceResponseDto[]>> {
        return this.http.get<DefaultResponseDto<InsuranceResponseDto[]>>(
            `${baseUrl}insurance-type/get-all`,
            { headers: this.getHeaders() }
        );
    }

    getById(id: number): Observable<DefaultResponseDto<InsuranceResponseDto>> {
        return this.http.get<DefaultResponseDto<InsuranceResponseDto>>(
            `${baseUrl}insurance-type/${id}`,
            { headers: this.getHeaders() }
        );
    }

    create(data: InsuranceCreateDto): Observable<DefaultResponseDto<InsuranceResponseDto>> {
        return this.http.post<DefaultResponseDto<InsuranceResponseDto>>(
            `${baseUrl}insurance-type/create`,
            data,
            { headers: this.getHeaders() }
        );
    }

    edit(id: number, data: InsuranceCreateDto): Observable<DefaultResponseDto<InsuranceResponseDto>> {
        return this.http.put<DefaultResponseDto<InsuranceResponseDto>>(
            `${baseUrl}insurance-type/edit/${id}`,
            data,
            { headers: this.getHeaders() }
        );
    }

    delete(id: number): Observable<DefaultResponseDto<InsuranceResponseDto>> {
        return this.http.delete<DefaultResponseDto<InsuranceResponseDto>>(
            `${baseUrl}insurance-type/delete/${id}`,
            { headers: this.getHeaders() }
        );
    }
}