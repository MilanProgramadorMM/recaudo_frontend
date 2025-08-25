import type { Route } from "@angular/router";
import { PersonComponentComponent } from "../configuration/person-component/person-component.component";
import { PersonCreateComponent } from "../configuration/person-create/person-create.component";

export const MASTER_ROUTES: Route[] = [
  {
    path: 'asesores',
    component: PersonComponentComponent,
    data: { title: 'Personas' }
  },
  {
    path: 'asesores/create',
    component: PersonCreateComponent,
    data: { title: 'Crear Personas' }
  }

]