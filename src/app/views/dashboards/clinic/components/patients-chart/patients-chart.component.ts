import { Component } from '@angular/core';
import type { ChartOptions } from '@common/apexchart.model';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'patients-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './patients-chart.component.html',
  styles: ``
})
export class PatientsChartComponent {
  patientsChartOpts:  Partial<ChartOptions> = {
    series: [{
      name: 'Out Patient',
      type: 'bar',
      data: [16, 19, 19, 16, 16, 14, 15, 15, 17, 17, 19, 19, 18, 18, 20, 20, 18, 18, 22, 22, 20, 20, 18, 18, 20, 20, 18, 20, 20, 22]
    }, {
      name: 'In Patient',
      data: [21, 24, 24, 21, 21, 19, 20, 20, 22, 22, 24, 24, 23, 23, 25, 25, 23, 23, 27, 27, 25, 25, 23, 23, 25, 25, 23, 25, 25, 27]
    }],
    chart: {
      type: 'area',
      height: 345,
      toolbar: {
        show: false
      },
      offsetX: 0,
      offsetY: 2
    },
    stroke: {
      width: [0, 2],
      dashArray: [5, 0],
    },
    colors: ["#465dff", "#783bff"],
    grid: {
      strokeDashArray: 7,
      padding: {
        top: 0,
        right: -10,
        bottom: 15,
        left: -10,
      },
    },
    // zoom: {
    //   enabled: false
    // },
    xaxis: {
      // type: 'string',
      axisBorder: {
        show: false,
      },
      labels: {
        offsetY: 2
      },
    },
    yaxis: {
      tickAmount: 3,
      min: 0,
      labels: {
        formatter: function (val) {
          return val + "k";
        },
        offsetX: -15
      },
      axisBorder: {
        show: false,
      }
    },
    legend: {
      show: true,
      horizontalAlign: "center",
      offsetX: 0,
      offsetY: 5,
      markers: {
        // width: 9,
        // height: 9,
        // radius: 6,
      },
      itemMargin: {
        horizontal: 5,
        vertical: 0,
      },
    },
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 0,
    },
    tooltip: {
      x: {
        format: 'dd MMM yyyy'
      }
    },
    fill: {
      opacity: [1, 0.5],
      type: ['solid', 'gradient'],
      gradient: {
        type: "vertical",
        inverseColors: false,
        opacityFrom: 0.35,
        opacityTo: 0,
        stops: [0, 80]
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "50%",
        barHeight: "70%",
        borderRadius: 3,
      },
    },
  }

}
