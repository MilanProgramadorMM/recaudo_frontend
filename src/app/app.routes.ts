import { Routes, Router } from '@angular/router'
import { AuthLayoutComponent } from '@layouts/auth-layout/auth-layout.component'
import { LayoutComponent } from '@layouts/layout/layout.component'
import { inject } from '@angular/core'
import { AuthenticationService } from '@core/services/auth.service'
import { AuthGuard } from '@/store/authentication/guards/guard.guard'
import { LoginGuard } from '@/store/authentication/guards/login.guard'
import { CreditApprovalComponent } from '@views/credit-approval/credit-approval.component'

export const routes: Routes = [

  {
    path: '',
    canActivate: [AuthGuard],
    component: LayoutComponent,
    loadChildren: () =>
      import('./views/views.route').then((mod) => mod.VIEWS_ROUTES),
  },
  {
    path: 'sales',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./views/dashboards/sales/sales.component').then(
        (m) => m.SalesComponent
      ),
  },
  {
    path: 'auth',
    canActivate: [LoginGuard],
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./views/auth/auth.route').then((mod) => mod.AUTH_ROUTES),
  },

  {
    path: 'email-templates',
    canActivate: [AuthGuard],
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

  {
    path: 'public/credit-approval/:token',
    component: CreditApprovalComponent,
  },
];
