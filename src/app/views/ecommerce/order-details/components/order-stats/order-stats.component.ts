import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'order-stats',
  standalone: true,
  imports: [NgbProgressbarModule],
  templateUrl: './order-stats.component.html',
  styles: ``,
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
})
export class OrderStatsComponent {

}
