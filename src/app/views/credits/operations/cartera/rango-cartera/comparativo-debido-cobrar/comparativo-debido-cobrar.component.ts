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
  ApexStroke,
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
  stroke: ApexStroke;
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

  /** % recaudado sobre el valor cuota del día consultado; si no hay valor cuota, 0 */
  get porcentajeCumplimiento(): number {
    if (!this.resumen || this.resumen.totalValorCuotaNominal <= 0) return 0;
    return (this.resumen.totalRecaudado / this.resumen.totalValorCuotaNominal) * 100;
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

  private readonly barrasCategorias = ['Valor cuota', 'Recaudado', 'Pendiente', 'No pagado'];
  private readonly barrasColores = ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b'];

  private buildCharts(data: DashboardSummaryDto): void {
    // Barras: valor cuota vs recaudado vs pendiente vs no pagado (todo a la misma escala del día)
    const saldoPendiente = Math.max(data.totalValorCuotaNominal - data.totalRecaudado, 0);

    this.barrasChartOptions = {
      series: [{
        name: 'Valor',
        data: [data.totalValorCuotaNominal, data.totalRecaudado, saldoPendiente, data.totalNoPagado]
      }],
      chart: { type: 'bar', height: 320, toolbar: { show: false } },
      xaxis: {
        categories: this.barrasCategorias,
        labels: { formatter: (v: string) => this.formatCompactCurrency(Number(v)) }
      },
      plotOptions: {
        bar: { horizontal: true, borderRadius: 4, distributed: true, barHeight: '55%' }
      },
      dataLabels: {
        enabled: true,
        formatter: (v: number) => this.formatCompactCurrency(v),
        style: { fontSize: '12px', fontWeight: 600 }
      },
      tooltip: {
        y: { formatter: (v: number) => `${this.currency} ${this.formatCurrency(v)}` }
      },
      legend: { show: false },
      fill: { opacity: 1 },
      colors: this.barrasColores,
    };

    // Radial: % de cumplimiento (recaudado sobre lo debido del día)
    this.cumplimientoChartOptions = {
      series: [Math.min(this.porcentajeCumplimiento, 100)],
      chart: { type: 'radialBar', height: 320 },
      plotOptions: {
        radialBar: {
          hollow: { size: '58%' },
          track: { background: '#e5e7eb', strokeWidth: '100%' },
          dataLabels: {
            name: { show: true, fontSize: '14px', offsetY: -10 },
            value: {
              show: true, fontSize: '28px', fontWeight: 600, offsetY: 6,
              formatter: (val: number) => `${val.toFixed(1)}%`
            }
          }
        }
      },
      stroke: { lineCap: 'round' },
      labels: ['Cumplimiento'],
      colors: [this.porcentajeCumplimiento >= 100 ? '#22c55e'
        : this.porcentajeCumplimiento >= 60 ? '#f59e0b' : '#ef4444'],
    };
  }

  private initEmptyCharts(): void {
    this.barrasChartOptions = {
      series: [],
      chart: { type: 'bar', height: 320, toolbar: { show: false } },
      xaxis: { categories: this.barrasCategorias },
      plotOptions: { bar: { horizontal: true, barHeight: '55%' } },
      dataLabels: { enabled: false },
      tooltip: {},
      legend: { show: false },
      fill: { opacity: 1 },
      colors: this.barrasColores,
    };
    this.cumplimientoChartOptions = {
      series: [],
      chart: { type: 'radialBar', height: 320 },
      plotOptions: { radialBar: { hollow: { size: '58%' }, track: { background: '#e5e7eb' } } },
      stroke: { lineCap: 'round' },
      labels: ['Cumplimiento'],
      colors: ['#3b82f6'],
    };
  }

  /** Formato compacto para etiquetas de gráfico: 1.7M, 606K, etc. */
  formatCompactCurrency(value: number): string {
    const v = value ?? 0;
    const abs = Math.abs(v);
    if (abs >= 1_000_000) return `${this.currency} ${(v / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `${this.currency} ${(v / 1_000).toFixed(1)}K`;
    return `${this.currency} ${this.formatCurrency(v)}`;
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


    get getSaldoPendienteDelDia(): number {
    if (!this.resumen || this.resumen.totalValorCuotaNominal <= 0) return 0;
    return (this.resumen.totalValorCuotaNominal - this.resumen.totalRecaudado);
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
