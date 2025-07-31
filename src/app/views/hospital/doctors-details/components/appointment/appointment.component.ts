import { Component } from '@angular/core';
import { FlatpickrDirective } from '@core/directive/flatpickr.directive';

@Component({
  selector: 'appointment',
  standalone: true,
  imports: [FlatpickrDirective],
  templateUrl: './appointment.component.html',
  styles: ``
})
export class AppointmentComponent {

}
