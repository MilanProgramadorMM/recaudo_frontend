import type { Route } from "@angular/router";
import { PeriodsComponent } from "./updates/periods/periods.component";
import { AmortizationsComponent } from "./updates/amortizationsType/amortizations.component";
import { TaxComponent } from "./updates/tax/tax.component";
import { OtherDiscountsComponent } from "./updates/other-discounts/other-discounts.component";
import { ServiceQuotaComponent } from "./updates/service-quota/service-quota.component";

export const CREDITS_ROUTES: Route[] = [

  {
    path: 'periodos',
    component: PeriodsComponent,
    data: { title: 'Periodos' }
  },
  {
    path: 'type-amortizaciones',
    component: AmortizationsComponent,
    data: { title: 'Tipo de mortizaciones' }
  },
  {
    path: 'tax',
    component: TaxComponent,
    data: { title: 'Tasas' }
  },
  {
    path: 'other-discounts',
    component: OtherDiscountsComponent,
    data: { title: 'Otros descuentos' }
  },
  {
    path: 'service-quota',
    component: ServiceQuotaComponent,
    data: { title: 'Cargos por servicio' }
  }
]