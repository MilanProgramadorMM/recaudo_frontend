import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from './api';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

export interface CardData {
    creditId: number;
    clientName: string;
    clientOrden: number;
    zonaCode: string;
    zona: string;
    totalCapitalValue: number | null;
    saldoPendiente: number | null;
    totalMoraCredito: number | null;
    periodosVencidos: number | null;

    fechaCredito: number[] | null;
    lineaname: string | null;
    periodo: string | null;
    plazoCredito: number | null;
    fechaVence: number[] | null;
    totalCuotas: number | null;
    cuotasPagadas: number | null;
    cuotasVencidas: number | null;
    direccion: string | null;
    whatsapp: string | null;
    celular: string | null;
    barrio: string | null;
    municipio: string | null;

    cuotaId: number | null;
    quotaNumber: number | null;
    expirationDate: number[] | null;
    valorCuota: number | null;
    saldoPendienteCuota: number | null;
    interestMora: number | null;
    paidToday: number | null;
    paidFull: string | null;
    liquidated: string | null;
    paymentPromiseDate: number[] | null;
    noPago: number | null;
    noPagoReason: string | null;
    nombreDia: string | null;

    cuotasPendientes: number | null;
    proximaCuotaFecha: number[] | null;
    proximaCuotaNumero: number | null;

    primeraCuotaVencida: number[] | null;
    primeraCuotaVencidaNumero: number | null;
}

export interface DailyCollectionItemRespaldo {
    creditId: number;
    fechaInicio: string;
    fechaFin: string;
    grupoId: number;
    totalPagado: number;
    nombreDia: string;
}

export interface RatingCredit {
    ratingValue: string;
    start: number | null;
    end: number | null;
}

export interface DailyCollectionItemDTO {
    data: CardData;
    recaudos: DailyCollectionItemRespaldo[];
    ratingCredit: RatingCredit;
    flipped?: boolean;
}

export interface DailyCollectionResultDTO {
    cobroHoy: DailyCollectionItemDTO[];
    carteraZona: DailyCollectionItemDTO[];
    enMora: DailyCollectionItemDTO[];
}

@Injectable({
    providedIn: 'root'
})
export class DailyCollectionService {

    constructor(
        private http: HttpClient,
        private cookieService: CookieService
    ) { }

    private getHeaders(): HttpHeaders {
        const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
        return new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
    }

    getDailyCollection(date: string): Observable<DailyCollectionResultDTO> {
        return this.http.get<DailyCollectionResultDTO>(
            `${baseUrl}collection/daily?date=${date}`,
            { headers: this.getHeaders() }
        );
    }

    registerPromise(
        creditId: number,
        cuotaId: number,
        promiseDate: string,
        observation?: string
    ): Observable<any> {
        return this.http.post(
            `${baseUrl}collection/promise`,
            null,
            {
                params: {
                    creditId: creditId.toString(),
                    cuotaId: cuotaId.toString(),
                    promiseDate,
                    observation: observation || ''
                },
                headers: this.getHeaders()
            }
        );
    }

    registerNoPago(
        creditId: number,
        cuotaId: number,
        reason: string,
        observation?: string
    ): Observable<any> {
        return this.http.post(
            `${baseUrl}collection/no-pago`,
            null,
            {
                params: {
                    creditId: creditId.toString(),
                    cuotaId: cuotaId.toString(),
                    reason,
                    observation: observation || ''
                },
                headers: this.getHeaders()
            }
        );
    }

    getVisitDetail(cuotaId: number, date: string): Observable<any> {
        return this.http.get(
            `${baseUrl}collection/visit-detail`,
            {
                params: {
                    cuotaId: cuotaId.toString(),
                    date
                },
                headers: this.getHeaders()
            }
        );
    }
}