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
    path: 'consultas/operativas',
    component: ConsultasComponent,
    data: { title: 'Consultas', type: 'OPERATIVAS' }
  },
  {
    path: 'consultas/tacticas',
    component: ConsultasComponent,
    data: { title: 'Consultas', type: 'TACTICAS' }
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