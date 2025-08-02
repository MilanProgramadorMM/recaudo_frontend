import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree,
} from '@angular/router';
import { AuthenticationService } from '@core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthenticationService, private router: Router) { }

  canActivate(): boolean | UrlTree {
    const isLoggedIn = !!this.authService.session;
    return isLoggedIn ? this.router.parseUrl('/') : true; // Redirigir a '/' u otra ruta válida post-login
  }
}
