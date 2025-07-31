import { Component } from '@angular/core';
import { PageTitleComponent } from "@components/page-title.component";
import { NgApexchartsModule } from 'ng-apexcharts';
import { basicBoxplotChartOpts, horizontalBoxPlotChartOpts, scatterBoxplotChartOpts } from './data';

@Component({
  selector: 'boxplot',
  standalone: true,
  imports: [PageTitleComponent, NgApexchartsModule],
  templateUrl: './boxplot.component.html',
  styles: ``
})
export class BoxplotComponent {
  basicBoxplotChart = basicBoxplotChartOpts
  scatterBoxplotChart = scatterBoxplotChartOpts
  horizontalBoxPlotChart = horizontalBoxPlotChartOpts
}
