import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import baseUrl from './api';

export interface ClosingDto {
  closingDate: string;
  personId: number;
  observation?: string;
  zonaId: number;
}
export interface ClosingTodayDto {
  closingId: number;
  closingStatus: string;
  closingDate: string;
  personId: number;
}

export interface ClosingResponseDto {
  id: number;
  amount?: number | null;
  closingDate: string;
  personId?: number | null;
  namePerson?: string;
  closingStatus?: string;
  observation?: string | null;

  amountAdmin?: number | null;
  amountAsesor?: number | null;
  deliveryType?: string | null;
  userCreate?: string;
  userEdit?: string | null;
  createdAt?: string;
  editedAt?: string | null;
  status?: boolean | null;
  zona: string;
  zonaId: number;
}

export interface ApproveClosingDto {
  closingId: number;
  deliveryType: string; // 'admin', 'asesor', 'parcial'
  amountAdmin: number;
  amountAsesor: number;
}

export interface DefaultResponseDto<T> {
  status: string;
  message: string;
  details?: string;
  data: T;
  timestamp?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClosingService {
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


  getById(id: number): Observable<DefaultResponseDto<ClosingResponseDto>> {
    return this.http.get<DefaultResponseDto<ClosingResponseDto>>(
      `${baseUrl}closing/get/${id}`,
      { headers: this.getHeaders() }
    );
  }

  getTodayClosingByPerson(
    personId: number
  ): Observable<DefaultResponseDto<ClosingTodayDto | null>> {

    return this.http.get<DefaultResponseDto<ClosingTodayDto | null>>(
      `${baseUrl}closing/${personId}/today`,
      { headers: this.getHeaders() }
    );
  }

  getTodayClosingByPersonAndZona(
    personId: number,
    zonaId: number
  ): Observable<DefaultResponseDto<ClosingTodayDto | null>> {

    return this.http.get<DefaultResponseDto<ClosingTodayDto | null>>(
      `${baseUrl}closing/${personId}/${zonaId}/today`,
      { headers: this.getHeaders() }
    );
  }


  getClosingsByPerson(personId: number): Observable<DefaultResponseDto<ClosingResponseDto[]>> {
    return this.http.get<DefaultResponseDto<ClosingResponseDto[]>>(
      `${baseUrl}closing/person/${personId}`,
      { headers: this.getHeaders() }
    );
  }


  create(dto: ClosingDto): Observable<DefaultResponseDto<ClosingResponseDto>> {
    return this.http.post<DefaultResponseDto<ClosingResponseDto>>(
      `${baseUrl}closing/save`,
      dto,
      { headers: this.getHeaders() }
    );
  }

  update(id: number, dto: ClosingDto): Observable<DefaultResponseDto<ClosingResponseDto>> {
    return this.http.put<DefaultResponseDto<ClosingResponseDto>>(
      `${baseUrl}closing/edit/${id}`,
      dto,
      { headers: this.getHeaders() }
    );
  }

  approveClosing(dto: ApproveClosingDto): Observable<DefaultResponseDto<ClosingResponseDto>> {
    return this.http.post<DefaultResponseDto<ClosingResponseDto>>(
      `${baseUrl}closing/approve`,
      dto,
      { headers: this.getHeaders() }
    );
  }
}
