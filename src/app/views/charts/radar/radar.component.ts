import { Component } from '@angular/core';
import { PageTitleComponent } from "@components/page-title.component";
import type { ChartOptions } from '@common/apexchart.model';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'radar',
  standalone: true,
  imports: [PageTitleComponent,NgApexchartsModule],
  templateUrl: './radar.component.html',
  styles: ``
})
export class RadarComponent {

  basicRadarChartOpts: Partial<ChartOptions> = {
    chart: {
      height: 350,
      type: 'radar',
    },
    series: [{
      name: 'Series 1',
      data: [80, 50, 30, 40, 100, 20],
    }],
    colors: ["#727cf5"],
    labels: ['January', 'February', 'March', 'April', 'May', 'June']
  }

  polygonRadarChartOpts: Partial<ChartOptions> = {
    chart: {
      height: 350,
      type: 'radar',
    },
    series: [{
      name: 'Series 1',
      data: [20, 100, 40, 30, 50, 80, 33],
    }],
    labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    plotOptions: {
      radar: {
        size: 140,
      }
    },
    colors: ["#FF4560"],
    markers: {
      size: 4,
      colors: ['#fff'],
      // strokeColor: "#FF4560",
      strokeWidth: 2,
    },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return val
        }
      }
    },
    yaxis: {
      tickAmount: 7,
      labels: {
        formatter: function (val: any, i) {
          if (i % 2 === 0) {
            return val
          } else {
            return ''
          }
        }
      }
    }
  }

  multipleSeriesOpts: Partial<ChartOptions> = {
    chart: {
      height: 350,
      type: 'radar',
      toolbar: {
        show: false,
      },
    },
    series: [
      {
        name: 'Series 1',
        data: [80, 50, 30, 40, 100, 20],
      },
      {
        name: 'Series 2',
        data: [20, 30, 40, 80, 20, 80],
      },
      {
        name: 'Series 3',
        data: [44, 76, 78, 13, 43, 10],
      },
    ],
    stroke: {
      width: 0,
    },
    fill: {
      opacity: 0.4,
    },
    markers: {
      size: 0,
    },
    legend: {
      offsetY: -10,
    },
    colors: ["#727cf5", "#02a8b5", "#fd7e14"],
    labels: ['2011', '2012', '2013', '2014', '2015', '2016'],
  }

  changeTraffic() {
    setTimeout(() => {
      this.multipleSeriesOpts.series = [
        {
          name: 'Series 1',
          data: randomSeries(),
        },
        {
          name: 'Series 2',
          data: randomSeries(),
        },
        {
          name: 'Series 3',
          data: randomSeries(),
        },
      ]
    }, 500)
  }
}

function randomSeries() {
  var arr = []
  for (var i = 0; i < 6; i++) {
    arr.push(Math.floor(Math.random() * 100))
  }

  return arr
}