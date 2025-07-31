import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import type { PaymentStatType } from '../../data';

@Component({
  selector: 'stat-card',
  standalone: true,
  imports: [NgbDropdownModule],
  templateUrl: './stat-card.component.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StatCardComponent {

  @Input() stats: PaymentStatType = {
    count:12,
    icon: "",
    title: "",
    isMonth: true
  }
}
