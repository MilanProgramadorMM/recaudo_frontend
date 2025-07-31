import { Component } from '@angular/core';
import { PageTitleComponent } from "@components/page-title.component";
import { FlatpickrDirective } from '@core/directive/flatpickr.directive';

@Component({
  selector: 'picker',
  standalone: true,
  imports: [PageTitleComponent,FlatpickrDirective],
  templateUrl: './picker.component.html',
  styles: ``
})
export class PickerComponent {

}
