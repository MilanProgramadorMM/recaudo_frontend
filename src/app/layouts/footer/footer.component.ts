import { Component } from '@angular/core';
import { currentYear } from '@common/constants';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styles: ``
})
export class FooterComponent {
  currentFullYear = currentYear
}
