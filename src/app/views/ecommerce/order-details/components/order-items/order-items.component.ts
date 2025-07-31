import { Component } from '@angular/core';
import { orderItemData } from './data';
import { currency } from '@common/constants';

@Component({
  selector: 'order-items',
  standalone: true,
  imports: [],
  templateUrl: './order-items.component.html',
  styles: ``
})
export class OrderItemsComponent {
  orderItems = orderItemData

  currency=currency
}
