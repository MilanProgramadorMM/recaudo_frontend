import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PageTitleComponent } from "../../../components/page-title.component";
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AppointmentStatCardComponent } from "./components/appointment-stat-card/appointment-stat-card.component";
import { appointmentsData, appointmentStatData } from './data';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'appointments',
  standalone: true,
  imports: [PageTitleComponent, NgbDropdownModule, AppointmentStatCardComponent,DatePipe],
  templateUrl: './appointments.component.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppointmentsComponent {
  appointmentStatData = appointmentStatData

  appointments = appointmentsData
}
