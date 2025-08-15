import type { Route } from "@angular/router";
import { PersonComponentComponent } from "../configuration/person-component/person-component.component";
import { PersonCreateComponent } from "../configuration/person-create/person-create.component";

export const MASTER_ROUTES: Route[] = [
  {
    path: 'persons',
    component: PersonComponentComponent,
    data: { title: 'Personas' }
  },
  {
    path: 'person/create',
    component: PersonCreateComponent,
    data: { title: 'Crear Personas' }
  }

]