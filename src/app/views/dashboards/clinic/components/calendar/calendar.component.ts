import { Component } from '@angular/core';
import { FlatpickrDirective } from '@core/directive/flatpickr.directive';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'calendar',
  standalone: true,
  imports: [FlatpickrDirective,NgbDropdownModule],
  templateUrl: './calendar.component.html',
  styles: ``
})
export class CalendarComponent {

}
