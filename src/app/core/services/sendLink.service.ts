import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import baseUrl from "./api";
import { CookieService } from 'ngx-cookie-service';
import { Observable } from "rxjs";

export interface SendApprovalLinkResponse {
    approvalLink: string;
    message: string;
    expiresAt: string;
}

export interface PublicCreditIntentionResponse {
    id: number;
    fullname: string;
    creditLineName: string;
    quotaValue: number;
    periodQuantity: number;
    periodName: string;
    totalCapitalValue: number;
    approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
    tokenExpired: boolean;
}


@Injectable({
    providedIn: "root",
})
export class SendLinkService {
    constructor(
        private http: HttpClient,
    ) { }

    // Métodos públicos (sin autenticación)
    getPublicIntentionByToken(token: string): Observable<PublicCreditIntentionResponse> {
        return this.http.get<PublicCreditIntentionResponse>(
            `${baseUrl}public/credit-approval/${token}`
        );
    }

    submitApprovalDecision(token: string, approved: boolean, comments?: string): Observable<any> {
        return this.http.post(
            `${baseUrl}public/credit-approval/decision`, {
            token,
            approved,
            comments
        });
    }

}