import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { environment } from '@core/services/app-version'
import { AuthenticationService } from '@core/services/auth.service'
import { Observable } from 'rxjs'
import { version } from 'xlsx-js-style'

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  intercept(
    request: HttpRequest<Request>,
    next: HttpHandler
  ): Observable<HttpEvent<Event>> {

    const authenticationService = inject(AuthenticationService)
    const token = authenticationService.session;

    const isPublicEndpoint = request.url.includes('/api/public/');
    const isAuthEndpoint = request.url.includes('/api/auth/login');

    let headers: any = {
      'X-App-Version': environment.version
    };

    // Solo añadir token si NO es una ruta pública o de autenticación
    if (token && !isAuthEndpoint && !isPublicEndpoint) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    request = request.clone({
      setHeaders: headers
    });

    return next.handle(request);
  }
}