import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core"
import { CookieService } from "ngx-cookie-service";
import { Observable } from "rxjs";
import baseUrl from "./api";


// DTO de respuesta de ServiceQuota
export interface ServiceQuotaResponseDto {
    id?: number;
    name: string;
    description?: string;
    procedure: string;
    status: string;
}

// DTO para crear/editar
export interface ServiceQuotaCreateDto {
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
export class ServiceQuotaService {

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

    getAll(): Observable<DefaultResponseDto<ServiceQuotaResponseDto[]>> {
        return this.http.get<DefaultResponseDto<ServiceQuotaResponseDto[]>>(
            `${baseUrl}service-quota/get-all`,
            { headers: this.getHeaders() }
        );
    }

    getById(id: number): Observable<DefaultResponseDto<ServiceQuotaResponseDto>> {
        return this.http.get<DefaultResponseDto<ServiceQuotaResponseDto>>(
            `${baseUrl}service-quota/${id}`,
            { headers: this.getHeaders() }
        );
    }

    create(data: ServiceQuotaCreateDto): Observable<DefaultResponseDto<ServiceQuotaResponseDto>> {
        return this.http.post<DefaultResponseDto<ServiceQuotaResponseDto>>(
            `${baseUrl}service-quota/create`,
            data,
            { headers: this.getHeaders() }
        );
    }

    edit(id: number, data: ServiceQuotaCreateDto): Observable<DefaultResponseDto<ServiceQuotaResponseDto>> {
        return this.http.put<DefaultResponseDto<ServiceQuotaResponseDto>>(
            `${baseUrl}service-quota/edit/${id}`,
            data,
            { headers: this.getHeaders() }
        );
    }

    delete(id: number): Observable<DefaultResponseDto<ServiceQuotaResponseDto>> {
        return this.http.delete<DefaultResponseDto<ServiceQuotaResponseDto>>(
            `${baseUrl}service-quota/delete/${id}`,
            { headers: this.getHeaders() }
        );
    }
}