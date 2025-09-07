import type { Route } from "@angular/router";
import { PersonComponentComponent } from "../configuration/person-component/person-component.component";
import { PersonCreateComponent } from "../configuration/person-create/person-create.component";
import { DepartmentComponent } from "@views/configuration/departments/departments.component";
import { CitiesComponent } from "@views/configuration/cities/cities.component";
import { NeighborhoodComponent } from "@views/configuration/neighborhood/neighborhood.component";

export const MASTER_ROUTES: Route[] = [
  {
    path: 'asesores',
    component: PersonComponentComponent,
    data: { title: 'Personas', type: 'ASESOR' }
  },
  {
    path: 'asesores/create',
    component: PersonCreateComponent,
    data: { title: 'Crear Personas', type: 'ASESOR' }
  },
  {
    path: 'clientes',
    component: PersonComponentComponent,
    data: { title: 'Clientes', type: 'CLIENTE' }
  },
  {
    path: 'clientes/create',
    component: PersonCreateComponent,
    data: { title: 'Crear Cliente', type: 'CLIENTE' }
  },
  {
    path: 'departamentos',
    component: DepartmentComponent,
    data: { title: 'Departamentos' }
  },
  {
    path: 'municipios',
    component: CitiesComponent,
    data: { title: 'Municipios' }
  },
  {
    path: 'barrios',
    component: NeighborhoodComponent,
    data: { title: 'Barrios' }
  }

]