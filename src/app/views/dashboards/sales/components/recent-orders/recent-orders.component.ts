import { Component } from '@angular/core';
import { productData } from '../../data';
import { RouterLink } from '@angular/router';
import { currency } from '@common/constants';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'recent-orders',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './recent-orders.component.html',
  styles: ``
})
export class RecentOrdersComponent {
orders=productData
currency=currency
}
