import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { invoiceStatData } from './data';

@Component({
  selector: 'invoice-stats',
  standalone: true,
  imports: [],
  templateUrl: './invoice-stats.component.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InvoiceStatsComponent {
invoiceStats=invoiceStatData
}
