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
    path: 'apps',
    loadChildren: () =>
      import('./apps/apps.route').then((mod) => mod.APPS_ROUTES),
  },
  {
    path: 'hospital',
    loadChildren: () =>
      import('./hospital/hospital.route').then((mod) => mod.HOSPITAL_ROUTES),
  },
  {
    path: 'ecommerce',
    loadChildren: () =>
      import('./ecommerce/ecommerce.route').then((mod) => mod.ECOMMERCE_ROUTES),
  },
  {
    path: 'invoice',
    loadChildren: () =>
      import('./invoice/invoice.route').then((mod) => mod.INVOICE_ROUTES),
  },
  {
    path: 'pages',
    loadChildren: () =>
      import('./pages/pages.route').then((mod) => mod.PAGES_ROUTES),
  },
  {
    path: 'pricing',
    loadChildren: () =>
      import('./pricing/pricing.route').then((mod) => mod.PRICING_ROUTES),
  },
  {
    path: 'ui',
    loadChildren: () =>
      import('./ui/ui-pages.route').then((mod) => mod.UI_PAGES_ROUTES),
  },
  {
    path: 'extended-ui',
    loadChildren: () =>
      import('./extended-ui/extended-ui.route').then((mod) => mod.EXTENDED_UI_ROUTES),
  },
  {
    path: 'icons',
    loadChildren: () =>
      import('./icons/icons.route').then((mod) => mod.ICONS_ROUTES),
  },
  {
    path: 'charts',
    loadChildren: () =>
      import('./charts/charts.route').then((mod) => mod.CHARTS_ROUTES),
  },
  {
    path: 'form',
    loadChildren: () =>
      import('./forms/form.route').then((mod) => mod.FORMS_ROUTES),
  },
  {
    path: 'tables',
    loadChildren: () =>
      import('./tables/tables.route').then((mod) => mod.TABLES_ROUTES),
  },
  {
    path: 'maps',
    loadChildren: () =>
      import('./maps/maps.route').then((mod) => mod.MAP_ROUTES),
  },
]