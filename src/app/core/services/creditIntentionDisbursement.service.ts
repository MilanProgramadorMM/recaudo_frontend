import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DefaultResponseDto } from "./user.service";
import { Observable } from "rxjs";
import baseUrl from "./api";


export interface DisbursementResponseDto {
  id: number;
  creditIntentionId: number;
  paymentTypeId: number;
  paymentTypeName?: string;
  bankId?: number;
  bankName?: string;
  accountNumber?: string;
  amount: number;
  fileName?: string;
  contentType?: string;
  fileSize?: number;
  fileData?: string;
  createdAt: string;
}


export interface Desembolso {
  id?: number;
  metodoId: number;
  metodo: string;
  cantidad: string;
  cantidadNumerica: number;
  numeroCuenta: string;
  bancoId: number | null;
  banco: string;
  comprobante: File | null;
  esDeBD?: boolean;
}
export interface DisbursementMetadata {
  id?: number;
  paymentTypeId: number;
  bankId?: number | null;
  accountNumber?: string | null;
  amount: number;
  hasFile: boolean;
}

export interface PaymentResponseDto {
  id: number;
  creditIntentionId: number;
  paymentTypeId: number;
  paymentTypeName?: string;
  bankId?: number;
  bankName?: string;
  accountNumber?: string;
  amount: number;
  fileName?: string;
  contentType?: string;
  fileSize?: number;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class CreditIntentionDisbursementService {

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Guarda múltiples pagos para una intención de crédito
   */
  savePayments(
    creditIntentionId: number,
    creditLineType: string, // "FINANCIAMIENTO" o "LIBRE_INVERSION"
    files: File[],
    metadata: DisbursementMetadata[]
  ): Observable<DefaultResponseDto<PaymentResponseDto[]>> {
    const formData = new FormData();

    formData.append('creditIntentionId', creditIntentionId.toString());
    formData.append('creditLineType', creditLineType);

    // Agregar archivos
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append('files', file, file.name);
      });
    }

    // Agregar metadata
    formData.append('metadata', JSON.stringify(metadata));

    return this.http.post<DefaultResponseDto<PaymentResponseDto[]>>(
      `${baseUrl}credit-intention-disbursement/save`,
      formData,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Obtiene los pagos de una intención de crédito
   */
  getPayments(
    creditIntentionId: number,
    creditLineType: string
  ): Observable<DefaultResponseDto<PaymentResponseDto[]>> {
    return this.http.get<DefaultResponseDto<PaymentResponseDto[]>>(
      `${baseUrl}credit-intention-disbursement/${creditIntentionId}?creditLineType=${creditLineType}`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Elimina un pago (borrado lógico)
   */
  deletePayment(
    id: number,
    creditLineType: string
  ): Observable<DefaultResponseDto<any>> {
    return this.http.delete<DefaultResponseDto<any>>(
      `${baseUrl}credit-intention-disbursement/${id}?creditLineType=${creditLineType}`,
      { headers: this.getHeaders() }
    );
  }
}