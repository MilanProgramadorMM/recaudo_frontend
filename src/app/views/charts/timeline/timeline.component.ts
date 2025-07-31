import { Component } from '@angular/core';
import { advancedTimelineChartOpts, basicTimelineChartOpts, distributedTimelineChartOpts, groupTimelineChartOpts, multiSeriesTimelineChartOpts } from './data';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PageTitleComponent } from "../../../components/page-title.component";

@Component({
  selector: 'timeline',
  standalone: true,
  imports: [NgApexchartsModule, PageTitleComponent],
  templateUrl: './timeline.component.html',
  styles: ``
})

export class TimelineComponent {
  basicTimelineChart = basicTimelineChartOpts
  distributedTimelineChart = distributedTimelineChartOpts
  multiSeriesTimelineChart = multiSeriesTimelineChartOpts
  advancedTimelineChart = advancedTimelineChartOpts
  groupTimelineChart = groupTimelineChartOpts
}
