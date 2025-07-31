import { Component } from '@angular/core';
import { transactionData } from '../../data';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'transactions',
  standalone: true,
  imports: [DatePipe,CommonModule],
  templateUrl: './transactions.component.html',
  styles: ``
})
export class TransactionsComponent {
  allTransactions = transactionData
}
