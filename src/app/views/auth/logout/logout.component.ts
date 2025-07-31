import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { credits, currentYear } from '@common/constants';

@Component({
  selector: 'logout',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './logout.component.html',
  styles: ``
})
export class LogoutComponent {
  currentYear = currentYear
  credits = credits
}
