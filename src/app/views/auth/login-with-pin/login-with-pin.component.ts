import { Component } from '@angular/core';
import { ThirdPartyLoginComponent } from "@components/third-party-login.components";
import { credits, currency, currentYear } from '@common/constants';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'login-with-pin',
  standalone: true,
  imports: [ThirdPartyLoginComponent,  RouterLink],
  templateUrl: './login-with-pin.component.html',
  styles: ``
})
export class LoginWithPinComponent {
  currentYear = currentYear
  credits = credits
}
