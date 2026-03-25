import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import baseUrl from './api';
import { CookieService } from 'ngx-cookie-service';


export interface UserDto {
    id?: number;
    username: number;
    person_id?: number;
    person_fullname?: string;
    rol?: RoleDto;
    userCreate?: string;
    createdAt?: string;
    status: boolean;

}
export interface UserRegisterDto {
    username: string;
    password: string;
    rolId: number;
}

export interface RoleDto {
    id: number;
    rol: string;
    description: string;
}

export interface UserPermissionDto {
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

    getUserPermissions(userId: number): Observable<UserPermissionDto[]> {
        const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http
            .get<DefaultResponseDto<UserPermissionDto[]>>(`${baseUrl}user/permissions/user/${userId}`, { headers })
            .pipe(map(res => res.data));
    }

    updateUserPermission(body: {
        userId: number,
        actionId: number,
        moduleId: number,
        permiso: boolean
    }): Observable<any> {
        const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http.put(`${baseUrl}user/permissions/upsert`, body, {
            headers
        });
    }


    getUserById(userId: number): Observable<DefaultResponseDto<UserDto>> {
        const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http.get<DefaultResponseDto<UserDto>>(`${baseUrl}user/get/${userId}`, { headers });
    }



    assignUserRole(userId: number, roleId: number): Observable<any> {
        const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        const body = { userId, roleId };

        return this.http.put(`${baseUrl}rol/assign-role`, body, { headers });
    }

    updateUserRoles(userId: number, roleIds: number[]) {
        const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        });

        const body = { roleIds }; // coincide con UserRoleUpdateDto.roleIds
        return this.http.put(`${baseUrl}rol/${userId}/assign-role`, body, { headers });
    }

    createUser(user: { username: string; password: string; roles: number[] }) {
        const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        });

        return this.http.post(`${baseUrl}user/register`, user, { headers });
    }

    updateLoggedUserPassword(currentPassword: string, newPassword: string) {
        const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        });

        return this.http.post(`${baseUrl}user/update-password`, {
            currentPassword,
            newPassword
        }, { headers });
    }

    deleteUser(userId: number) {
        const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http.put(`${baseUrl}user/delete/${userId}`, {}, { headers });
    }

    updateUserStatus(userId: number, status: boolean): Observable<any> {
        const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        return this.http.put(`${baseUrl}user/${userId}/status?status=${status}`, {}, { headers });
    }

    resetUserPassword(userId: number): Observable<any> {
        const token = this.cookieService.get('_OSEN_AUTH_SESSION_KEY_');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        });

        return this.http.post(`${baseUrl}user/update-password`, {
            userId: userId,
            currentPassword: '',
            newPassword: ''
        }, { headers });
    }


}
