import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import baseUrl from './api';
import { CookieService } from 'ngx-cookie-service';


export interface RoleDto {
    id: number;
    rol: string;
}

export interface RolePermissionDto {
    id: number;
    moduleId: number;
    modulo: string;
    actionId: number;
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
export class RoleService {

    constructor(private http: HttpClient,
        private cookieService: CookieService
    ) { }


    getAllRoles(): Observable<DefaultResponseDto<RoleDto[]>> {
        const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });
        return this.http.get<DefaultResponseDto<RoleDto[]>>(`${baseUrl}rol/get-all`, { headers });
    }

    getRolePermissions(roleId: number): Observable<RolePermissionDto[]> {
        const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http
            .get<DefaultResponseDto<RolePermissionDto[]>>(`${baseUrl}role/permissions/role/${roleId}`, { headers })
            .pipe(map(res => res.data)); // <- Aquí extraes solo el array de permisos
    }
    
    updateRolePermission(dto: {
        rolId: number;
        moduleId: number;
        actionId: number;
        permiso: boolean;
    }): Observable<any> {
        const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http.put(`${baseUrl}role/permissions/update`, dto, { headers });
    }


}
