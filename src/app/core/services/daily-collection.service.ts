import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from './api';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

export interface DailyCollectionItem {
    creditId: number;
    cuotaId: number;
    quotaNumber: number;
    expirationDate: string;
    clientName: string;
    paidToday: number;
    paidFull: string;                      
    liquidated: string;
    paymentPromiseDate?: string | null;
    noPago?: number; // 0 = no registrado, 1 = registrado como "no pagó"
    noPagoReason?: string | null;
    clientOrden: number;
    clientCuota: number;
    zona?: string;
    periodo: string;
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

    getDailyCollection(date: string): Observable<DailyCollectionItem[]> {
        return this.http.get<DailyCollectionItem[]>(
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