import { Component } from '@angular/core';
import { PageTitleComponent } from "@components/page-title.component";
import { basicRadialBarChartOpts, circleChartOpts, circleImageChartOpts, gradientCircularChartOpts, multipleRadialBarsChartOpts, semiCircleChartOpts, strokedCircularChartOpts } from './data';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'radialbar',
  standalone: true,
  imports: [PageTitleComponent,NgApexchartsModule],
  templateUrl: './radialbar.component.html',
  styles: ``
})
export class RadialbarComponent {
  basicRadialBarChart = basicRadialBarChartOpts
  multipleRadialBarsChart = multipleRadialBarsChartOpts
  circleChart = circleChartOpts
  circleImageChart = circleImageChartOpts
  strokedCircularChart = strokedCircularChartOpts
  gradientCircularChart = gradientCircularChartOpts
  semiCircleChart = semiCircleChartOpts
}
