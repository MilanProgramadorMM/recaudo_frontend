import type { Route } from "@angular/router";
import { PeriodsComponent } from "./updates/periods/periods.component";
import { AmortizationsComponent } from "./updates/amortizations/amortizations.component";

export const CREDITS_ROUTES: Route[] = [

  {
    path: 'periodos',
    component: PeriodsComponent,
    data: { title: 'Periodos' }
  },
  {
    path: 'amortizaciones',
    component: AmortizationsComponent,
    data: { title: 'Amortizaciones' }
  }
]