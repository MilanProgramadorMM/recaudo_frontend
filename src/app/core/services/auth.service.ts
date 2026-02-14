import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators'

import { CookieService } from 'ngx-cookie-service'
import type { Observable } from 'rxjs'
import type { User } from '@core/helper/fake-backend'
import baseUrl from './api';
import { jwtDecode } from 'jwt-decode';


interface JwtPayload {
  sub: string;
  userId: number;  // Agregado
  name: string;
  role: string;
  exp: number;
  iat: number;     // Agregado
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  user: User | null = null

  public readonly authSessionKey = '_OSEN_AUTH_SESSION_KEY_'

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }



  login(username: string, password: string): Observable<User> {
    //debugger;
    return this.http.post<any>(`${baseUrl}auth/login`, { username, password }).pipe(
      map((response) => {
        const token = response.data.token;
        const user: User = {
          username: response.data.user,
          token: token,
          role: response.data.role
        };
        this.user = user;
        this.saveSession(token);
        return user;
      })
    );
  }


  logout(): void {
    //debugger;
    this.removeSession()
    this.user = null
  }

  get session(): string {
    return this.cookieService.get(this.authSessionKey);
  }

  get loggedUser(): User {
    if (this.user == null) {
      const token = this.cookieService.get(this.authSessionKey);
      const claims: JwtPayload = jwtDecode(token);
      const user: User = {
        username: claims.sub,
        token: token,
        role: claims.role
      };
      this.user = user;
    }
    return this.user;
  }

  saveSession(token: string): void {
    this.cookieService.set(this.authSessionKey, token, (2 / 24), '/', '', false, 'Lax');
  }

  removeSession(): void {
    this.cookieService.delete(this.authSessionKey, '/')
  }
  // Nuevo método para obtener el userId del token
  getUserId(): number | null {
    try {
      const token = this.cookieService.get(this.authSessionKey);
      if (!token) return null;

      const claims: JwtPayload = jwtDecode(token);
      return claims.userId || null;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }

  // Nuevo método para obtener el rol del usuario
  getUserRole(): string | null {
    try {
      const token = this.cookieService.get(this.authSessionKey);
      if (!token) return null;

      const claims: JwtPayload = jwtDecode(token);
      return claims.role || null;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }
  // Método para verificar si el token está expirado
  isTokenExpired(): boolean {
    try {
      const token = this.cookieService.get(this.authSessionKey);
      if (!token) return true;

      const claims: JwtPayload = jwtDecode(token);
      const expirationDate = new Date(claims.exp * 1000);
      return expirationDate < new Date();
    } catch (error) {
      return true;
    }
  }

  // Nuevo método para obtener el username
  getUsername(): string | null {
    try {
      const token = this.cookieService.get(this.authSessionKey);
      if (!token) return null;

      const claims: JwtPayload = jwtDecode(token);
      return claims.sub || null;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }
}
