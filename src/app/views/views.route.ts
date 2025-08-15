import type { Route } from "@angular/router";

export const VIEWS_ROUTES: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('./dashboards/dashboard.route').then((mod) => mod.DASHBOARD_ROUTES),
  },
  {
    path: 'dashboards',
    loadChildren: () =>
      import('./dashboards/dashboard.route').then((mod) => mod.DASHBOARD_ROUTES),
  },
  {
    path: 'configuration',
    loadChildren: () =>
      import('./configuration/configuration.route').then((mod) => mod.CONFIGURATION_ROUTES),
  },
  {
    path: 'master',
    loadChildren: () =>
      import('./master/master.route').then((mod) => mod.MASTER_ROUTES),
  }
]