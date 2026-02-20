import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import baseUrl from './api';
import { CookieService } from 'ngx-cookie-service';

export interface DocumentTypeDto {
  id: number;
  name: string;
  description?: string;
  status: string;
}

export interface CreditLineDto {
  id: number;
  name: string;
  description?: string;
  minQuota: number;
  maxQuota: number;
  minPeriod: number;
  maxPeriod: number;
  taxType: number;
  taxTypeName?: string;
  amortizationType: number;
  amortizationTypeName?: string;
  procedureName?: string;
  lifeInsurance: boolean;
  portfolioInsurance: boolean;
  requireDocumentation: boolean;
  loanDisbursement: boolean;
  requiredDocuments?: DocumentTypeDto[];
}

export interface CreateCreditLineDto {
  name: string;
  description?: string;
  min_quota: number;
  max_quota: number;
  min_period: number;
  max_period: number;
  tax_type_id: number;
  amortization_type_id: number;
  procedure_name?: string;
  life_insurance: boolean;
  portfolio_insurance: boolean;
  loan_disbursement: boolean;
  require_documentation: boolean;
}

export interface DefaultResponseDto<T> {
  status: string;
  message: string;
  details: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class CreditLineService {
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

  getAll(): Observable<DefaultResponseDto<CreditLineDto[]>> {
    return this.http.get<DefaultResponseDto<CreditLineDto[]>>(
      `${baseUrl}credit-line/get-all`,
      { headers: this.getHeaders() }
    );
  }

  getById(id: number): Observable<DefaultResponseDto<CreditLineDto>> {
    return this.http.get<DefaultResponseDto<CreditLineDto>>(
      `${baseUrl}credit-line/get/${id}`,
      { headers: this.getHeaders() }
    );
  }


  register(creditLine: CreateCreditLineDto): Observable<DefaultResponseDto<CreditLineDto>> {
    return this.http.post<DefaultResponseDto<CreditLineDto>>(
      `${baseUrl}credit-line/register`,
      creditLine,
      { headers: this.getHeaders() }
    );
  }

  update(id: number, creditLine: CreateCreditLineDto): Observable<DefaultResponseDto<CreditLineDto>> {
    return this.http.put<DefaultResponseDto<CreditLineDto>>(
      `${baseUrl}credit-line/update/${id}`,
      creditLine,
      { headers: this.getHeaders() }
    );
  }

  delete(id: number): Observable<DefaultResponseDto<void>> {
    return this.http.delete<DefaultResponseDto<void>>(
      `${baseUrl}credit-line/delete/${id}`,
      { headers: this.getHeaders() }
    );
  }


}
