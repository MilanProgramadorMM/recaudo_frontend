import { Component } from '@angular/core';
import type { ChartOptions } from '@common/apexchart.model';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'patient-chart',
  standalone: true,
  imports: [NgApexchartsModule,NgbDropdownModule],
  templateUrl: './patient-chart.component.html',
  styles: ``
})
export class PatientChartComponent {
  patientStatisticChartOpts: Partial<ChartOptions> = {
    chart: {
      height: 232,
      type: "donut",
    },
    series: [4, 7],
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      // verticalAlign: "middle",
      floating: false,
      fontSize: "14px",
      offsetX: 0,
      offsetY: 7,
    },
    labels: ["Analysis 4", "Visits 7"],
    colors: ["#39afd1", "#ffbc00"],
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            height: 240,
          },
          legend: {
            show: false,
          },
        },
      },
    ],
  }
}
