import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { currency } from '@common/constants';
import { ZonaService, ZonaResponseDto } from '@core/services/zona.service';
import {
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexLegend,
  ApexPlotOptions,
  ApexFill,
} from 'ng-apexcharts';
import {
  DashBoardMetrictsService,
  DashboardSummaryDto,
} from '@core/services/dashboard-metrics.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDetalleConsultaComponent } from '@views/dashboards/consultas/modal-detalle-consulta/modal-detalle-consulta.component';
import { MatDialog } from '@angular/material/dialog';
export type BarrasChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  fill: ApexFill;
  colors: string[];
};

export type CumplimientoChartOptions = {
  series: number[];
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  labels: string[];
  colors: string[];
};

@Component({
  selector: 'app-debido-cobrar-comparativo',
  standalone: true,
  imports: [CommonModule, FormsModule, NgApexchartsModule],
  templateUrl: './comparativo-debido-cobrar.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComparativoDebidoCobrarComponent {


  zonas: ZonaResponseDto[] = [];
  zonaId: number | null = null;
  fecha: string = this.formatDate(new Date());

  loadingZonas = false;
  loadingResultado = false;
  error = false;
  consultado = false;

  resumen: DashboardSummaryDto | null = null;

  barrasChartOptions: Partial<BarrasChartOptions> = {};
  cumplimientoChartOptions: Partial<CumplimientoChartOptions> = {};

  constructor(
    private zonaService: ZonaService,
    private dashboardService: DashBoardMetrictsService,
    private dialog: MatDialog
  ) {
    this.initEmptyCharts();
  }

  ngOnInit(): void {
    this.loadZonas();
  }

  private loadZonas(): void {
    this.loadingZonas = true;
    this.zonaService.getByStatus().subscribe({
      next: (response) => {
        this.zonas = response.data;
        this.loadingZonas = false;
      },
      error: (err) => {
        console.error('Error al cargar zonas:', err);
        this.zonas = [];
        this.loadingZonas = false;
      }
    });
  }

  get puedeConsultar(): boolean {
    return this.zonaId !== null && !!this.fecha;
  }

  get zonaNombre(): string {
    return this.zonas.find(z => z.id === this.zonaId)?.value ?? '';
  }

  /** % recaudado sobre lo debido; si no hay debido, 0 */
  get porcentajeCumplimiento(): number {
    if (!this.resumen || this.resumen.totalDebidoCobrar <= 0) return 0;
    return (this.resumen.totalRecaudado / this.resumen.totalDebidoCobrar) * 100;
  }

  consultar(): void {
    if (!this.puedeConsultar || this.zonaId === null) return;

    this.loadingResultado = true;
    this.error = false;
    this.consultado = true;

    // fecha única: inicio y fin son el mismo día
    this.dashboardService.getData(this.fecha, this.fecha, this.zonaId).subscribe({
      next: (response) => {
        this.resumen = response.data;
        this.buildCharts(response.data);
        this.loadingResultado = false;
      },
      error: (err) => {
        console.error('Error al consultar el comparativo:', err);
        this.resumen = null;
        this.initEmptyCharts();
        this.error = true;
        this.loadingResultado = false;
      }
    });
  }

  private buildCharts(data: DashboardSummaryDto): void {
    // Barras: debido cobrar vs recaudado vs cartera (lo que falta)
    this.barrasChartOptions = {
      series: [{
        name: 'Valor',
        data: [data.totalDebidoCobrar, data.totalRecaudado, data.totalCartera]
      }],
      chart: { type: 'bar', height: 320, toolbar: { show: false } },
      xaxis: { categories: ['Valor cuota', 'Recaudado', 'Pendiente'] },
      plotOptions: { bar: { columnWidth: '45%', borderRadius: 4, distributed: true } },
      dataLabels: {
        enabled: true,
        formatter: (v: number) => `${this.currency} ${this.formatCurrency(v)}`
      },
      tooltip: { y: { formatter: (v: number) => `${this.currency} ${this.formatCurrency(v)}` } },
      legend: { show: false },
      fill: { opacity: 1 },
      colors: ['#3b82f6', '#22c55e', '#ef4444'],
    };

    // Radial: % de cumplimiento
    this.cumplimientoChartOptions = {
      series: [Math.min(this.porcentajeCumplimiento, 100)],
      chart: { type: 'radialBar', height: 320 },
      plotOptions: {
        radialBar: {
          hollow: { size: '60%' },
          dataLabels: {
            name: { show: true, fontSize: '14px', offsetY: 20 },
            value: {
              show: true, fontSize: '28px', fontWeight: 600, offsetY: -10,
              formatter: (val: number) => `${val.toFixed(1)}%`
            }
          }
        }
      },
      labels: ['Cumplimiento'],
      colors: [this.porcentajeCumplimiento >= 100 ? '#22c55e'
        : this.porcentajeCumplimiento >= 60 ? '#f59e0b' : '#ef4444'],
    };
  }

  private initEmptyCharts(): void {
    this.barrasChartOptions = {
      series: [],
      chart: { type: 'bar', height: 320, toolbar: { show: false } },
      xaxis: { categories: [] },
      plotOptions: { bar: { columnWidth: '45%' } },
      dataLabels: { enabled: false },
      tooltip: {},
      legend: { show: false },
      fill: { opacity: 1 },
      colors: ['#3b82f6', '#22c55e', '#ef4444'],
    };
    this.cumplimientoChartOptions = {
      series: [],
      chart: { type: 'radialBar', height: 320 },
      plotOptions: { radialBar: { hollow: { size: '60%' } } },
      labels: ['Cumplimiento'],
      colors: ['#3b82f6'],
    };
  }

  formatCurrency(value: number): string {
    return (value ?? 0).toLocaleString('es-CO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  get currency() {
    return currency;
  }

  private formatDate(date: Date): string {
    return date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' +
      String(date.getDate()).padStart(2, '0');
  }

  verDetalleRecaudos(): void {
    if (this.zonaId === null) return;
    this.dialog.open(ModalDetalleConsultaComponent, {
      width: '95vw',
      maxWidth: '1200px',
      data: {
        type: 'MOVIMIENTOS_POR_ZONA',
        zoneId: this.zonaId,
        zoneName: this.zonaNombre,
        startDate: this.fecha,
        endDate: this.fecha
      }
    });
  }

  verDetalleDebidoCobrar(): void {
    if (this.zonaId === null) return;
    this.dialog.open(ModalDetalleConsultaComponent, {
      width: '95vw',
      maxWidth: '1200px',
      data: {
        type: 'DEBIDO_COBRAR_DETALLE',
        zoneId: this.zonaId,
        zoneName: this.zonaNombre,
        startDate: this.fecha,
        endDate: this.fecha
      }
    });
  }
}
