// src/app/core/services/period.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import baseUrl from './api';
import { CookieService } from 'ngx-cookie-service';

export interface AmortizationDto {
  name: string;
  procedure: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class AmortizationService {
  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

  getAllAmortization(): Observable<AmortizationDto[]> {
    const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<AmortizationDto[]>(`${baseUrl}amortization`, { headers });
  }
}
