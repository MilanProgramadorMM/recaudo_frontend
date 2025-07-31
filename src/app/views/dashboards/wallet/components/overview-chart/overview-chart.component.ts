import { Component } from '@angular/core';
import type { ChartOptions } from '@common/apexchart.model';
import { currency } from '@common/constants';
import { FlatpickrDirective } from '@core/directive/flatpickr.directive';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'wallet-overview-chart',
  standalone: true,
  imports: [FlatpickrDirective,NgApexchartsModule],
  templateUrl: './overview-chart.component.html',
  styles: ``
})
export class OverviewChartComponent {
  currency=currency
  overviewChartOpts: Partial<ChartOptions> = {
    series: [{
      name: "Total Income",
      type: "bar",
      data: [
        89.25, 98.58, 68.74, 108.87, 77.54, 84.03, 51.24, 28.57, 92.57, 42.36, 88.51, 36.57,
      ],
    }, {
      name: "Total Expense",
      type: "area",
      data: [34, 65, 46, 68, 49, 61, 42, 44, 78, 52, 63, 67],
    }, {
      name: "Investment",
      type: "bar",
      data: [8, 12, 7, 17, 21, 11, 5, 9, 7, 29, 12, 35],
    }],
    chart: {
      height: 375,
      type: "line",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      dashArray: [0, 6, 0],
      width: [0, 2, 0],
      curve: 'smooth'
    },
    fill: {
      opacity: [1, 0.1, 1]
    },
    markers: {
      size: [0, 0, 0, 0],
      strokeWidth: 2,
      hover: {
        size: 4,
      },
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      min: 0,
      labels: {
        formatter: function (val) {
          return val + "k";
        },
      },
      axisBorder: {
        show: false,
      }
    },
    grid: {
      show: true,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 0,
        right: -2,
        bottom: 15,
        left: 10,
      },
    },
    legend: {
      show: true,
      horizontalAlign: "center",
      offsetX: 0,
      offsetY: -5,
      markers: {
        // width: 9,
        // height: 9,
        // radius: 6,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 0,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "30%",
        barHeight: "70%",
        borderRadius: 3,
      },
    },
    colors: ["#465dff", "#6ac75a", "#f9c45c"],
    tooltip: {
      shared: true,
      y: [{
        formatter: function (y) {
          if (typeof y !== "undefined") {
            return "$" + y.toFixed(2) + "k";
          }
          return y;
        },
      },
      {
        formatter: function (y) {
          if (typeof y !== "undefined") {
            return "$" + y.toFixed(2) + "k";
          }
          return y;
        },
      },
      {
        formatter: function (y) {
          if (typeof y !== "undefined") {
            return "$" + y.toFixed(2) + "k";
          }
          return y;
        },
      },
      {
        formatter: function (y) {
          if (typeof y !== "undefined") {
            return "$" + y.toFixed(2) + "k";
          }
          return y;
        },
      },
      ],
    },
  }

}
