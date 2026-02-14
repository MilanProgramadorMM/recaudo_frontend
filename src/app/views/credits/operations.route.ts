import type { Route } from "@angular/router";
import { SimulationIntentionComponent } from "./operations/simulation-intention/simulation-intention.component";
import { ManagmentCreditIntentionComponent } from "./operations/managment-credit-intention/managment-credit-intention.component";
import { SeeIntentionComponent } from "./operations/see-intention/see-intention.component";
import { CreditsComponent } from "./operations/credits/credits.component";
import { RequestRecaudoComponent } from "./operations/request-recaudo/request-recaudo.component";
import { ClosingComponent } from "./operations/closing/closing.component";
import { AuthGuard } from "@/store/authentication/guards/guard.guard";
import { ListClosingAsesorComponent } from "./operations/list-closing-asesor/list-closing-asesor.component";

export const OPERATIONS_ROUTES: Route[] = [

  {
    path: 'simulacion',
    component: SimulationIntentionComponent,
    data: { title: 'Simulacion de intencion de credito' }
  },
  {
    path: 'intencion',
    component: SeeIntentionComponent,
    data: { title: 'Ver solicitudes de credito' }
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