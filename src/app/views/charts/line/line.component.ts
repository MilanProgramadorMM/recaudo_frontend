import { Component } from '@angular/core';
import { PageTitleComponent } from "../../../components/page-title.component";
import { annotationsChartOpts, brushChartOpts, brushChartOpts2, dashedLineChartOpts, gradientLineChartOpts, lineWithDataChartOpts, missingNullValuesChartOpts, simpleLineChartOpts, stepLineChartOpts, syncingChartOpts, syncingChartOpts2, zoomableTimeseriesChartOpts } from './data';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'line',
  standalone: true,
  imports: [PageTitleComponent,NgApexchartsModule],
  templateUrl: './line.component.html',
  styles: ``
})
export class LineComponent {
  simpleLineChartOpts = simpleLineChartOpts
  lineWithDataChartOpts = lineWithDataChartOpts
  zoomableTimeseriesChartOpts = zoomableTimeseriesChartOpts
  annotationsChartOpts = annotationsChartOpts
  syncingChartOpts = syncingChartOpts
  syncingChartOpts2 = syncingChartOpts2
  gradientLineChartOpts = gradientLineChartOpts
  missingNullValuesChartOpts = missingNullValuesChartOpts
  dashedLineChartOpts = dashedLineChartOpts
  stepLineChartOpts = stepLineChartOpts
  brushChartOpts = brushChartOpts
  brushChartOpts2 = brushChartOpts2
}
