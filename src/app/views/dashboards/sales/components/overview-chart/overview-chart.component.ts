// overview-chart.component.ts
import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import type { ChartOptions } from '@common/apexchart.model';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Subject, takeUntil } from 'rxjs';
import { SharedFilterService } from '@core/services/shared-filter.service';
import { DashboardSummaryDto, ZonaService } from '@core/services/zona.service';
import { currency } from '@common/constants';

interface OverviewDataType {
  title: string;
  count: string; 
  rawValue: number; 
  icon: string;
  variant: string;
}

@Component({
  selector: 'overview-chart',
  standalone: true,
  imports: [CommonModule, NgbDropdownModule, NgApexchartsModule],
  templateUrl: './overview-chart.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
<<<<<<< Updated upstream
export class OverviewChartComponent {
  overViewData = overViewChartData
  currency = currency
  overViewChartOpts: Partial<ChartOptions> = {
    series: [
      {
        name: "Recaudo",
        type: "bar",
        data: [
          89.25, 98.58, 68.74, 108.87, 77.54, 84.03, 51.24, 28.57, 92.57, 42.36, 88.51, 36.57,
        ],
      }, {
        name: "No pago",
        type: "bar",
        data: [
          22.25, 24.58, 36.74, 22.87, 19.54, 25.03, 29.24, 10.57, 24.57, 35.36, 20.51, 17.57,
        ],
      }, {
        name: "Debido a cobrar",
        type: "area",
        data: [34, 65, 46, 68, 49, 61, 42, 44, 78, 52, 63, 67],
      },
    ],
    chart: {
      height: 300,
      type: "line",
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: { enabled: false },
      //sparkline: { enabled: true }, // evita eventos de mouse
      events: {}, // sin listeners
    },
    stroke: {
      dashArray: [0, 0, 0, 8],
      width: [0, 0, 2, 2],
      curve: 'smooth'
    },
    fill: {
      opacity: [1, 1, 0.1, 1],
      type: ['gradient', 'solid', 'solid', 'solid'],
      gradient: {
        type: "vertical",
        //   shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 70]
      },
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
      stepSize: 25,
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
        right: -15,
        bottom: 15,
        left: -15,
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
        columnWidth: "50%",
        barHeight: "70%",
        borderRadius: 3,
      },
    },
    colors: ["#6ac75a", "#465dff", "#f8023fd8"],
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
=======

export class OverviewChartComponent implements OnInit, OnDestroy {
  loading = false;
  currency = currency;
  overViewChartOpts: Partial<ChartOptions>;
  overViewData: OverviewDataType[] = this.getEmptyData();

  private destroy$ = new Subject<void>();

  constructor(
    private sharedFilterService: SharedFilterService,
    private zonaService: ZonaService
  ) {
    this.overViewChartOpts = this.getDefaultChartOptions();
>>>>>>> Stashed changes
  }

  ngOnInit(): void {
    this.sharedFilterService.filters$
      .pipe(takeUntil(this.destroy$))
      .subscribe(filters => {
        console.log('Overview - Filtros recibidos:', filters);
        this.loadChartData(filters);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadChartData(filters: any): void {
    if (!filters.zonaId) {
      console.log('Overview - Esperando selección de zona');
      this.overViewData = this.getEmptyData();
      this.loading = false;
      return;
    }

    this.loading = true;

    this.zonaService.getDashboardSummary(
      filters.fechaInicio,
      filters.fechaFin,
      filters.zonaId
    ).subscribe({
      next: (response) => {
        console.log('Overview - Datos recibidos:', response.data);
        this.updateChartData(response.data);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar datos del gráfico:', err);
        this.overViewData = this.getEmptyData();
        this.loading = false;
      }
    });
  }

  private updateChartData(data: DashboardSummaryDto[]): void {
    const totals = data.reduce((acc, item) => ({
      recaudado: acc.recaudado + (item.totalRecaudado || 0),
      debidoCobrar: acc.debidoCobrar + (item.totalDebidoCobrar || 0),
      noPagado: acc.noPagado + (item.totalNoPagado || 0)
    }), { recaudado: 0, debidoCobrar: 0, noPagado: 0 });

    this.overViewData = [
      {
        title: 'Recaudo',
        count: this.formatCurrency(totals.recaudado), 
        rawValue: totals.recaudado,
        icon: 'ti-square-rounded-arrow-down',
        variant: 'success'
      },
      {
        title: 'Debido a cobrar',
        count: this.formatCurrency(totals.debidoCobrar), 
        rawValue: totals.debidoCobrar,
        icon: 'ti-square-rounded-arrow-up',
        variant: 'danger'
      },
      {
        title: 'No pago',
        count: this.formatCurrency(totals.noPagado), 
        rawValue: totals.noPagado,
        icon: 'ti-square-rounded-arrow-up',
        variant: 'info'
      }
    ];
  }

  private getEmptyData(): OverviewDataType[] {
    return [
      {
        title: 'Recaudo',
        count: this.formatCurrency(0),
        rawValue: 0,
        icon: 'ti-square-rounded-arrow-down',
        variant: 'success'
      },
      {
        title: 'Debido a cobrar',
        count: this.formatCurrency(0),
        rawValue: 0,
        icon: 'ti-square-rounded-arrow-up',
        variant: 'danger'
      },
      {
        title: 'No pago',
        count: this.formatCurrency(0),
        rawValue: 0,
        icon: 'ti-square-rounded-arrow-up',
        variant: 'info'
      }
    ];
  }

  // formatear moneda sin decimales
  formatCurrency(value: number): string {
    return value.toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }

  private getDefaultChartOptions(): Partial<ChartOptions> {
    return {
      series: [
        {
          name: "Recaudo",
          type: "bar",
          data: [89.25, 98.58, 68.74, 108.87, 77.54, 84.03, 51.24, 28.57, 92.57, 42.36, 88.51, 36.57],
        },
        {
          name: "No pago",
          type: "bar",
          data: [22.25, 24.58, 36.74, 22.87, 19.54, 25.03, 29.24, 10.57, 24.57, 35.36, 20.51, 17.57],
        },
        {
          name: "Debido a cobrar",
          type: "area",
          data: [34, 65, 46, 68, 49, 61, 42, 44, 78, 52, 63, 67],
        },
      ],
      chart: {
        height: 300,
        type: "line",
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      stroke: {
        dashArray: [0, 0, 8],
        width: [0, 0, 2],
        curve: 'smooth'
      },
      fill: {
        opacity: [1, 1, 0.1],
        type: ['solid', 'solid', 'solid'],
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      },
      colors: ["#6ac75a", "#465dff", "#f8023fd8"],
      legend: {
        show: true,
        horizontalAlign: "center",
      },
    };
  }
}