import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Observable } from "rxjs";
import baseUrl from "./api";

export interface UpdateOrdenPerson {
  personId: number;
  zonaId: number;
  orden: number;
}

export interface UpdateOrdenList {
  clientes: UpdateOrdenPerson[];
}

export interface AsesorZonaDto {
  id: number;
  zonaId: number;
  zonaName: string;
}

export interface DefaultResponseDto<T> {
  status: string;
  message: string;
  details: string;
  data: T;
}

@Injectable({
  providedIn: "root",
})
export class PersonZonaService {
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
   * Actualizar el orden de los clientes en una zona
   * @param data Lista de clientes con su nuevo orden
   */
  updateOrdenClientes(data: UpdateOrdenList): Observable<DefaultResponseDto<void>> {
    return this.http.post<DefaultResponseDto<void>>(
      `${baseUrl}person-zona/update-orden`,
      data,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Asignar múltiples zonas a un asesor
   * @param personId ID del asesor
   * @param zonasIds Array de IDs de zonas a asignar
   */
  assignZonasToAsesor(personId: number, zonasIds: number[]): Observable<DefaultResponseDto<void>> {
    return this.http.post<DefaultResponseDto<void>>(
      `${baseUrl}person-zona/asesor/${personId}/assign-zonas`,
      zonasIds,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Obtener las zonas asignadas a un asesor
   * @param personId ID del asesor
   */
  getZonasByAsesor(personId: number): Observable<DefaultResponseDto<AsesorZonaDto[]>> {
    return this.http.get<DefaultResponseDto<AsesorZonaDto[]>>(
      `${baseUrl}person-zona/asesor/${personId}/zonas`,
      { headers: this.getHeaders() }
    );
  }
}