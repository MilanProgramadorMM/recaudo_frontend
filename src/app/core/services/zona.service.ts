import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Observable } from "rxjs";
import baseUrl from "./api";

export interface DailyReportSummary {
  zonaId: number;
  zonaName: string;
  clientesEnLista: number;
  clientesVisitados: number;
  clientesPagaron: number;
  clientesNoPagaron: number;
  clientesPromesa: number;
  clientesPendientes: number;
  totalRecaudado: number;
}

export interface DailyReportDetail {
  clientName: string;
  clientOrden: number;
  quotaNumber: number;
  quotaValue: number;
  expirationDate: string;
  estado: 'PAGADO' | 'NO_PAGO' | 'PROMESA' | 'SIN_VISITA';
  motivoNoPago?: string;
  observacion?: string;
  fechaPromesa?: string;
  montoRecaudado: number;
}

// DTO de respuesta de Zona
export interface ZonaResponseDto {
  id?: number;
  value: string;
  description?: string;
  status: boolean;
}

// DTO para crear/editar Zona
export interface ZonaCreateDto {
  value: string;
  description?: string;
}

// DTO genérico de respuesta
export interface DefaultResponseDto<T> {
  status: string;
  message: string;
  details: string;
  data: T;
}

@Injectable({
  providedIn: "root",
})
export class ZonaService {
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

  getAll(): Observable<DefaultResponseDto<ZonaResponseDto[]>> {
    return this.http.get<DefaultResponseDto<ZonaResponseDto[]>>(
      `${baseUrl}zona`,
      { headers: this.getHeaders() }
    );
  }

  getByStatus(): Observable<DefaultResponseDto<ZonaResponseDto[]>> {
    return this.http.get<DefaultResponseDto<ZonaResponseDto[]>>(
      `${baseUrl}zona/status`,
      { headers: this.getHeaders() }
    );
  }

  create(data: ZonaCreateDto): Observable<DefaultResponseDto<ZonaResponseDto>> {
    return this.http.post<DefaultResponseDto<ZonaResponseDto>>(
      `${baseUrl}zona`,
      data,
      { headers: this.getHeaders() }
    );
  }

  update(
    id: number,
    data: ZonaCreateDto
  ): Observable<DefaultResponseDto<ZonaResponseDto>> {
    return this.http.put<DefaultResponseDto<ZonaResponseDto>>(
      `${baseUrl}zona/${id}`,
      data,
      { headers: this.getHeaders() }
    );
  }

  delete(id: number): Observable<DefaultResponseDto<void>> {
    return this.http.delete<DefaultResponseDto<void>>(
      `${baseUrl}zona/${id}`,
      { headers: this.getHeaders() }
    );
  }


  getDailySummary(zonaName: string, fecha: string): Observable<DailyReportSummary> {
    return this.http.get<DailyReportSummary>(
      `${baseUrl}zona/daily-summary`,
      {
        params: { zonaName, fecha },
        headers: this.getHeaders()
      }
    );
  }

  /**
   * Obtiene el detalle diario de recaudos
   */
  getDailyDetail(fecha: string): Observable<DailyReportDetail[]> {
    return this.http.get<DailyReportDetail[]>(
      `${baseUrl}zona/daily-detail`,
      {
        params: { fecha },
        headers: this.getHeaders()
      }
    );
  }
}
