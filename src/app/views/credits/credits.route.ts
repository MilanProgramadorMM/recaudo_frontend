import type { Route } from "@angular/router";
import { PeriodsComponent } from "./updates/periods/periods.component";
import { AmortizationsComponent } from "./updates/amortizationsType/amortizations.component";
import { TaxComponent } from "./updates/tax/tax.component";
import { OtherDiscountsComponent } from "./updates/other-discounts/other-discounts.component";
import { ServiceQuotaComponent } from "./updates/service-quota/service-quota.component";
import { LineasComponent } from "./updates/lines/lineas.component";
import { DocumentTypeComponent } from "./updates/document-type/document-type.component";
import { InsuranceComponent } from "./updates/insurance/insurance.component";
import { ZonaComponent } from "./updates/zona/zona.component";

export const CREDITS_ROUTES: Route[] = [

  {
    path: 'periodos',
    component: PeriodsComponent,
    data: { title: 'Periodos' }
  },
  {
    path: 'lineas',
    component: LineasComponent,
    data: { title: 'Lineas de credito' }
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
  },
  {
    path: 'type-document',
    component: DocumentTypeComponent,
    data: { title: 'Tipo de documentos' }
  },
  {
    path: 'insurance',
    component: InsuranceComponent,
    data: { title: 'Seguros' }
  },
  {
    path: 'zonas',
    component: ZonaComponent,
    data: { title: 'Zonas' }
  }
]