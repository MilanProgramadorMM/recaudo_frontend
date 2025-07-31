import { Component } from '@angular/core';
import { PageTitleComponent } from "@components/page-title.component";
import { bubble3DChartOpts, simpleBubbleChartOpts } from './data';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'bubble',
  standalone: true,
  imports: [PageTitleComponent,NgApexchartsModule],
  templateUrl: './bubble.component.html',
  styles: ``
})
export class BubbleComponent {
  simpleBubbleChart = simpleBubbleChartOpts
  bubble3dChart = bubble3DChartOpts
}
