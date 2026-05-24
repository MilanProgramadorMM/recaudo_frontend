import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Observable } from "rxjs";
import baseUrl from "./api";

export interface DefaultResponseDto<T> {
  status: string;
  message: string;
  details: string;
  data: T;
}

export interface DashboardSummaryDto {
  totalDebidoCobrar: number;
  totalRecaudado: number;
  totalNoPagado: number;
  totalCartera: number;
}

@Injectable({
  providedIn: "root",
})
export class DashBoardMetrictsService {
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

  getData(
    fechaInicio: string,
    fechaFin: string,
    zonaId: number
  ): Observable<DefaultResponseDto<DashboardSummaryDto>> {  
    const params = new HttpParams()
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin)
      .set('zonaId', zonaId);

    return this.http.get<DefaultResponseDto<DashboardSummaryDto>>(
      `${baseUrl}dashboard/summary`,
      { headers: this.getHeaders(), params }
    );
  }

}
