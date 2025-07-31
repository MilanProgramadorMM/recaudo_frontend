import type { Route } from "@angular/router";
import { PricingOneComponent } from "./pricing-one/pricing-one.component";
import { PricingTwoComponent } from "./pricing-two/pricing-two.component";

export const PRICING_ROUTES: Route[] = [
  {
    path: 'pricing-one',
    component: PricingOneComponent,
    data: { title: 'Pricing One' },
  },
  {
    path: 'pricing-two',
    component: PricingTwoComponent,
    data: { title: 'Pricing Two' },
  },
]