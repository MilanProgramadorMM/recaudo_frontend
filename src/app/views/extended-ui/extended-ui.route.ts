import type { Route } from "@angular/router";
import { DragulaComponent } from "./dragula/dragula.component";
import { SweetAlertComponent } from "./sweet-alert/sweet-alert.component";
import { RatingsComponent } from "./ratings/ratings.component";
import { ScrollbarComponent } from "./scrollbar/scrollbar.component";

export const EXTENDED_UI_ROUTES: Route[] = [
  {
    path: 'dragula',
    component: DragulaComponent,
    data: { title: 'Dragula' }
  },
  {
    path: 'sweet-alert',
    component: SweetAlertComponent,
    data: { title: 'Sweet Alert' }
  },
  {
    path: 'ratings',
    component: RatingsComponent,
    data: { title: 'Ratings' }
  },
  {
    path: 'scrollbar',
    component: ScrollbarComponent,
    data: { title: 'Scrollbar' }
  },
]