import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import baseUrl from "./api";
import { CookieService } from 'ngx-cookie-service';
import { Observable } from "rxjs";

export interface CreditPaymentStatus {
    creditId: number;
    personId: number;
    quotaValue: number;
    periodQuantity: number;
    periodName: string;
    totalIntentionValue: number;
    totalInterestValue: number;
    totalCapitalValue: number;
    totalCuotas: number;
    cuotasPagadas: number;
    cuotasPendientes: number;
    totalPagado: number;
    totalPendiente: number;
    porcentajePagado: number;
    cuotas: QuotaDetail[];
    recaudos: RecaudoDetail[];
}

export interface QuotaDetail {
    quotaId: number;
    quotaNumber: number;
    expirationDate: string;
    liquidated: string;
    paidFull: string;
    quotaValue: number;
    totalPaid: number;
    remainingBalance: number;
    portfolioInsurancePending: number;
    lifeInsurancePending: number;
    interestPending: number;
    investmentPending: number;
    totalPending: number;
    isPaid: boolean;
    hasInterestPayment: boolean;
    isOverdue: boolean;
    delayPenalty: number;
    daysOverdue: number;
}

export interface CreditIntentionDetail {
    intentionId: number;
    clientName: string;
    document: string;
    totalCapitalValue: number;
    totalIntentionValue: number;
    quotaValue: number;
    periodQuantity: number;
    zona: string;
    createdAt: string;
}

export interface RecaudoDetail {
    recaudoId: number;
    quotaNumber: number;
    conceptName: string;
    valuePaid: number;
    investmentValue: number;
    interestValue: number;
    lifeInsurance: number;
    portfolioInsurance: number;
    userCreate: string;
    createdAt: string;
    delayPenalty: number;
}

export interface PaymentRequestt {
    creditId: number;
    valuePaid: number;
}

export interface PaymentResult {
    creditId: number;
    totalPaid: number;
    cuotasPagadas: number;
    cuotasFaltantes: number;
    saldoSobrante: number;
}

export interface ReverseRecaudoRequest {
    creditId: number;
    recaudoIds: number[];
}

export interface ReverseCapitalInterestRequest {
    creditId: number;
    recaudoIds: number[];
}


@Injectable({
    providedIn: 'root'
})
export class RecaudoService {

    constructor(private http: HttpClient,
        private cookieService: CookieService

    ) { }

    private getHeaders(): HttpHeaders {
        const token = this.cookieService.get("_OSEN_AUTH_SESSION_KEY_");
        return new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
    }

    getCreditPaymentStatus(creditId: number) {

        return this.http.get<
            CreditPaymentStatus
        >(`${baseUrl}recaudo/status/${creditId}`,
            { headers: this.getHeaders() }
        );
    }

    getRecaudosByUserAndDate(closingId: number, fecha: string, zonaId: number): Observable<RecaudoDetail[]> {
        return this.http.get<RecaudoDetail[]>(
            `${baseUrl}recaudo/user/${closingId}/date/${fecha}/zona/${zonaId}`,
            { headers: this.getHeaders() }
        );
    }

    /**
     * Procesa un pago de cuota(s)
     */
    processPayment(formData: FormData): Observable<PaymentResult> {
        return this.http.post<PaymentResult>(
            `${baseUrl}recaudo/save`,
            formData
        );
    }

    getIntentionsByUserAndDate(closingId: number, fecha: string, zonaId: number): Observable<CreditIntentionDetail[]> {
        return this.http.get<CreditIntentionDetail[]>(
            `${baseUrl}recaudo/intentions/user/${closingId}/date/${fecha}/zona/${zonaId}`,
            { headers: this.getHeaders() }
        );
    }

    reverseRecaudos(request: ReverseRecaudoRequest): Observable<PaymentResult> {
        return this.http.post<PaymentResult>(
            `${baseUrl}recaudo/reverse/recaudos`,
            request,
            { headers: this.getHeaders() }
        );
    }

    reverseCapital(request: ReverseCapitalInterestRequest): Observable<PaymentResult> {
        return this.http.post<PaymentResult>(
            `${baseUrl}recaudo/reverse/capital`,
            request,
            { headers: this.getHeaders() }
        );
    }

    reverseInterest(request: ReverseCapitalInterestRequest): Observable<PaymentResult> {
        return this.http.post<PaymentResult>(
            `${baseUrl}recaudo/reverse/interest`,
            request,
            { headers: this.getHeaders() }
        );
    }

}