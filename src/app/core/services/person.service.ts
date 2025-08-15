import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
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

    getAllPersons(): Observable<DefaultResponseDto<PersonRegisterDto[]>> {
        const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });
        return this.http.get<DefaultResponseDto<PersonRegisterDto[]>>(`${baseUrl}person/get-all`, { headers });
    }

    getPersonById(personId: number): Observable<DefaultResponseDto<PersonRegisterDto>> {
        const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http.get<DefaultResponseDto<PersonRegisterDto>>(`${baseUrl}person/get/${personId}`, { headers });
    }

    registerPerson(data: PersonRegisterDto): Observable<DefaultResponseDto<PersonRegisterDto>> {
        const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });
        return this.http.post<DefaultResponseDto<PersonRegisterDto>>(`${baseUrl}person/register`, data, { headers });
    }

    updatePerson(data: PersonRegisterDto): Observable<DefaultResponseDto<PersonRegisterDto>> {
        const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });
        return this.http.put<DefaultResponseDto<PersonRegisterDto>>(`${baseUrl}person/update`, data, { headers });
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


}
