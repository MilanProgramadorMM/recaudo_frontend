import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { StatsComponent } from "./components/stats/stats.component";
import { OverviewChartComponent } from "./components/overview-chart/overview-chart.component";
import { RecentOrdersComponent } from "./components/recent-orders/recent-orders.component";
import { FlatpickrDirective } from '@core/directive/flatpickr.directive';
import { SelectFormInputDirective } from '@core/directive/select-form-input.directive';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [StatsComponent, 
    OverviewChartComponent,
     SelectFormInputDirective,
    FlatpickrDirective, 
    RecentOrdersComponent, 
  ],
  templateUrl: './sales.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: ``
})
export class SalesComponent {

}
