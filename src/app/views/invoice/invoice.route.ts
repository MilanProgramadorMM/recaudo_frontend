import type { Route } from "@angular/router";
import { InvoicesComponent } from "./invoices/invoices.component";
import { ViewInvoiceComponent } from "./view-invoice/view-invoice.component";
import { CreateInvoiceComponent } from "./create-invoice/create-invoice.component";

export const INVOICE_ROUTES: Route[] = [
  {
    path: 'invoices',
    component: InvoicesComponent,
    data: { title: 'Invoices' }
  },
  {
    path: 'view',
    component: ViewInvoiceComponent,
    data: { title: 'View Invoice' }
  },
  {
    path: 'create',
    component: CreateInvoiceComponent,
    data: { title: 'Create Invoice' }
  },
]