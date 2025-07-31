import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { credits, currentYear } from '@common/constants';
import { ThirdPartyLoginComponent } from "../../../components/third-party-login.components";

@Component({
  selector: 'lock-screen',
  standalone: true,
  imports: [RouterLink, ThirdPartyLoginComponent],
  templateUrl: './lock-screen.component.html',
  styles: ``
})
export class LockScreenComponent {
  currentYear = currentYear
  credits = credits
}
