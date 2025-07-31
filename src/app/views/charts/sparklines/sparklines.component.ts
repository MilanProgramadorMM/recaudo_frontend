import { Component } from '@angular/core';
import { PageTitleComponent } from "@components/page-title.component";
import { NgApexchartsModule } from 'ng-apexcharts';
import { chart1Opts, chart2Opts, chart3Opts, chart4Opts, chart5Opts, chart6Opts, chart7Opts, chart8Opts, spark1ChartOpts, spark2ChartOpts, spark3ChartOpts } from './data';
import { currency } from '@common/constants';

@Component({
  selector: 'sparklines',
  standalone: true,
  imports: [PageTitleComponent,NgApexchartsModule],
  templateUrl: './sparklines.component.html',
  styles: ``
})
export class SparklinesComponent {
  currency=currency
  spark1ChartOpts = spark1ChartOpts
  spark2ChartOpts = spark2ChartOpts
  spark3ChartOpts = spark3ChartOpts
  chart1Opts = chart1Opts
  chart5Opts = chart5Opts
  chart2Opts = chart2Opts
  chart6Opts = chart6Opts
  chart3Opts = chart3Opts
  chart4Opts = chart4Opts
  chart7Opts = chart7Opts
  chart8Opts = chart8Opts
}
