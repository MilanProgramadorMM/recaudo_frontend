import { Routes, Router } from '@angular/router'
import { AuthLayoutComponent } from '@layouts/auth-layout/auth-layout.component'
import { LayoutComponent } from '@layouts/layout/layout.component'
import { inject } from '@angular/core'
import { AuthenticationService } from '@core/services/auth.service'

export const routes: Routes = [

  {
    path: '',
    component: LayoutComponent,
    loadChildren: () =>
      import('./views/views.route').then((mod) => mod.VIEWS_ROUTES)
    },
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./views/auth/auth.route').then((mod) => mod.AUTH_ROUTES),
  },
  {
    path: '',
    component: LayoutComponent,
    loadChildren: () =>
      import('./views/views.route').then((mod) => mod.VIEWS_ROUTES),
    canActivate: [
      (url: any) => {
        const router = inject(Router)
        const authService = inject(AuthenticationService)
        if (!authService.session) {
          return router.createUrlTree(['/auth/login'], {
            queryParams: { returnUrl: url._routerState.url },
          })
        }
        return true
      },
    ],
  },
  {
    path: 'sales',
    loadComponent: () => import('./views/dashboards/sales/sales.component').then(m => m.SalesComponent),
    data: { title: 'Ventas' }
  },
  /*{
    path: '',
    loadChildren: () =>
      import('./views/other-pages/other-page.route').then(
        (mod) => mod.OTHER_ROUTES
      ),
  },
  {
    path: 'email-templates',
    loadChildren: () =>
      import('./views/email-templates/email-template.route').then(
        (mod) => mod.EMAIL_TEMPLATE_ROUTES
      ),
  },
  {
    path: '',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./views/error-pages/error-pages.route').then(
        (mod) => mod.ERROR_PAGES_ROUTES
      ),
  },
  */
]
