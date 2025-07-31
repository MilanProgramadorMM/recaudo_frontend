import { Component } from '@angular/core';
import { PageTitleComponent } from '@components/page-title.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { basicBarChartOpts, DataLabelsChartOpts, fullStackedBarChartOpts, groupedChartOpts, imageBarChartOpts, markersBarChartOpts, negativeBarChartOpts, patternBarChartOpts, reversedBarChartOpts, stackedBarChartOpts } from './data';

@Component({
  selector: 'bar',
  standalone: true,
  imports: [PageTitleComponent, NgApexchartsModule],
  templateUrl: './bar.component.html',
  styles: ``
})
export class BarComponent {
  basicBarChart = basicBarChartOpts
  groupedChart = groupedChartOpts
  stackedBarChart = stackedBarChartOpts
  fullStackedBarChart = fullStackedBarChartOpts
  negativeBarChart = negativeBarChartOpts
  reversedBarChart = reversedBarChartOpts
  imageBarChart = imageBarChartOpts
  patternBarChart = patternBarChartOpts
  DataLabelsChartOpts =DataLabelsChartOpts
  markersBarChart = markersBarChartOpts
}
