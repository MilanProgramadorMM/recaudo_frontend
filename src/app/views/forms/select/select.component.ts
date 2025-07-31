import { Component } from '@angular/core';
import { PageTitleComponent } from "@components/page-title.component";
import { Select2 } from 'ng-select2-component'
import { options } from './data';
import { SelectFormInputDirective } from '@core/directive/select-form-input.directive';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [PageTitleComponent,Select2,SelectFormInputDirective],
  templateUrl: './select.component.html',
  styles: ``
})
export class SelectComponent {
  items = options

}
