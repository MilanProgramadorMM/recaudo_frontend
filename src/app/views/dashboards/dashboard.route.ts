import type { Route } from "@angular/router";
import { SalesComponent } from "./sales/sales.component";
import { ClinicComponent } from "./clinic/clinic.component";
import { WalletComponent } from "./wallet/wallet.component";

export const DASHBOARD_ROUTES: Route[] = [
  {
    path: 'sales',
    component: SalesComponent,
    data: { title: 'Sales' }
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