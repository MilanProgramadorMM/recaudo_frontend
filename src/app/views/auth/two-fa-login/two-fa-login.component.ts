import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { credits, currentYear } from '@common/constants';
import { AuthLogoComponent } from "../../../components/auth-logo.component";

@Component({
  selector: 'two-fa-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './two-fa-login.component.html',
  styles: ``
})
export class TwoFaLoginComponent {
  currentYear = currentYear
  credits=credits
}
