import { Component } from '@angular/core';
import { ThirdPartyLoginComponent } from "@components/third-party-login.components";
import { credits, currentYear } from '@common/constants';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'confirm-mail',
  standalone: true,
  imports: [ThirdPartyLoginComponent, RouterLink],
  templateUrl: './confirm-mail.component.html',
  styles: ``
})
export class ConfirmMailComponent {
  currentYear = currentYear
  credits = credits
}
