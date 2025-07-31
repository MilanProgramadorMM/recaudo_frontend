import { Component } from '@angular/core';
import { PageTitleComponent } from "../../../components/page-title.component";
import { pricingTwoData } from '../data';
import { currency } from '@common/constants';

@Component({
  selector: 'pricing-two',
  standalone: true,
  imports: [PageTitleComponent],
  templateUrl: './pricing-two.component.html',
  styles: ``
})
export class PricingTwoComponent {
pricingPlans=pricingTwoData

currency=currency
}
