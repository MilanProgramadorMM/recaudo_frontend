import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import baseUrl from './api';
import { CookieService } from 'ngx-cookie-service';


export interface Glotypes {
    id: number;
    type: number;
    key: string;
    name: string;
    code: string;
}


@Injectable({
    providedIn: 'root'
})
export class GlotypesService {



    constructor(private http: HttpClient,
        private cookieService: CookieService
    ) { }



    getGlotypesByKey(key: string): Observable<Glotypes[]> {
        const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http.get<Glotypes[]>(`${baseUrl}glotypes/${key}`, { headers });
    }

}
