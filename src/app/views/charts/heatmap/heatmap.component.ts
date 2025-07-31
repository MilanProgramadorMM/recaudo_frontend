import { Component } from '@angular/core';
import { PageTitleComponent } from '@components/page-title.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { basicHeatmapChartOpts, HeatmapColorRangeChartOpts, HeatmapRangeShadesChartOpts, multipleSeriesHeatmapChartOpts } from './data';

@Component({
  selector: 'heatmap',
  standalone: true,
  imports: [NgApexchartsModule, PageTitleComponent],
  templateUrl: './heatmap.component.html',
  styles: ``
})
export class HeatmapComponent {
  basicHeatmapChart = basicHeatmapChartOpts
  multipleSeriesHeatmapChart = multipleSeriesHeatmapChartOpts
  HeatmapColorRangeChart = HeatmapColorRangeChartOpts
  HeatmapRangeShadesChart = HeatmapRangeShadesChartOpts
}
