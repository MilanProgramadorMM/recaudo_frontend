import type { Route } from "@angular/router";
import { SalesComponent } from "./sales/sales.component";
import { ClinicComponent } from "./clinic/clinic.component";
import { WalletComponent } from "./wallet/wallet.component";
import { ConsultasComponent } from "./consultas/consultas.component";
import { CarteraComponentsComponent } from "@views/credits/operations/cartera/cartera-components.component";
import { CarteraComparativoComponent } from "@views/credits/operations/cartera/rango-cartera/cartera-comparativo/cartera-comparativo.component";
import { ClienteCarteraComponent } from "@views/credits/operations/cartera/cliente-cartera-components/cliente-cartera-components.component";

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
    path: 'consultas/dashboards-cartera',
    component: CarteraComponentsComponent
  },
  {
    path: 'consultas/comparativo-cartera',
    component: CarteraComparativoComponent
  },
  {
    path: 'consultas/cartera-cliente',
    component: ClienteCarteraComponent
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