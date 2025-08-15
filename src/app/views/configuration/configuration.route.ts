import type { Route } from "@angular/router";
import { UsersComponentComponent } from "./users-component/users-component.component";
import { UserCreateComponent } from "./user-create/user-create.component";
import { MaestroRolesComponent } from "./maestro-roles/maestro-roles.component";
import { RecoverPassComponent } from "@views/auth/recover-pass/recover-pass.component";

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
    path: 'roles',
    component: MaestroRolesComponent,
    data: { title: 'Maestro de Roles' }
  }

]