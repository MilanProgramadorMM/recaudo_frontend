import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import baseUrl from './api';

export interface PendingQuotaForAgreement {
    quotaId: number;
    quotaNumber: number;
    expirationDate: string;
    quotaValue: number;
    remainingBalance: number;
    daysOverdue: number;
    pastduePeriods: number;   // ← agregado
    delayPenalty: number;
    isOverdue: boolean;
}

export interface QuotaDetailDto {
    cuotaId: number;
    daysLate: number;
    pastduePeriods: number;
    balancePending: number;
    delayPenalty: number;
}

export interface CreateAgreementRequest {
    creditId: number;
    discountValue: number;
    quotas: QuotaDetailDto[];
}

export interface AgreementDetailResponse {
    id: number;
    cuotaId: number;
    quotaNumber: number;
    daysLate: number;
    pastduePeriods: number;
    balancePending: number;
    delayPenalty: number;
}

export interface AgreementResponse {
    id: number;
    creditId: number;
    projectedValue: number;
    discountValue: number;
    agreedValue: number;
    paymentDate: string;
    status: boolean;
    userCreate: string;
    createdAt: string;
    detalles: AgreementDetailResponse[];
}

export interface DefaultResponseDto<T> {
    message: string;
    details: string;
    status: string;
    data: T;
}

@Injectable({ providedIn: 'root' })
export class DelayPenaltyAgreementService {

    constructor(
        private http: HttpClient,
        private cookieService: CookieService
    ) { }

    private getHeaders(): HttpHeaders {
        const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
        return new HttpHeaders({ Authorization: `Bearer ${token}` });
    }

    getPendingQuotasWithPenalties(
        creditId: number
    ): Observable<DefaultResponseDto<PendingQuotaForAgreement[]>> {
        return this.http.get<DefaultResponseDto<PendingQuotaForAgreement[]>>(
            `${baseUrl}delay-penalty-agreement/credit/${creditId}/pending-quotas`,
            { headers: this.getHeaders() }
        );
    }

    createAgreement(
        request: CreateAgreementRequest
    ): Observable<DefaultResponseDto<AgreementResponse>> {
        return this.http.post<DefaultResponseDto<AgreementResponse>>(
            `${baseUrl}delay-penalty-agreement`,   // POST / sin /create
            request,
            { headers: this.getHeaders() }
        );
    }

    getAgreementsByCreditId(
        creditId: number
    ): Observable<DefaultResponseDto<AgreementResponse[]>> {
        return this.http.get<DefaultResponseDto<AgreementResponse[]>>(
            `${baseUrl}delay-penalty-agreement/credit/${creditId}`,
            { headers: this.getHeaders() }
        );
    }

    updateAgreementStatus(
        agreementId: number,
        status: boolean
    ): Observable<DefaultResponseDto<AgreementResponse>> {
        return this.http.patch<DefaultResponseDto<AgreementResponse>>(
            `${baseUrl}delay-penalty-agreement/${agreementId}/status?status=${status}`,
            null,
            { headers: this.getHeaders() }
        );
    }
}