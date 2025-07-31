import { Component } from '@angular/core';
import { PageTitleComponent } from "@components/page-title.component";
import { customersData } from './data';
import { NgbPaginationModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { currency } from '@common/constants';

@Component({
  selector: 'customers',
  standalone: true,
  imports: [PageTitleComponent,NgbProgressbarModule,DatePipe,NgbPaginationModule],
  templateUrl: './customers.component.html',
  styles: ``
})
export class CustomersComponent {
customers=customersData

currency=currency
}
