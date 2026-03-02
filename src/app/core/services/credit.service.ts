import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import baseUrl from "./api";
import { CookieService } from 'ngx-cookie-service';
import { Observable } from "rxjs";


export interface CreditRegisterDto {
    creditIntentionId: number;
    personId: number;
    creditLineId: number;
    quotaValue: number;
    periodId: number;
    periodQuantity: number;
    taxTypeId: number;
    taxValue: number;
    totalIntentionValue: number;
    totalInterestValue: number;
    totalCapitalValue: number;
    itemValue: number;
    initialValuePayment: number;
    totalFinancedValue: number;
    stationery: number;
}

export interface CreditCausadoDetail {
    id: number;
    totalCapitalValue: number;
    createdAt: string;
    clientName: string;
}

export interface CreditResponseDto {
    id: number;
    creditIntentionId: number;

    quotaValue: number;
    periodQuantity: number;

    totalIntentionValue: number;
    totalInterestValue: number;
    totalCapitalValue: number;
    totalFinancedValue: number;

    zoneId: number;
    zoneName: string;

    document: string;
    fullname: string;
    phoneNumber: string;

    creditLineId: number;
    creditLineName: string;

    createdAt: string | null;
    editedAt: string | null;

    periodName: string;
}



export interface DefaultResponseDto<T> {
    status: string;
    message: string;
    details: string;
    data: T;
}

@Injectable({
    providedIn: "root",
})
export class CreditService {
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

    createCredit(data: CreditRegisterDto) {
        return this.http.post<DefaultResponseDto<any>>(
            `${baseUrl}credits/create`,
            data,
            { headers: this.getHeaders() }
        );
    }

    getCredits() {
        return this.http.get<
            DefaultResponseDto<CreditResponseDto[]>
        >(
            `${baseUrl}credits/get-all`,
            { headers: this.getHeaders() }
        );
    }

    getCreditsById(id: number) {
        return this.http.get<
            DefaultResponseDto<CreditResponseDto>
        >(
            `${baseUrl}credits/get-by-id/${id}`,
            { headers: this.getHeaders() }
        );
    }

    getCreditsbyPersonId(id: number) {
        return this.http.get<DefaultResponseDto<CreditResponseDto[]>>(
            `${baseUrl}credits/get-by-person/${id}`,
            { headers: this.getHeaders() }
        );
    }

    getCreditsCausadosByClosing(closingId: number) {
        return this.http.get<DefaultResponseDto<CreditCausadoDetail[]>>(
            `${baseUrl}credits/causados-by-closing/${closingId}`,
            { headers: this.getHeaders() }
        );
    }

}