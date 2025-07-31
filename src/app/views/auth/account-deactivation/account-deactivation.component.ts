import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { credits, currentYear } from '@common/constants';

@Component({
  selector: 'account-deactivation',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './account-deactivation.component.html',
  styles: ``
})
export class AccountDeactivationComponent {
  currentYear = currentYear
  credits = credits
}
