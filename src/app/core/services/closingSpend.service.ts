import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import baseUrl from './api';
import { DefaultResponseDto } from './user.service';

export interface ClosingSpendEntity {
  id?: number;
  closingId: number;
  spendTypeId: number;
  amount: number;
  description?: string;
  fileName?: string;
  contentType?: string;
  fileSize?: number;
  fileData?: any;
  userCreate?: string;
  createdAt?: string;
  userEdit?: string;
  editedAt?: string;
  status?: boolean;
  zonaId: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClosingSpendService {
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

  registerSpend(
    closingId: number,
    spendTypeId: number,
    zonaId: number,
    amount: number,
    file: File | null,
    description: string | null,
    isBase: boolean
  ): Observable<DefaultResponseDto<ClosingSpendEntity>> {
    const formData = new FormData();
    formData.append('closingId', closingId.toString());
    formData.append('spendTypeId', spendTypeId.toString());
    formData.append('zonaId', zonaId.toString());
    formData.append('amount', amount.toString());
    formData.append('isBase', isBase.toString());

    if (description) {
      formData.append('description', description);
    }

    if (file) {
      formData.append('file', file);
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.cookieService.get('_OSEN_AUTH_SESSION_KEY_')}`
    });

    return this.http.post<DefaultResponseDto<ClosingSpendEntity>>(
      `${baseUrl}closing-spend/spend`,
      formData,
      { headers }
    );
  }

  updateSpend(
    spendId: number,
    spendTypeId: number,
    amount: number,
    file: File | null,
    description: string
  ): Observable<any> {
    const formData = new FormData();
    formData.append('spendTypeId', spendTypeId.toString());
    formData.append('amount', amount.toString());

    if (file) {
      formData.append('file', file);
    }

    if (description) {
      formData.append('description', description);
    }

    return this.http.put(`${baseUrl}closing-spend/${spendId}`, formData);
  }

  /**
   * Obtener todos los gastos de un cierre
   * GET /closing-spend/closing/{closingId}
   */
  getSpendsByClosingId(closingId: number): Observable<DefaultResponseDto<ClosingSpendEntity[]>> {
    return this.http.get<DefaultResponseDto<ClosingSpendEntity[]>>(
      `${baseUrl}closing-spend/closing/${closingId}`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Desactivar (eliminar lógicamente) un gasto
   * DELETE /closing-spend/{spendId}
   */
  deactivateSpend(spendId: number): Observable<DefaultResponseDto<void>> {
    return this.http.delete<DefaultResponseDto<void>>(
      `${baseUrl}closing-spend/${spendId}`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Descargar evidencia de un gasto
   * GET /closing-spend/{spendId}/evidence
   */
  downloadEvidence(spendId: number): Observable<Blob> {
    return this.http.get(
      `${baseUrl}closing-spend/${spendId}/evidence`,
      {
        headers: this.getHeaders(),
        responseType: 'blob'
      }
    );
  }

  /**
   * Obtener el total de gastos por cierre
   * GET /closing-spend/closing/{closingId}/total
   */
  getTotalByClosing(closingId: number): Observable<DefaultResponseDto<{ total: number }>> {
    return this.http.get<DefaultResponseDto<{ total: number }>>(
      `${baseUrl}closing-spend/closing/${closingId}/total`,
      { headers: this.getHeaders() }
    );
  }
  

}
