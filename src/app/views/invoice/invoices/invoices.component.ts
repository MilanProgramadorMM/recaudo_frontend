import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { InvoiceStatsComponent } from "./components/invoice-stats/invoice-stats.component";
import { PageTitleComponent } from "@components/page-title.component";
import { invoicesData } from './data';
import { currency } from '@common/constants';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'invoices',
  standalone: true,
  imports: [InvoiceStatsComponent, PageTitleComponent,NgbPaginationModule,DatePipe,RouterLink],
  templateUrl: './invoices.component.html',
  styles: ``,
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class InvoicesComponent {
invoices=invoicesData

currency=currency
}
