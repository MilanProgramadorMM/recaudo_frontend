import type { Route } from "@angular/router";
import { TablerIconsComponent } from "./tabler-icons/tabler-icons.component";
import { SolarIconsComponent } from "./solar-icons/solar-icons.component";

export const ICONS_ROUTES: Route[] = [
  {
    path: 'tabler',
    component: TablerIconsComponent,
    data: { title: 'Tabler' }
  },
  {
    path: 'solar',
    component: SolarIconsComponent,
    data: { title: 'Solar' }
  },
]