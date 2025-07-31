import type { Route } from '@angular/router';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';

export const OTHER_ROUTES: Route[] = [
  {
    path: 'maintenance',
    component: MaintenanceComponent,
    data: { title: 'Maintenance' },
  },
  {
    path: 'coming-soon',
    component: ComingSoonComponent,
    data: { title: 'Coming Soon' },
  },
]