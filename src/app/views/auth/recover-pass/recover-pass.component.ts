import { Component } from '@angular/core';
import { credits, currentYear } from '@common/constants';
import { RouterLink } from '@angular/router';
import { ThirdPartyLoginComponent } from "../../../components/third-party-login.components";

@Component({
  selector: 'recover-pass',
  standalone: true,
  imports: [ RouterLink, ThirdPartyLoginComponent],
  templateUrl: './recover-pass.component.html',
  styles: ``
})
export class RecoverPassComponent {
  currentYear = currentYear
  credits = credits
}
