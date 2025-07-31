import { Component } from '@angular/core';
import type { ChartOptions } from '@common/apexchart.model';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'gender-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './gender-chart.component.html',
  styles: ``
})
export class GenderChartComponent {
   genderChartOpts:Partial<ChartOptions> = {
    chart: {
      height: 233,
      type: 'donut',
    },
    legend: {
      show: false
    },
    stroke: {
      width: 0
    },
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: true,
            total: {
              showAlways: true,
              show: true
            }
          }
        }
      }
    },
    series: [159.5, 148.56, 45.2],
    labels: ["Male", "Female", "Child"],
    colors: ["#465dff", "#6ac75a", "#67baf1"],
    dataLabels: {
      enabled: false
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        }
      }
    }]
  }
}
