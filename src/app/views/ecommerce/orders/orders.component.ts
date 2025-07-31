import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { currency } from '@common/constants';
import { PageTitleComponent } from "@components/page-title.component";
import { FlatpickrDirective } from '@core/directive/flatpickr.directive';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Select2 } from 'ng-select2-component';
import { orderData } from './data';

@Component({
  selector: 'orders',
  standalone: true,
  imports: [PageTitleComponent, NgbPaginationModule, DatePipe, FlatpickrDirective,Select2],
  templateUrl: './orders.component.html',
  styles: ``
})
export class OrdersComponent {
  orders = orderData
  currency = currency

  statusOpts = [
    {
      label: 'Select',
      data: {
        name: 'Select',
      },
      options: [
        { value: 'All', label: 'All', },
        { value: 'Cancelled', label: 'Cancelled', },
        { value: 'Completed', label: 'Completed', },
        { value: 'Denied', label: 'Denied', },
        { value: 'Pending', label: 'Pending', },
        { value: 'Processing', label: 'Processing', },
        { value: 'Refunded', label: 'Refunded', },
      ]
    }
  ]
}
