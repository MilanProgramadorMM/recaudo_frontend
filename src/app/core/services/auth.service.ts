import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators'

import { CookieService } from 'ngx-cookie-service'
import type { Observable } from 'rxjs'
import type { User } from '@core/helper/fake-backend'
import { personData } from '@views/configuration/person-component/data'
import { jwtDecode } from 'jwt-decode';


interface JwtPayload {
  sub: string;
  name: string;
  role: string;
  exp: number;
  [key: string]: any; // por si vienen más claims
}

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  user: User | null = null

  public readonly authSessionKey = '_OSEN_AUTH_SESSION_KEY_'

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

  

  login(username: string, password: string): Observable<User> {
    return this.http.post<any>(`http://localhost:8081/api/auth/login`, { username, password }).pipe(
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
    debugger;
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
    this.cookieService.set(this.authSessionKey, token, (2/24), '/', '', false, 'Lax');
  }

  removeSession(): void {
    this.cookieService.delete(this.authSessionKey, '/')
  }
}
