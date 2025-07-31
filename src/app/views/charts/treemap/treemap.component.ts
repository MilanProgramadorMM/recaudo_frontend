import { Component } from '@angular/core';
import { PageTitleComponent } from "@components/page-title.component";
import { basicTreemapChartOpts, colorTreemapChartOpts, distributedTreemapChartOpts, multipleTreemapChartOpts } from './data';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'treemap',
  standalone: true,
  imports: [PageTitleComponent,NgApexchartsModule],
  templateUrl: './treemap.component.html',
  styles: ``
})

export class TreemapComponent {
  basicTreemapChart = basicTreemapChartOpts
  multipleTreemapChart = multipleTreemapChartOpts
  distributedTreemapChart = distributedTreemapChartOpts
  colorTreemapChart = colorTreemapChartOpts
}
