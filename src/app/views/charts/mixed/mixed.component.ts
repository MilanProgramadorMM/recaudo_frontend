import { Component } from '@angular/core';
import { allMixedChartOpts, lineAreaChartOpts, lineColumnMixedChartOpts, multipleChartOpts } from './data';
import { PageTitleComponent } from "@components/page-title.component";
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'mixed',
  standalone: true,
  imports: [PageTitleComponent,NgApexchartsModule],
  templateUrl: './mixed.component.html',
  styles: ``
})
export class MixedComponent {
  lineColumnMixedChart = lineColumnMixedChartOpts
  multipleChart = multipleChartOpts
  lineAreaChart = lineAreaChartOpts
  allMixedChart = allMixedChartOpts
}
