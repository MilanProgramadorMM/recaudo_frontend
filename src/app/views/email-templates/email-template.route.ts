import type { Route } from "@angular/router";
import { BasicComponent } from "./basic/basic.component";
import { PurchaseComponent } from "./purchase/purchase.component";
import { AccountActivationComponent } from "./account-activation/account-activation.component";

export const EMAIL_TEMPLATE_ROUTES: Route[] = [
  {
    path: 'basic',
    component: BasicComponent,
    data: { title: 'Basic Email Template' },
  },
  {
    path: 'purchase',
    component: PurchaseComponent,
    data: { title: 'purchase Invoice Template' },
  },
  {
    path: 'account-activation',
    component: AccountActivationComponent,
    data: { title: 'Account Activation Template' },
  },
]