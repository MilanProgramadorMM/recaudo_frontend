import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import baseUrl from "./api";
import { CookieService } from 'ngx-cookie-service';
import { Observable } from "rxjs";

export interface MovimientoZonaDto {
    zone_id: number;
    zone_name: string;
    total_recaudado: number;
    total_capital: number;
    total_interes: number;
    total_seguro_vida: number;
    total_seguro_cartera: number;
}

export interface MovimientoDetalleDto {
    zona: string;
    concept_key: string;
    concept: string;
    payment_type: string;
    value_paid: number;
    investment_value: number;
    interest_value: number;
    life_insurance: number;
    portfolio_insurance: number;
}

export interface MovimientosResponse {
    data: MovimientoZonaDto[];
}

@Injectable({
    providedIn: "root",
})
export class ConsultasService {

    constructor(
        private http: HttpClient,
        private cookieService: CookieService
    ) { }

    private getHeaders(): HttpHeaders {
        const token = this.cookieService.get("_OSEN_AUTH_SESSION_KEY_");
        return new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
    }

    getMovimientosAll(fechaInicio: string, fechaFin: string): Observable<MovimientoZonaDto[]> {
        const params = new HttpParams()
            .set('startDate', fechaInicio)
            .set('endDate', fechaFin);

        return this.http.get<MovimientoZonaDto[]>(
            `${baseUrl}consultas/movimientos/all`,
            { headers: this.getHeaders(), params }
        );
    }

    getMovimientosDetalle(zoneId: number, startDate: string, endDate: string): Observable<MovimientoDetalleDto[]> {
        const params = new HttpParams()
            .set('startDate', startDate)
            .set('endDate', endDate);
        return this.http.get<MovimientoDetalleDto[]>(
            `${baseUrl}consultas/movimientos/detalle/${zoneId}`,
            { headers: this.getHeaders(), params }
        );
    }
}