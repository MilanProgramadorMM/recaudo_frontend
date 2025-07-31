import { Route } from '@angular/router'
import { BasicTablesComponent } from './basic-tables/basic-tables.component'
import { DatatableComponent } from './datatable/datatable.component'

export const TABLES_ROUTES: Route[] = [
  {
    path: 'basic-tables',
    component: BasicTablesComponent,
    data: { title: 'Basic Tables' },
  },
  {
    path: 'datatable',
    component: DatatableComponent,
    data: { title: 'DataTable' },
  }
]
