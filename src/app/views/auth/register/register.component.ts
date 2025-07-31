import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { credits, currency, currentYear } from '@common/constants';
import { ThirdPartyLoginComponent } from "../../../components/third-party-login.components";

@Component({
  selector: 'register',
  standalone: true,
  imports: [RouterLink, ThirdPartyLoginComponent],
  templateUrl: './register.component.html',
  styles: ``
})
export class RegisterComponent {
  currentYear = currentYear
  credits=credits
}
