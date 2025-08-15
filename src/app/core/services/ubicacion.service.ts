// ubicacion.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import baseUrl from './api';
import { CookieService } from 'ngx-cookie-service';


export interface OptionDTO {
    id: number;
    label: string;
}

@Injectable({ providedIn: 'root' })
export class UbicacionService {

    constructor(private http: HttpClient,
        private cookieService: CookieService
    ) { }

    private getAuthHeaders(): HttpHeaders {
        const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
        return new HttpHeaders({
            Authorization: `Bearer ${token}`
        });
    }

    getPaises(): Observable<OptionDTO[]> {
        return this.http.get<OptionDTO[]>(`${baseUrl}ubicacion/paises`, {
            headers: this.getAuthHeaders()
        });
    }

    getDepartamentos(paisId: number): Observable<OptionDTO[]> {
        return this.http.get<OptionDTO[]>(`${baseUrl}ubicacion/paises/${paisId}/departamentos`, {
            headers: this.getAuthHeaders()
        });
    }

    getMunicipios(departamentoId: number): Observable<OptionDTO[]> {
        return this.http.get<OptionDTO[]>(`${baseUrl}ubicacion/departamentos/${departamentoId}/municipios`, {
            headers: this.getAuthHeaders()
        });
    }

    getBarrios(municipioId: number): Observable<OptionDTO[]> {
        return this.http.get<OptionDTO[]>(`${baseUrl}ubicacion/municipios/${municipioId}/barrios`, {
            headers: this.getAuthHeaders()
        });
    }
}
