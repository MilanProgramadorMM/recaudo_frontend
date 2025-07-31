import type { Route } from "@angular/router";
import { StarterComponent } from "./starter/starter.component";
import { FaqsComponent } from "./faqs/faqs.component";
import { TimelineComponent } from "./timeline/timeline.component";
import { TermsConditionsComponent } from "./terms-conditions/terms-conditions.component";
import { ErrorTwo404Component } from "./error-two-404/error-two-404.component";

export const PAGES_ROUTES: Route[] = [
  {
    path: 'starter-page',
    component: StarterComponent,
    data: { title: 'Starter Page' }
  },
  {
    path: 'faq',
    component: FaqsComponent,
    data: { title: 'FAQ' }
  },
  {
    path: 'timeline',
    component: TimelineComponent,
    data: { title: 'Timeline' }
  },
  {
    path: 'terms-conditions',
    component: TermsConditionsComponent,
    data: { title: 'Terms & Conditions' }
  },
  {
    path: 'error-404-alt',
    component: ErrorTwo404Component,
    data: { title: 'Error 404 Alt' },
  },
]