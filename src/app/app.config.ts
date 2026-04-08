import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
  provideZoneChangeDetection,
} from '@angular/core'
import { provideRouter } from '@angular/router'
import { provideStoreDevtools } from '@ngrx/store-devtools'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { routes } from './app.routes'
import { provideStore } from '@ngrx/store'
import { rootReducer } from '@/store'
import { localStorageSyncReducer } from '@/store/layout/layout-reducers'
import { CalendarEffects } from '@/store/calendar/calendar.effects'
import { provideEffects } from '@ngrx/effects'
import { AuthenticationEffects } from '@/store/authentication/authentication.effects'
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http'
import { DecimalPipe } from '@angular/common'
import { CookieService } from 'ngx-cookie-service'
import { BrowserModule } from '@angular/platform-browser'
import { JwtInterceptor } from '@core/helper/jwt.interceptor'
import { ErrorInterceptor } from '@core/helper/error.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { LOCALE_ID } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'es' },
    DecimalPipe,
    CookieService,
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore(rootReducer, { metaReducers: [localStorageSyncReducer] }),
    importProvidersFrom(BrowserAnimationsModule, BrowserModule),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideEffects(AuthenticationEffects, CalendarEffects),
    provideHttpClient(withFetch(), withInterceptorsFromDi()), provideAnimationsAsync(),
  ],
}
