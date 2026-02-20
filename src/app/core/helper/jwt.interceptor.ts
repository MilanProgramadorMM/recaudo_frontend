import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { AuthenticationService } from '@core/services/auth.service'
import { Observable } from 'rxjs'

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

    // Solo añadir token si NO es una ruta pública o de autenticación
    if (token && !isAuthEndpoint && !isPublicEndpoint) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request);
  }
}