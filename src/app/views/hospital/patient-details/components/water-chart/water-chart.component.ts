import { Component } from '@angular/core';
import type { ChartOptions } from '@common/apexchart.model';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'water-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './water-chart.component.html',
  styles: ``
})
export class WaterChartComponent {

  waterChartOpts: Partial<ChartOptions> = {
    chart: {
      type: "bar",
      height: 200,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60%",
        borderRadius: 4,
      },
    },
    colors: ["#465dff"],
    series: [
      {
        data: [2, 3, 2, 7, 4, 2, 3],
      },
    ],
    xaxis: {
      categories: ["S", "M", "T", "W", "T", "F", "S"],
      labels: {
        style: {
          colors: ["#39afd1", "#ffbc00"],
          fontSize: "14px",
        },
      },
    },
    legend: {
      offsetY: 7,
    },
    grid: {
      row: {
        colors: ["transparent", "transparent"], // takes an array which will be repeated on columns
        opacity: 0.2,
      },
      borderColor: "#f1f3fa",
    },
  }
}
