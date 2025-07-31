import { Component } from '@angular/core';
import { appointmentsData } from '../../data';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'appointments',
  standalone: true,
  imports: [DatePipe,CommonModule],
  templateUrl: './appointments.component.html',
  styles: ``
})
export class AppointmentsComponent {
  allAppointments = appointmentsData
}
