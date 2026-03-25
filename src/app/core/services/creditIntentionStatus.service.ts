import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import baseUrl from './api';
import { CookieService } from 'ngx-cookie-service';

export interface ChangeCreditStatusDto {
  credit_id: number;
  current_status: string;
  new_status: string; 
  observation: string;
  activity: string;
}

export interface CreditIntentionStatusResponseDto {
  id: number;
  creditIntentionId: number;
  code: string;
  startDate: string;
  endDate?: string;
  status: boolean;
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
export class CreditIntentionStatusService {


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

  updateStatus(
    payload: ChangeCreditStatusDto
  ): Observable<DefaultResponseDto<CreditIntentionStatusResponseDto>> {
    return this.http.put<DefaultResponseDto<CreditIntentionStatusResponseDto>>(
      `${baseUrl}credit-intention-status/update-credit`,
      payload,
      { headers: this.getHeaders() }
    );
  }


}
