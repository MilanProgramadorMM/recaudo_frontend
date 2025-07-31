import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { currency } from '@common/constants';
import { PageTitleComponent } from "@components/page-title.component";
import { FlatpickrDirective } from '@core/directive/flatpickr.directive';

@Component({
  selector: 'create-invoice',
  standalone: true,
  imports: [PageTitleComponent,FlatpickrDirective],
  templateUrl: './create-invoice.component.html',
  styles: ``,
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class CreateInvoiceComponent {
  currency=currency
}
