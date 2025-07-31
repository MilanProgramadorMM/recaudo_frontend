import { Component } from '@angular/core';
import { StatCardComponent } from "./components/stat-card/stat-card.component";
import { PageTitleComponent } from "@components/page-title.component";
import { paymentListData, paymentStatData } from './data';
import { DatePipe } from '@angular/common';
import { currency } from '@common/constants';
import { NgbPagination, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'payments',
  standalone: true,
  imports: [StatCardComponent, PageTitleComponent, DatePipe, NgbPaginationModule],
  templateUrl: './payments.component.html',
  styles: ``
})
export class PaymentsComponent {
  statsData = paymentStatData

  payments = paymentListData

  currency = currency

  page = 4
}
