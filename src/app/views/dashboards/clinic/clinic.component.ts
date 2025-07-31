import { Component } from '@angular/core';
import { StatsComponent } from "./components/stats/stats.component";
import { CalendarComponent } from "./components/calendar/calendar.component";
import { PatientsChartComponent } from "./components/patients-chart/patients-chart.component";
import { DoctorsComponent } from "./components/doctors/doctors.component";
import { GenderChartComponent } from "./components/gender-chart/gender-chart.component";
import { AppointmentsComponent } from "./components/appointments/appointments.component";
import { FlatpickrDirective } from '@core/directive/flatpickr.directive';

@Component({
  selector: 'app-clinic',
  standalone: true,
  imports: [StatsComponent, CalendarComponent, PatientsChartComponent, DoctorsComponent, GenderChartComponent, AppointmentsComponent,FlatpickrDirective],
  templateUrl: './clinic.component.html',
  styles: ``
})
export class ClinicComponent {

}
