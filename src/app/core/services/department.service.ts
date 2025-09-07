import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Observable } from "rxjs";
import baseUrl from './api';


export interface DepartamentoResponseDto {
  id: number;
  nombre: string;
  description?: string; 
  nombrePais: string;
  idPais: number;
}

export interface DepartamentoRequestDto {
  value: string;
  description: string;
  idPais: number;
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
export class DeparmentService {

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // Listar todos los departamentos
  getAllDepartments(): Observable<DefaultResponse<DepartamentoResponseDto[]>> {
    return this.http.get<DefaultResponse<DepartamentoResponseDto[]>>(
      `${baseUrl}departamento`,
      { headers: this.getAuthHeaders() }
    );
  }

  createDepartamento(dto: DepartamentoRequestDto): Observable<DefaultResponse<DepartamentoResponseDto>> {
    return this.http.post<DefaultResponse<DepartamentoResponseDto>>(
      `${baseUrl}departamento`,
      dto,
      { headers: this.getAuthHeaders() }
    );
  }

  updateDepartamento(id: number, dto: DepartamentoRequestDto): Observable<DefaultResponse<DepartamentoResponseDto>> {
    return this.http.put<DefaultResponse<DepartamentoResponseDto>>(
      `${baseUrl}departamento/${id}`,
      dto,
      { headers: this.getAuthHeaders() }
    );
  }

  deleteDepartamento(id: number): Observable<DefaultResponse<void>> {
    return this.http.delete<DefaultResponse<void>>(
      `${baseUrl}departamento/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }


}
