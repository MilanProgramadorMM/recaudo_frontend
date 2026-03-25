import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import baseUrl from './api';
import { CookieService } from 'ngx-cookie-service';

export interface SaveCreditObservationDto {
  credit_id: number;
  new_status: string;
  current_status: string;
  observation: string;
  activity: string;
}

export interface CreditIntentionObservationResponseDto {
  id: number;
  credit_intention_id: number;
  credit_intention_status_start: string;  
  credit_intention_status_end: string;
  activity: string;
  observation: string;
  user_create: string;
  created_at: number[] | string;          
}

export interface CreditIntentionStatusResponseDto {
  id: number;
  creditIntentionId: number;
  creditIntentionStatus: string;
  activity: string;
  observation: string;
  userCreate: string;
  createdAt: string;
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
export class CreditIntentionObservationService {


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

  saveActivity(payload: SaveCreditObservationDto): Observable<DefaultResponseDto<CreditIntentionStatusResponseDto>> {
    return this.http.post<DefaultResponseDto<CreditIntentionStatusResponseDto>>(
      `${baseUrl}credit-intention-observation/save`,
      payload,
      { headers: this.getHeaders() }
    );
  }

  getObservationsByCreditId(
    creditIntentionId: number
  ): Observable<DefaultResponseDto<CreditIntentionObservationResponseDto[]>> {
    return this.http.get<DefaultResponseDto<CreditIntentionObservationResponseDto[]>>(
      `${baseUrl}credit-intention-observation/by-credit/${creditIntentionId}`,
      { headers: this.getHeaders() }
    );
  }


}
