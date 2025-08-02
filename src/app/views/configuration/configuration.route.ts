import type { Route } from "@angular/router";
import { UsersComponentComponent } from "./users-component/users-component.component";
import { UserCreateComponent } from "./user-create/user-create.component";
import { PersonComponentComponent } from "./person-component/person-component.component";
import { PersonCreateComponent } from "./person-create/person-create.component";
import { MaestroRolesComponent } from "./maestro-roles/maestro-roles.component";

export const CONFIGURATION_ROUTES: Route[] = [
  {
    path: 'usuarios',
    component: UsersComponentComponent,
    data: { title: 'Usuarios' }
  },
  {
    path: 'users/create',
    component: UserCreateComponent,
    data: { title: 'Crear Usuarios' }
  },
  {
    path: 'personas',
    component: PersonComponentComponent,
    data: { title: 'Personas' }
  },
  {
    path: 'person/create',
    component: PersonCreateComponent,
    data: { title: 'Crear Personas' }
  },
  {
    path: 'roles',
    component: MaestroRolesComponent,
    data: { title: 'Maestro de Roles' }
  }

]