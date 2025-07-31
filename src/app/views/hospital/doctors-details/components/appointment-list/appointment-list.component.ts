import { Component } from '@angular/core';
import { appointmentsData } from '../../data';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'appointment-list',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './appointment-list.component.html',
  styles: ``
})
export class AppointmentListComponent {
  appointments= appointmentsData
}
