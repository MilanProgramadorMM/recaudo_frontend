import { inject, Inject, Injectable } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, exhaustMap, map, of, tap } from 'rxjs'
import {
  login,
  loginFailure,
  loginSuccess,
  logout,
  logoutSuccess,
} from './authentication.actions'
import { AuthenticationService } from '@core/services/auth.service'

@Injectable()
export class AuthenticationEffects {

  private actions$ = inject(Actions)

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      exhaustMap(({ username, password }) => {
        return this.authService.login(username, password).pipe(
          map((user) => {
            if (user) {
              const returnUrl =
                this.route.snapshot.queryParams['returnUrl'] || '/dashboards/sales'
              this.router.navigateByUrl(returnUrl)
            }
            return loginSuccess({ user })
          }),
          catchError((error) => of(loginFailure({ error })))
        )
      })
    )
  )

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      tap(() => {
        this.authService.logout(); // Limpia la sesión
        this.router.navigate(['/auth/login']); // Redirige
      })
    ),
    { dispatch: false } // No emite ninguna acción
  );


}
