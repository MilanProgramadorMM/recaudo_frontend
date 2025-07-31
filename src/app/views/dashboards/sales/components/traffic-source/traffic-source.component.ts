import { Component } from '@angular/core';
import type { ChartOptions } from '@common/apexchart.model';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'traffic-source',
  standalone: true,
  imports: [NgbDropdownModule,NgApexchartsModule],
  templateUrl: './traffic-source.component.html',
  styles: ``
})
export class TrafficSourceComponent {
  trafficChartOpts: Partial<ChartOptions> = {
    chart: {
      height: 300,
      type: 'radialBar',
    },
    plotOptions: {
      // circle: {
      //     dataLabels: {
      //         showOn: 'hover'
      //     }
      // },
      radialBar: {
        track: {
          margin:17,
          background: "rgba(170,184,197, 0.2)"
        },
        hollow: {
          size: '1%',
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            show: false,
          }
        }
      }
    },
    stroke: {
      lineCap: 'round'
    },
    colors: ['#465dff', '#6ac75a', '#783bff', '#f7577e'],
    series: [44, 55, 67, 22],
    labels: ['Completed', 'In Progress', 'Yet to Start', 'Cancelled'],
    responsive: [{
      breakpoint: 380,
      options: {
        chart: {
          height: 260,
        }
      }
    }]
  }
}
