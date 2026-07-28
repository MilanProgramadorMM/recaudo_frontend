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

/**
 * El backend serializa LocalDate con el módulo por defecto de Jackson,
 * que lo escribe como array [year, month, day] (no como string ISO).
 * Este tipo cubre ambos casos por seguridad.
 * Ver helper `normalizeBackendDate` en core/utils/date-utils.ts.
 */
export type BackendDate = [number, number, number] | string;

export interface ConceptoMontoDto {
  generado: number;
  pagado: number;
  pendiente: number;
}

export interface ConteosCreditoDto {
  total: number;
  activos: number;
  cancelados: number;
  inactivos: number;
  enMora: number;
  alDia: number;
}

export interface CuotasResumenDto {
  planeadas: number;
  totales: number;
  pagadas: number;
  pendientes: number;
}

export interface CalificacionBucketDto {
  ratingValue: string;
  cantidad: number;
}

/** Respuesta de los endpoints 1 y 2 (estado de zona/s en una fecha puntual) */
export interface ZoneSnapshotStateDto {
  fecha: BackendDate;
  zonaId: number;
  zonaNombre: string;
  conteos: ConteosCreditoDto;
  capital: ConceptoMontoDto;
  interes: ConceptoMontoDto;
  seguroVida: ConceptoMontoDto;
  seguroCartera: ConceptoMontoDto;
  mora: ConceptoMontoDto;
  otrosConceptosGenerado: number;
  totalPagado: number;
  saldoTotal: number;
  cuotas: CuotasResumenDto;
  diasMoraPromedio: number;
  distribucionCalificacion: CalificacionBucketDto[];
}

/** Un punto (un día) de la serie temporal del endpoint 3 */
export interface PuntoHistoricoDto {
  fecha: BackendDate;
  totalCreditos: number;
  creditosActivos: number;
  creditosEnMora: number;
  creditosCancelados: number;
  saldoTotal: number;
  capitalPendiente: number;
  interesPendiente: number;
  moraPendiente: number;
  capitalPagado: number;
  totalPagado: number;
  cuotasPagadas: number;
  cuotasPendientes: number;
  diasMoraPromedio: number;
}

/** Comparación de un día contra el día anterior, dentro del endpoint 3 */
export interface TransicionDiariaDto {
  fecha: BackendDate;
  ingresaronMora: number;
  salieronMora: number;
  cambiaronEstado: number;
  cancelados: number;
  cambiosCalificacion: number;
  nuevosCreditos: number;
  creditosQueSalieron: number;
}

/** Comparación agregada entre el primer y el último día del rango consultado */
export interface ResumenEvolucionDto {
  fechaInicial: BackendDate;
  fechaFinal: BackendDate;
  saldoInicial: number;
  saldoFinal: number;
  variacionSaldo: number;
  pctVariacionSaldo: number | null;
  capitalPendienteInicial: number;
  capitalPendienteFinal: number;
  variacionCapitalPendiente: number;
  moraPendienteInicial: number;
  moraPendienteFinal: number;
  variacionMoraPendiente: number;
  pctVariacionMoraPendiente: number | null;
  totalRecuperado: number;
  capitalRecuperado: number;
  creditosEnMoraInicial: number;
  creditosEnMoraFinal: number;
  variacionCreditosEnMora: number;
  totalIngresaronMora: number;
  totalSalieronMora: number;
  totalCambiaronEstado: number;
  totalCancelados: number;
  totalCambiosCalificacion: number;
  totalNuevosCreditos: number;
  totalCreditosQueSalieron: number;
}

/** Respuesta completa del endpoint 3 (evolución histórica) */
export interface ZoneHistoryAnalysisDto {
  zonaId: number;
  zonaNombre: string;
  startDate: BackendDate;
  endDate: BackendDate;
  diasConSnapshot: number;
  resumenEvolucion: ResumenEvolucionDto;
  serie: PuntoHistoricoDto[];
  transiciones: TransicionDiariaDto[];
}

/* ────────────────────────────────────────────────────────────────────────────
 * CLIENTES — endpoints 4, 5 y 6
 * Mismo shape que los de zona, pero agrupados por person_id.
 * ──────────────────────────────────────────────────────────────────────────── */

/** Fila del listado/buscador de clientes con cartera en una fecha */
export interface ClientListItemDto {
  personId: number;
  clienteFullname: string;
  clienteDocumento: string;
  totalCreditos: number;
  saldoTotal: number;
  diasMoraMaximo: number | null;
}

/** Estado agregado de TODOS los créditos de un cliente en una fecha puntual */
export interface ClientPortfolioStateDto {
  fecha: BackendDate;
  personId: number;
  clienteFullname: string;
  clienteDocumento: string;
  zonas: string[];
  conteos: ConteosCreditoDto;
  capital: ConceptoMontoDto;
  interes: ConceptoMontoDto;
  seguroVida: ConceptoMontoDto;
  seguroCartera: ConceptoMontoDto;
  mora: ConceptoMontoDto;
  otrosConceptosGenerado: number;
  totalPagado: number;
  saldoTotal: number;
  cuotas: CuotasResumenDto;
  diasMoraMaximo: number | null;
  diasMoraPromedio: number;
}

/** Un punto (un día) de la serie histórica de un cliente */
export interface PuntoHistoricoClienteDto {
  fecha: BackendDate;
  totalCreditos: number;
  creditosActivos: number;
  creditosEnMora: number;
  creditosCancelados: number;
  saldoTotal: number;
  capitalPendiente: number;
  interesPendiente: number;
  moraPendiente: number;
  capitalPagado: number;
  totalPagado: number;
  cuotasPagadas: number;
  cuotasPendientes: number;
  diasMoraMaximo: number | null;
  diasMoraPromedio: number;
}

/**
 * Comparación entre el primer y el último día del rango, para un cliente.
 * Versión simplificada de ResumenEvolucionDto: sin transiciones a nivel de
 * crédito individual.
 */
export interface ResumenEvolucionClienteDto {
  fechaInicial: BackendDate;
  fechaFinal: BackendDate;
  saldoInicial: number;
  saldoFinal: number;
  variacionSaldo: number;
  pctVariacionSaldo: number | null;
  capitalPendienteInicial: number;
  capitalPendienteFinal: number;
  variacionCapitalPendiente: number;
  moraPendienteInicial: number;
  moraPendienteFinal: number;
  variacionMoraPendiente: number;
  totalRecuperado: number;
  capitalRecuperado: number;
  creditosEnMoraInicial: number;
  creditosEnMoraFinal: number;
  variacionCreditosEnMora: number;
}

/** Respuesta completa del historial de un cliente */
export interface ClientHistoryAnalysisDto {
  personId: number;
  clienteFullname: string;
  startDate: BackendDate;
  endDate: BackendDate;
  diasConSnapshot: number;
  resumenEvolucion: ResumenEvolucionClienteDto;
  serie: PuntoHistoricoClienteDto[];
}

@Injectable({
  providedIn: "root",
})
export class PortfolioSnapshotService {
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

  /**
   * Endpoint 1: estado de la cartera de UNA zona en una fecha específica.
   * GET /portfolio-snapshots/zone/{zoneId}?date=yyyy-MM-dd
   */
  getZoneState(
    zoneId: number,
    date: string
  ): Observable<DefaultResponseDto<ZoneSnapshotStateDto>> {
    const params = new HttpParams().set("date", date);

    return this.http.get<DefaultResponseDto<ZoneSnapshotStateDto>>(
      `${baseUrl}portfolio-snapshots/zone/${zoneId}`,
      { headers: this.getHeaders(), params }
    );
  }

  /**
   * Endpoint 2: estado de la cartera de VARIAS zonas en una fecha específica.
   * GET /portfolio-snapshots/zones?zoneIds=1,2,3&date=yyyy-MM-dd
   */
  getZonesState(
    zoneIds: number[],
    date: string
  ): Observable<DefaultResponseDto<ZoneSnapshotStateDto[]>> {
    const params = new HttpParams()
      .set("zoneIds", zoneIds.join(","))
      .set("date", date);

    return this.http.get<DefaultResponseDto<ZoneSnapshotStateDto[]>>(
      `${baseUrl}portfolio-snapshots/zones`,
      { headers: this.getHeaders(), params }
    );
  }

  /**
   * Endpoint 3: evolución histórica de una zona en un rango de fechas.
   * GET /portfolio-snapshots/zone/{zoneId}/history?startDate=...&endDate=...
   */
  getZoneHistory(
    zoneId: number,
    startDate: string,
    endDate: string
  ): Observable<DefaultResponseDto<ZoneHistoryAnalysisDto>> {
    const params = new HttpParams()
      .set("startDate", startDate)
      .set("endDate", endDate);

    return this.http.get<DefaultResponseDto<ZoneHistoryAnalysisDto>>(
      `${baseUrl}portfolio-snapshots/zone/${zoneId}/history`,
      { headers: this.getHeaders(), params }
    );
  }
  /**
   * Endpoint 4: lista/buscador de clientes con cartera en una fecha.
   * GET /portfolio-snapshots/clients?date=yyyy-MM-dd&search=juan
   *
   * `search` es opcional: si se omite, el backend no aplica filtro de texto.
   */
  getClients(
    date: string,
    search?: string
  ): Observable<DefaultResponseDto<ClientListItemDto[]>> {
    let params = new HttpParams().set("date", date);

    if (search && search.trim().length > 0) {
      params = params.set("search", search.trim());
    }

    return this.http.get<DefaultResponseDto<ClientListItemDto[]>>(
      `${baseUrl}portfolio-snapshots/clients`,
      { headers: this.getHeaders(), params }
    );
  }

  /**
   * Endpoint 5: estado de la cartera de un cliente en una fecha específica.
   * GET /portfolio-snapshots/client/{personId}?date=yyyy-MM-dd
   */
  getClientState(
    personId: number,
    date: string
  ): Observable<DefaultResponseDto<ClientPortfolioStateDto>> {
    const params = new HttpParams().set("date", date);

    return this.http.get<DefaultResponseDto<ClientPortfolioStateDto>>(
      `${baseUrl}portfolio-snapshots/client/${personId}`,
      { headers: this.getHeaders(), params }
    );
  }

  /**
   * Endpoint 6: evolución histórica de un cliente en un rango de fechas.
   * GET /portfolio-snapshots/client/{personId}/history?startDate=...&endDate=...
   */
  getClientHistory(
    personId: number,
    startDate: string,
    endDate: string
  ): Observable<DefaultResponseDto<ClientHistoryAnalysisDto>> {
    const params = new HttpParams()
      .set("startDate", startDate)
      .set("endDate", endDate);

    return this.http.get<DefaultResponseDto<ClientHistoryAnalysisDto>>(
      `${baseUrl}portfolio-snapshots/client/${personId}/history`,
      { headers: this.getHeaders(), params }
    );
  }
}
