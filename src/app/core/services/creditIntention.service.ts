import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import baseUrl from "./api";
import { CookieService } from 'ngx-cookie-service';
import { Observable } from "rxjs";


export interface CreditProjectionDto {
    dcreVlrabonoinversion: number;
    dcreVlrabonointeres: number;
    dcreVlrabonosegurocartera: number;
    dcreVlrabonosegurovida: number;

    dcreCapital: number;
    dcreSaldocapital: number;
    dcreVlrcuota: number;
    dcreTasa: number;
    dcreNumcuota: number;

    dcreFvence: string | null;
    dcreFvenceRaw: string | null;
    dcreVlrBase: number;       
    dcreVlrPapeleia: number;   
    dcreVlrBasePapeleria: number;
}

export interface CreditIntentionDocumentResponseDto {
    id: number;
    documentationTypeId: number;
    documentSide: string;       // "FRONT", "BACK" o "SINGLE"
    fileName: string;
    contentType: string;        // "image/jpeg", "application/pdf", etc.
    fileSize: number;
    fileDataBase64: string;
}

export interface CalculateCreditIntentionDto {
    credit_line_id: number;
    period_id: number;
    period_code: string;
    period_quantity: number;
    start_date: string;

    item_value: number;
    quota_value: number;
    tax_value: number;

    inicio_quincena: number;
    fin_quincena: number;

    tipo_calculo: 'CALCULAR_TASA' | 'CALCULAR_CUOTA' | 'CALCULAR_CAPITAL';
    generar_amortizacion: 'SI' | 'NO';
}

export interface CreditIntentionResponseDto {
    id: number;

    zoneId: number;
    personId: number;

    zoneName: string;
    zoneDescription: string;

    documentType: string;
    document: string;

    firstname: string;
    middlename?: string | null;
    lastname: string;
    maternalLastname?: string | null;
    fullname: string;

    gender: string;
    genero?: string;
    occupation: string;
    description?: string | null;

    email: string;
    phoneNumber: string;
    whatsappNumber: string;

    creditLineId: number;
    creditLineName: string;

    quotaValue: number;

    periodId: number;
    periodName: string;
    periodCode: string;
    periodQuantity: number;

    taxTypeId: number;
    taxTypeName: string;
    taxValue: number;

    itemValue: number;
    initialValuePayment: number;
    totalFinancedValue: number;
    totalInterestValue: number;
    totalCapitalValue: number;
    totalIntentionValue: number;
    stationery: number;

    homeAddress: string;

    countryId: number;
    countryName: string;

    departmentId: number;
    departmentName: string;

    municipalityId: number;
    municipalityName: string;

    neighborhoodId: number;
    neighborhoodName: string;

    createdAt: string;
    editedAt?: string | null;
    clientExists?: number;
    initialQuincena?: number | null;
    endQuincena?: number | null;
    referido?: boolean | number;
    callSuccess?: boolean | number;
    estadoActual?: string;

    approvalLink?: string;
    approvalToken?: string;
    approvalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
    approvedAt?: string;
    approvalIp?: string;
    tokenExpiresAt?: string;
    fechaInicio: string;
}

export interface ClientDataCreditIntentionUpdateDto {
    zone_id: number;
    document_type: number;
    document: string;

    firstname: string;
    middlename?: string | null;
    lastname: string;
    maternal_lastname?: string | null;
    fullname: string;

    gender: number;
    occupation: string;
    description?: string | null;

    email: string;
    phone_number: string;
    whatsapp_number: string;

    home_address: string;
    country_id: number;
    department_id: number;
    municipality_id: number;
    neighborhood_id: number;

    referido?: number;
    call_success?: number;
}

export interface UpdateFechaTentativaCreditIntentionUpdateDto {
    start_date: string;
}

export interface CreditIntentionUpdateDto {
    credit_line_id: number;
    quota_value: number;

    period_id: number;
    period_quantity: number;

    tax_type_id: number;
    tax_value: number;

    item_value: number;
    initial_value_payment: number;
    total_financed_value: number;
    total_intention_value: number;

    inicio_quincena: number;
    fin_quincena: number;

    start_date: string;
    tipo_calculo: 'CALCULAR_TASA' | 'CALCULAR_CUOTA' | 'CALCULAR_CAPITAL';
}

// DTO para la metadata de documentos
export interface DocumentMetadata {
    documentationTypeId: number;
    documentSide: string; // 'FRONT', 'BACK', 'SINGLE'
    fileIndex: number;
}
export interface DocumentFilesMapItem {
    front?: File[];
    back?: File[];
    single?: File[];
    existing?: CreditIntentionDocumentResponseDto;
    hasChanges?: boolean;
}

export interface SendApprovalLinkResponse {
    approvalLink: string;
    message: string;
    expiresAt: string;
}

export interface PublicCreditIntentionResponse {
    id: number;
    fullname: string;
    creditLineName: string;
    quotaValue: number;
    periodQuantity: number;
    periodName: string;
    totalCapitalValue: number;
    approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
    tokenExpired: boolean;
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
export class CreditIntentionService {
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

    calculateCreditIntention(data: CalculateCreditIntentionDto) {
        return this.http.post<
            DefaultResponseDto<CreditProjectionDto[]>
        >(
            `${baseUrl}credit-intention/generate/calculation`,
            data,
            {
                headers: this.getHeaders()
            }
        );
    }

    createCreditIntention(data: any) {
        return this.http.post<DefaultResponseDto<any>>(
            `${baseUrl}credit-intention/create`,
            data,
            { headers: this.getHeaders() }
        );
    }

    getIntentions() {
        return this.http.get<
            DefaultResponseDto<CreditIntentionResponseDto[]>
        >(
            `${baseUrl}credit-intention/get-intention`,
            { headers: this.getHeaders() }
        );
    }

    getIntentionsById(id: number) {
        return this.http.get<
            DefaultResponseDto<CreditIntentionResponseDto[]>
        >(
            `${baseUrl}credit-intention/get-intention/${id}`,
            { headers: this.getHeaders() }
        );
    }

    updateClientData(
        id: number,
        data: ClientDataCreditIntentionUpdateDto
    ) {
        return this.http.put<
            DefaultResponseDto<CreditIntentionResponseDto>
        >(
            `${baseUrl}credit-intention/update-client/${id}`,
            data,
            { headers: this.getHeaders() }
        );
    }

    updateCreditData(
        id: number,
        data: any
    ) {
        return this.http.put<
            DefaultResponseDto<CreditIntentionResponseDto>
        >(
            `${baseUrl}credit-intention/update-credit/${id}`,
            data,
            { headers: this.getHeaders() }
        );
    }

    updateFechaTentativaData(
        id: number,
        payload: UpdateFechaTentativaCreditIntentionUpdateDto
    ) {
        return this.http.put(
            `${baseUrl}credit-intention/update-date/${id}`,
            payload,
            { headers: this.getHeaders() }
        );
    }

    /**
     * Crear intención de crédito con documentos opcionales
     * @param intentionData - Datos de la intención
     * @param files - Archivos opcionales
     * @param metadata - Metadata opcional de los archivos
     */
    createCreditIntentionWithDocuments(
        intentionData: any,
        files?: File[],
        metadata?: DocumentMetadata[]
    ) {
        const formData = new FormData();

        // 1. Agregar datos de la intención como JSON
        formData.append('intention', JSON.stringify(intentionData));

        // 2. Agregar archivos si existen
        if (files && files.length > 0) {
            files.forEach((file) => {
                formData.append('documents', file, file.name);
            });

            // 3. Agregar metadata si existen archivos
            if (metadata && metadata.length > 0) {
                formData.append('metadata', JSON.stringify(metadata));
            }
        }

        return this.http.post<DefaultResponseDto<any>>(
            `${baseUrl}credit-intention/create-with-documents`,
            formData,
            { headers: this.getHeaders() }
        );
    }

    uploadDocuments(
        creditIntentionId: number,
        files: File[],
        metadata: DocumentMetadata[]
    ) {
        const formData = new FormData();

        formData.append('creditIntentionId', creditIntentionId.toString());

        if (files && files.length > 0) {
            files.forEach((file) => {
                formData.append('documents', file, file.name);
            });

            // 3. Agregar metadata si existen archivos
            if (metadata && metadata.length > 0) {
                formData.append('metadata', JSON.stringify(metadata));
            }
        }
        return this.http.post<DefaultResponseDto<any>>(
            `${baseUrl}credit-intention/upload-documents`,
            formData,
            { headers: this.getHeaders() }
        );
    }

    getDocumentsByIntention(intentionId: number): Observable<CreditIntentionDocumentResponseDto[]> {
        return this.http.get<CreditIntentionDocumentResponseDto[]>(`${baseUrl}credit-intention/${intentionId}/documents`);
    }

    // En credit-intention.service.ts

    getCedulaByIntention(intentionId: number): Observable<any> {
        return this.http.get<any>(`${baseUrl}credit-intention/${intentionId}/cedula`);
    }

    sendApprovalLink(intentionId: number, whatsappNumber: string): Observable<SendApprovalLinkResponse> {
        return this.http.post<SendApprovalLinkResponse>(
            `${baseUrl}credit-intention/${intentionId}/send-approval-link`,
            { intentionId, whatsappNumber }
        );
    }

    resendApprovalLink(intentionId: number): Observable<SendApprovalLinkResponse> {
        return this.http.post<SendApprovalLinkResponse>(
            `${baseUrl}credit-intention/${intentionId}/resend-approval-link`,
            {}
        );
    }

}