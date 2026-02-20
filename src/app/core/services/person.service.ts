import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import baseUrl from './api';
import { CookieService } from 'ngx-cookie-service';


export interface PersonRegisterDto {
    id?: number;
    document_type: number;
    document: string;
    first_name: string;
    middlename: string;
    last_name: string;
    maternal_lastname: string;
    full_name: string;
    gender: number;
    occupation?: string;
    description?: string;
    type_person: string;

    // campos para CLIENTE
    //orden?: number;
    zona?: number;

    // campos para ASESOR (múltiples zonas)
    zonas?: number[];
    countryId?: number;
    departentId?: number;
    cityId?: number;
    neighborhoodId?: number;
    adress?: string;
    details?: string;
    correo?: string;
    celular?: string;
    telefono?: string;
}


export interface PersonResponseDto {
    id: number;
    documentType: number;
    document: string;
    firstName: string;
    middleName: string;
    lastName: string;
    maternalLastname: string;
    fullName: string;
    gender: number;
    occupation?: string;
    description?: string;
    createdAt: string;
    typePerson: string;
    status: boolean;
    username: string;

    orden?: number;
    zonaId?: number | null;
    zid?: string;
    zona?: String;
    zonas?: Array<{ id: number; zonaId: number; zonaName: string }>;

    countryId?: string | null;
    departentId?: string | null;
    cityId?: string | null;
    neighborhoodId?: string | null;
    descriptionD?: string;
    adress?: string | null;
    details?: string | null;
    correo?: string | null;
    celular?: string | null;
    telefono?: string | null;
    // ===== CRÉDITO =====
    creditId?: number;
    creditAmount?: number;
    creditBalance?: number;
    creditStatus?: string;

    // cierre del día
    hasClosingToday?: boolean;
    closingStatus?: string;
}


export interface DefaultResponseDto<T> {
    status: string;
    message: string;
    details: string;
    data: T;
}

@Injectable({
    providedIn: 'root'
})
export class PersonService {

    constructor(private http: HttpClient,
        private cookieService: CookieService
    ) { }

    getAllPersons(): Observable<DefaultResponseDto<PersonResponseDto[]>> {
        const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });
        return this.http.get<DefaultResponseDto<PersonResponseDto[]>>(`${baseUrl}person/get-all`, { headers });
    }

    getPersonsByType(type: string): Observable<DefaultResponseDto<PersonResponseDto[]>> {
        const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        return this.http.get<DefaultResponseDto<PersonResponseDto[]>>(
            `${baseUrl}person/get-by-type/${type}`,
            { headers }
        );
    }

    getPersonByDocument(document: string): Observable<DefaultResponseDto<PersonResponseDto>> {
        const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

        return this.http.get<DefaultResponseDto<PersonResponseDto>>(
            `${baseUrl}person/get-by-document/${document}`,
            { headers }
        );
    }


    getPersonsByZona(type: string, zona: string): Observable<DefaultResponseDto<PersonResponseDto[]>> {
        const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        return this.http.get<DefaultResponseDto<PersonResponseDto[]>>(
            `${baseUrl}person/get-zona/${type}/${zona}`,
            { headers }
        );
    }

    getPersonsByZonaForRecaudo(type: string, zona: string): Observable<DefaultResponseDto<PersonResponseDto[]>> {
        const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        return this.http.get<DefaultResponseDto<PersonResponseDto[]>>(
            `${baseUrl}person/get-by-zona/${type}/${zona}`,
            { headers }
        );
    }

    // getZonaByAcesor(idAsesor: number): Observable<DefaultResponseDto<PersonResponseDto[]>> {
    //     const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
    //     const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    //     return this.http.get<DefaultResponseDto<PersonResponseDto[]>>(
    //         `${baseUrl}person/asesor/${idAsesor}/zona`,
    //         { headers }
    //     );
    // }

    getZonasByAsesor(asesorId: number): Observable<any> {
        const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        return this.http.get(`${baseUrl}person/asesor/${asesorId}/zona`, {
            headers
        });
    }

    getPersonById(personId: number): Observable<DefaultResponseDto<PersonResponseDto>> {
        const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http.get<DefaultResponseDto<PersonResponseDto>>(`${baseUrl}person/get/${personId}`, { headers });
    }

    registerPerson(data: PersonRegisterDto): Observable<DefaultResponseDto<PersonResponseDto>> {
        const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });
        return this.http.post<DefaultResponseDto<PersonResponseDto>>(`${baseUrl}person/register`, data, { headers });
    }

    updatePerson(data: PersonRegisterDto): Observable<DefaultResponseDto<PersonResponseDto>> {
        const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });
        return this.http.put<DefaultResponseDto<PersonResponseDto>>(`${baseUrl}person/update`, data, { headers }).pipe(
            catchError((error) => {
                debugger
                const backendError = error?.error?.data || error?.error || { message: 'Error desconocido' };

                return throwError(() => backendError);
            })
        );
    }

    deletePerson(id: number): Observable<DefaultResponseDto<string>> {
        const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });
        return this.http.put<DefaultResponseDto<string>>(
            `${baseUrl}person/delete/${id}`,
            null,
            { headers }
        );
    }

    reactivatePerson(id: number): Observable<DefaultResponseDto<PersonResponseDto>> {
        const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });
        return this.http.put<DefaultResponseDto<PersonResponseDto>>(
            `${baseUrl}person/person/reactivate/${id}`,
            null,
            { headers }
        );
    }

    toggleStatus(id: number, status: boolean): Observable<any> {
        return this.http.put<any>(`${baseUrl}person/status/${id}?status=${status}`, {});
    }

}
