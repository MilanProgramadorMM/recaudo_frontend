import { Component } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { candlestickLineChartOpts, categoryChartChartOpts, combobarChart, comboChart, simpleCandlestickChartOpts } from './data';
import { PageTitleComponent } from "../../../components/page-title.component";

@Component({
  selector: 'candlestick',
  standalone: true,
  imports: [NgApexchartsModule, PageTitleComponent],
  templateUrl: './candlestick.component.html',
  styles: ``
})
export class CandlestickComponent {
  simpleChart = simpleCandlestickChartOpts
  categoryChartChart = categoryChartChartOpts
  candlestickLineChart = candlestickLineChartOpts
  comboChart = comboChart
  combobarChart = combobarChart
}
