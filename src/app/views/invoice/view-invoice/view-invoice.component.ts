import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { currency } from '@common/constants';
import { PageTitleComponent } from "@components/page-title.component";

@Component({
  selector: 'view-invoice',
  standalone: true,
  imports: [PageTitleComponent],
  templateUrl: './view-invoice.component.html',
  styles: ``,
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ViewInvoiceComponent {
  currency=currency
}
