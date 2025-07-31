import type { Route } from "@angular/router";
import { UsersComponentComponent } from "./users-component/users-component.component";
import { UserCreateComponent } from "./user-create/user-create.component";
import { PersonComponentComponent } from "./person-component/person-component.component";
import { PersonCreateComponent } from "./person-create/person-create.component";

export const CONFIGURATION_ROUTES: Route[] = [
  {
    path: 'users',
    component: UsersComponentComponent,
    data: { title: 'Usuarios' }
  },
  {
    path: 'users/create',
    component: UserCreateComponent,
    data: { title: 'Crear Usuarios' }
  },
  {
    path: 'person',
    component: PersonComponentComponent,
    data: { title: 'Personas' }
  },
  {
    path: 'person/create',
    component: PersonCreateComponent,
    data: { title: 'Crear Personas' }
  }
]