import type { Route } from "@angular/router";
import { SimulationIntentionComponent } from "./operations/simulation-intention/simulation-intention.component";
import { ManagmentCreditIntentionComponent } from "./operations/managment-credit-intention/managment-credit-intention.component";
import { SeeIntentionComponent } from "./operations/see-intention/see-intention.component";
import { CreditsComponent } from "./operations/credits/credits.component";
import { RequestRecaudoComponent } from "./operations/request-recaudo/request-recaudo.component";
import { ClosingComponent } from "./operations/closing/closing.component";
import { AuthGuard } from "@/store/authentication/guards/guard.guard";
import { ListClosingAsesorComponent } from "./operations/list-closing-asesor/list-closing-asesor.component";
import { SimulationIntentionComponentv2 } from "./operations/simulation-intentionv2/simulation-intention.componentv2";

export const OPERATIONS_ROUTES: Route[] = [

  {
    path: 'creacion',
    component: SimulationIntentionComponent,
    data: { title: 'Creacion de intencion de credito' }
  },
  {
    path: 'simulacion',
    component: SimulationIntentionComponentv2,
    data: { title: 'Simulacion de intencion de credito' }
  },
  {
    path: 'intencion',
    component: SeeIntentionComponent,
    data: { title: 'Ver solicitudes de credito', type: 'GESTION' }
  },
  {
    path: 'detalle-intencion',         
    component: SeeIntentionComponent,
    data: { title: 'Detalle intenciones de crédito', type: 'DETALLE' }
  },
  {
    path: 'creditos',
    component: CreditsComponent,
    data: { title: 'Ver creditos' }
  },
  {
    path: 'recaudo',
    component: RequestRecaudoComponent,
    data: { title: 'Registrar recaudo' }
  },
  {
    path: 'management-credit-intention/:id',
    component: ManagmentCreditIntentionComponent
  },
  {
    path: 'cierre',
    component: ListClosingAsesorComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Asesor'] }
  },

]