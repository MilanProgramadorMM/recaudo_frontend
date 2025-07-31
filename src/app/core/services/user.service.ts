import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import baseUrl from './api';
import { CookieService } from 'ngx-cookie-service';


export interface UserDto {
    id?: number;
    username: number;
    person_fullname?: string;
    rol?: RoleDto; // ahora es un objeto
    userCreate?: string;
    createdAt?: string;
}

export interface RoleDto {
    id: number;
    rol: string;
}

export interface PermissionDto {
    id: number;
    modulo: string;
    accion: string;
    permiso: boolean;
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
export class UserService {

    constructor(private http: HttpClient,
        private cookieService: CookieService
    ) { }

    getAllUsers(): Observable<DefaultResponseDto<UserDto[]>> {
        const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });
        return this.http.get<DefaultResponseDto<UserDto[]>>(`${baseUrl}user/get-all`, { headers });
    }

    getPermissionsByRole(roleId: number): Observable<PermissionDto[]> {
        const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http
            .get<DefaultResponseDto<PermissionDto[]>>(`${baseUrl}user/permissions/role/${roleId}`, { headers })
            .pipe(map(res => res.data)); // <- Aquí extraes solo el array de permisos
    }

    updatePermission(id: number, allow: boolean): Observable<any> {
        const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http.put(`${baseUrl}user/permissions/update/${id}`, allow, {
            headers
        });
    }

}
