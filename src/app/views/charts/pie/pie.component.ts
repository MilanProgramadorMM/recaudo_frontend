import { Component } from '@angular/core';
import {  gradientDonutChartOpts, imagePieChartOpts, monochromePieChartOpts, patternedDonutChartOpts, simpleDonutChartOpts, simplePieChartOpts } from './data';
import { PageTitleComponent } from "../../../components/page-title.component";
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartOptions } from '@common/apexchart.model';
import ApexCharts from 'apexcharts';

export const donutUpdateOpts: Partial<ChartOptions> = {
  chart: {
  height: 320,
  type: 'donut',
  },
  dataLabels: {
  enabled: false,
  },
  series: [44, 55, 13, 33],
  colors: ["#727cf5", "#6c757d", "#0acf97", "#fa5c7c"],
  legend: {
  show: true,
  position: 'bottom',
  horizontalAlign: 'center',
  floating: false,
  fontSize: '14px',
  offsetX: 0,
  offsetY: 7,
  },
  };
@Component({
  selector: 'pie',
  standalone: true,
  imports: [PageTitleComponent,NgApexchartsModule],
  templateUrl: './pie.component.html',
  styles: ``
})
export class PieComponent {
  simplePieChart = simplePieChartOpts
  simpleDonutChart = simpleDonutChartOpts
  monochromePieChart = monochromePieChartOpts
  gradientDonutChart = gradientDonutChartOpts
  patternedDonutChart = patternedDonutChartOpts
  imagePieChart = imagePieChartOpts
  donutUpdate = donutUpdateOpts

  chart!: ApexCharts;
series: number[] = [44, 55, 13, 33];

  ngOnInit(): void {
    this.renderChart();
    this.addEventListeners();
    }
    
    renderChart() {
      const options = {
      ...donutUpdateOpts,
      series: this.series
      };
      this.chart = new ApexCharts(document.querySelector("#donut-chart"), options);
      this.chart.render();
      }
      
      addEventListeners() {
      document.getElementById('randomize')?.addEventListener('click', () => this.randomizeChart());
      document.getElementById('add')?.addEventListener('click', () => this.addData());
      document.getElementById('remove')?.addEventListener('click', () => this.removeData());
      document.getElementById('reset')?.addEventListener('click', () => this.resetChart());
      }
      
      randomizeChart() {
      this.series = Array.from({ length: 4 }, () => Math.floor(Math.random() * 100));
      this.chart.updateSeries(this.series);
      }
    addData() {
      this.series = [...this.series, Math.floor(Math.random() * 100)];
      this.chart.updateSeries(this.series);
      }
      
      removeData() {
      this.series = this.series.slice(0, -1);
      this.chart.updateSeries(this.series);
      }
      
      resetChart() {
      this.series = [44, 55, 13, 33];
      this.chart.updateSeries(this.series);
      }
}
