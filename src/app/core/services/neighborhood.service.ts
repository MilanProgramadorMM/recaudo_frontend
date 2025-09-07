import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Observable } from "rxjs";
import baseUrl from './api';


export interface BarrioResponseDto {
  id: number;
  nombre: string;
  description?: string; // opcional si quieres
  nombreMunicipio: string;
  idMunicipio: number;
  nombreDepartamento: string;
  nombrePais: string;
}

export interface BarrioRequestDto {
  value: string;
  description: string;
  idMunicipio: number;
}

export interface DefaultResponse<T> {
  data: T;
  message: string;
  details: string;
  status: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class BarrioService {

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getAllBarrios(): Observable<DefaultResponse<BarrioResponseDto[]>> {
    return this.http.get<DefaultResponse<BarrioResponseDto[]>>(`${baseUrl}barrios`, { headers: this.getAuthHeaders() });
  }
  createBarrio(dto: BarrioRequestDto): Observable<DefaultResponse<BarrioResponseDto>> {
    return this.http.post<DefaultResponse<BarrioResponseDto>>(
      `${baseUrl}barrios`,
      dto,
      { headers: this.getAuthHeaders() }
    );
  }

  updateBarrio(id: number, dto: BarrioRequestDto): Observable<DefaultResponse<BarrioResponseDto>> {
    return this.http.put<DefaultResponse<BarrioResponseDto>>(
      `${baseUrl}barrios/${id}`,
      dto,
      { headers: this.getAuthHeaders() }
    );
  }

  deleteBarrio(id: number): Observable<DefaultResponse<void>> {
    return this.http.delete<DefaultResponse<void>>(
      `${baseUrl}barrios/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }


}
