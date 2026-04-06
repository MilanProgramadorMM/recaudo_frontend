import type { Route } from "@angular/router";
import { SalesComponent } from "./sales/sales.component";
import { ClinicComponent } from "./clinic/clinic.component";
import { WalletComponent } from "./wallet/wallet.component";
import { ConsultasComponent } from "./consultas/consultas.component";

export const DASHBOARD_ROUTES: Route[] = [
  {
    path: '',
    component: SalesComponent,
    data: { title: 'Sales' }
  },
  {
    path: 'sales',
    component: SalesComponent,
    data: { title: 'Sales' }
  },
  {
    path: 'consultas',
    component: ConsultasComponent,
    data: { title: 'Consultas' }
  },
  {
    path: 'clinic',
    component: ClinicComponent,
    data: { title: 'Clinic' }
  },
  {
    path: 'wallet',
    component: WalletComponent,
    data: { title: 'Wallet' }
  },
]