import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import type { AppointmentStatType } from '../../data';

@Component({
  selector: 'appointment-stat-card',
  standalone: true,
  imports: [NgbDropdownModule],
  templateUrl: './appointment-stat-card.component.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppointmentStatCardComponent {

  @Input() stats: AppointmentStatType = {
    icon: '',
    title: '',
    count: 1,
    patients: [
      {
        title: "",
        patientsCount: 1
      },
    ]
  };
}
