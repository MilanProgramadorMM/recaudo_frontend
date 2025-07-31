import { Component } from '@angular/core';
import { ThirdPartyLoginComponent } from "@components/third-party-login.components";
import { RouterLink } from '@angular/router';
import { credits, currentYear } from '@common/constants';

@Component({
  selector: 'create-pass',
  standalone: true,
  imports: [ThirdPartyLoginComponent,  RouterLink],
  templateUrl: './create-pass.component.html',
  styles: ``
})
export class CreatePassComponent {
  currentYear = currentYear
  credits = credits
}
