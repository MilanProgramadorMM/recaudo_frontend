import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import baseUrl from "./api";
import { CookieService } from 'ngx-cookie-service';
import { Observable } from "rxjs";

export interface DefaultConsultasDto {    
    id: number;
    name: string;
    value: number;    
}

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
    date: string;
    user: string;
}

export interface SaldosVencidosDetalleDto {
    creditId: number;
    creditIntentionId: number;
    zona: string;
    personName: string;
    value: number;
    diasMora: number;
    periodosVencidos: number;
    interesMoratorio: number;
    isOverdue: boolean;
}

export interface CreditosZonaDetalleDto {
    creditId: number;
    creditIntentionId: number;
    fullName: string;
    period: string;
    periodQuantity: number;
    quotaValue: number;
    creditLine: string;
    totalCapitalValue: number;
    initialValuePayment: number;
    totalFinancedValue: number;
    totalIntentionValue: number;
    totalInterestValue: number;
    itemValue: number;
    stationery: number;
}

export interface DebidoCobrarPorZonaDto {
    id: number;
    zona: string;
    quotaValue: number;
    interestValue: number;
    investmentValue: number;
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

    getSaldosVencidos(fechaInicio: string, fechaFin: string): Observable<DefaultConsultasDto[]> {
        const params = new HttpParams()
            .set('startDate', fechaInicio)
            .set('endDate', fechaFin);

        return this.http.get<DefaultConsultasDto[]>(
            `${baseUrl}consultas/saldos-vencidos`,
            { headers: this.getHeaders(), params }
        );
    }

    getSaldosVencidosDetalle(zoneId: number, startDate: string, endDate: string): Observable<SaldosVencidosDetalleDto[]> {
        const params = new HttpParams()
        .set('startDate', startDate)
        .set('endDate', endDate);
        return this.http.get<SaldosVencidosDetalleDto[]>(
            `${baseUrl}consultas/saldos-vencidos/${zoneId}`,
            { headers: this.getHeaders(), params }
        );
    }

    getCreditosPorZona(fechaInicio: string, fechaFin: string): Observable<DefaultConsultasDto[]> {
        const params = new HttpParams()
            .set('startDate', fechaInicio)
            .set('endDate', fechaFin);

        return this.http.get<DefaultConsultasDto[]>(
            `${baseUrl}consultas/creditos`,
            { headers: this.getHeaders(), params }
        );
    }

    getDetalleCreditosPorZona(zoneId: number, startDate: string, endDate: string): Observable<CreditosZonaDetalleDto[]> {
        const params = new HttpParams()
        .set('startDate', startDate)
        .set('endDate', endDate);
        return this.http.get<CreditosZonaDetalleDto[]>(
            `${baseUrl}consultas/creditos/${zoneId}`,
            { headers: this.getHeaders(), params }
        );
    }

    getDebidoCobrarPorZona(startDate: string, endDate: string): Observable<DebidoCobrarPorZonaDto[]> {
        const params = new HttpParams()
        .set('startDate', startDate)
        .set('endDate', endDate);
        return this.http.get<DebidoCobrarPorZonaDto[]>(
            `${baseUrl}consultas/debido-cobrar`,
            { headers: this.getHeaders(), params }
        );
    }
}