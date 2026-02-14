// src/app/core/services/period.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import baseUrl from './api';
import { CookieService } from 'ngx-cookie-service';

export interface PeriodDto {
  id: number;
  cod: string;
  name: string;
  description: string;
  factorConversion: number;
  status: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PeriodService {
  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  getAllPeriods(): Observable<PeriodDto[]> {
    const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<PeriodDto[]>(`${baseUrl}periods`, { headers });
  }
}
