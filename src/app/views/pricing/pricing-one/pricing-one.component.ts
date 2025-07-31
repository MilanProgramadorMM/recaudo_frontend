import { Component } from '@angular/core';
import { PageTitleComponent } from "@components/page-title.component";
import { pricingData } from '../data';
import { CommonModule } from '@angular/common';
import { splitArray } from '@core/helper/utils';

@Component({
  selector: 'pricing-one',
  standalone: true,
  imports: [PageTitleComponent,CommonModule],
  templateUrl: './pricing-one.component.html',
  styles: ``
})
export class PricingOneComponent {
  pricingPlans = pricingData
  splitArray=splitArray
}
