import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import baseUrl from './api';
import { CookieService } from 'ngx-cookie-service';





@Injectable({
  providedIn: 'root'
})
export class ContactInfoService {



  constructor(private http: HttpClient,
    private cookieService: CookieService
  ) { }


  private getAuthHeaders(): HttpHeaders {
    const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getContactInfoByPersonId(personId: number): Observable<any> {
    return this.http.get<any>(`${baseUrl}contact/info/${personId}`, {
      headers: this.getAuthHeaders()
    });
  }

  saveContactInfo(data: any): Observable<any> {
    return this.http.post<any>(`${baseUrl}contact/info`, data, {
      headers: this.getAuthHeaders()
    });
  }

  updateContactInfo(contactInfoId: number, data: any): Observable<any> {
    return this.http.put<any>(`${baseUrl}contact/info/${contactInfoId}`, data, {
      headers: this.getAuthHeaders()
    });
  }

  deleteContactInfo(contactInfoId: number): Observable<any> {
    return this.http.delete<any>(`${baseUrl}contact/info/${contactInfoId}`, {
      headers: this.getAuthHeaders()
    });
  }




}
