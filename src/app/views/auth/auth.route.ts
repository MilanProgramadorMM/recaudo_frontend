import type { Route } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { LogoutComponent } from "./logout/logout.component";
import { RecoverPassComponent } from "./recover-pass/recover-pass.component";
import { CreatePassComponent } from "./create-pass/create-pass.component";
import { LockScreenComponent } from "./lock-screen/lock-screen.component";
import { ConfirmMailComponent } from "./confirm-mail/confirm-mail.component";
import { AccountDeactivationComponent } from "./account-deactivation/account-deactivation.component";
import { LoginWithPinComponent } from "./login-with-pin/login-with-pin.component";
import { TwoFaLoginComponent } from "./two-fa-login/two-fa-login.component";

export const AUTH_ROUTES: Route[] = [
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Login' }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: { title: 'Register' }
  },
  {
    path: 'logout',
    component: LogoutComponent,
    data: { title: 'Logout' }
  },
  {
    path: 'recover-password',
    component: RecoverPassComponent,
    data: { title: 'Recover Password' }
  },
  {
    path: 'create-password',
    component: CreatePassComponent,
    data: { title: 'Create Password' }
  },
  {
    path: 'lock-screen',
    component: LockScreenComponent,
    data: { title: 'Lock Screen' }
  },
  {
    path: 'confirm-mail',
    component: ConfirmMailComponent,
    data: { title: 'Confirm Mail' }
  },
  {
    path: 'account-deactivation',
    component: AccountDeactivationComponent,
    data: { title: 'Account Deactivation' }
  },
  {
    path: 'pin-login',
    component: LoginWithPinComponent,
    data: { title: 'Login With PIN' }
  },
  {
    path: '2fa',
    component: TwoFaLoginComponent,
    data: { title: '2FA' }
  },
]