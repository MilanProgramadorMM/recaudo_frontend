import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import baseUrl from './api';
import { CookieService } from 'ngx-cookie-service';
import { MenuItemType } from '@common/menu-meta';


export interface MenuItemBD {
  key: string;
  label: string;
  icon?: string | null;
  collapsed?: boolean | null;
  url?: string | null;
  parentKey?: string | null;
  children?: MenuItemBD[] | null;
}


@Injectable({
    providedIn: 'root'
})
export class ModuleService {

    constructor(private http: HttpClient,
        private cookieService: CookieService
    ) { }


    getMenu(): Observable<MenuItemType[]> {
        const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });
        return this.http.get<MenuItemType[]>(`${baseUrl}modules/tree`,{headers});
    }


}
