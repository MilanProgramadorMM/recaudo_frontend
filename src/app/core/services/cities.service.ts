import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Observable } from "rxjs";
import baseUrl from './api';


export interface CitiesResponseDto {
  id: number;
  nombre: string;
  description?: string; // opcional si quieres
  nombreDepartamento: string;
  idDepartamento: number;
  nombrePais: string;
}

export interface CitiesRequestDto {
  value: string;
  description: string;
  idDepartamento: number;
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
export class CitiesService {

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getAllMunicipios(): Observable<DefaultResponse<CitiesResponseDto[]>> {
    return this.http.get<DefaultResponse<CitiesResponseDto[]>>(
      `${baseUrl}municipios`, { headers: this.getAuthHeaders() });
  }

  createMunicipio(dto: CitiesRequestDto): Observable<DefaultResponse<CitiesResponseDto>> {
    return this.http.post<DefaultResponse<CitiesResponseDto>>(
      `${baseUrl}municipios`,
      dto,
      { headers: this.getAuthHeaders() }
    );
  }

  updateMunicipio(id: number, dto: CitiesRequestDto): Observable<DefaultResponse<CitiesResponseDto>> {
    return this.http.put<DefaultResponse<CitiesResponseDto>>(
      `${baseUrl}municipios/${id}`,
      dto,
      { headers: this.getAuthHeaders() }
    );
  }

  deleteMunicipio(id: number): Observable<DefaultResponse<void>> {
    return this.http.delete<DefaultResponse<void>>(
      `${baseUrl}municipios/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }



}
