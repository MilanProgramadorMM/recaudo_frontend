import { Component } from '@angular/core';
import { currency } from '@common/constants';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'balance-detail',
  standalone: true,
  imports: [NgbCarouselModule],
  templateUrl: './balance-detail.component.html',
  styles: ``
})
export class BalanceDetailComponent {
  currency=currency
}
