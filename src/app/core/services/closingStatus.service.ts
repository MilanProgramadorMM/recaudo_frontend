import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import baseUrl from './api';
import { DefaultResponseDto } from './user.service';

export enum ClosingStatus {
  PRE_CIERRE = 'PRE_CIERRE',
  STUDY = 'STUDY',
  PRE_APPROVED = 'PRE_APPROVED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface ChangeClosingStatusDto {
  closingId: number;
  newStatus: ClosingStatus;
  observation?: string;
}

export interface ClosingStatusResponseDto {
  id: number;
  closing_id: number;
  code: ClosingStatus;
  user_start: string;
  user_end?: string;
  start_date: string;
  end_date?: string;
  zone: number;
}


@Injectable({
  providedIn: 'root'
})
export class ClosingStatusService {
  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }


  /**
   * Cambiar el estado de un cierre
   * PUT /closing-status/update
   */
  updateStatus(dto: ChangeClosingStatusDto): Observable<DefaultResponseDto<ClosingStatusResponseDto>> {
    return this.http.put<DefaultResponseDto<ClosingStatusResponseDto>>(
      `${baseUrl}closing-status/update`,
      dto,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Obtener el estado actual de un cierre
   * GET /closing-status/current/{closingId}
   */
  getCurrentStatus(closingId: number): Observable<DefaultResponseDto<ClosingStatusResponseDto>> {
    return this.http.get<DefaultResponseDto<ClosingStatusResponseDto>>(
      `${baseUrl}closing-status/current/${closingId}`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Obtener historial de estados de un cierre
   * GET /closing-status/history/{closingId}
   */
  getStatusHistory(closingId: number): Observable<DefaultResponseDto<ClosingStatusResponseDto[]>> {
    return this.http.get<DefaultResponseDto<ClosingStatusResponseDto[]>>(
      `${baseUrl}closing-status/history/${closingId}`,
      { headers: this.getHeaders() }
    );
  }
}