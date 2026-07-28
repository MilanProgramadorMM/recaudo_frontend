import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { SharedFilterService } from '@core/services/shared-filter.service';
import { currency } from '@common/constants';
import {
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexStroke,
  ApexDataLabels,
  ApexTooltip,
  ApexLegend,
  ApexPlotOptions,
  ApexFill,
  ApexGrid,
  ApexMarkers,
} from 'ng-apexcharts';
import {
  PortfolioSnapshotService,
  ZoneHistoryAnalysisDto,
  BackendDate,
} from '@core/services/cartera.service';
import { normalizeBackendDate } from '@core/services/date-utils';

export type SaldoChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  markers: ApexMarkers;
  grid: ApexGrid;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  colors: string[];
};

export type TransicionesChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  plotOptions: ApexPlotOptions;
  grid: ApexGrid;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  fill: ApexFill;
  colors: string[];
};

/**
 * Muestra la evolución histórica de la cartera de la zona seleccionada
 * dentro del rango de fechas del filtro (endpoint 3 del backend).
 *
 * A diferencia de app-cartera-estado (que usa solo fechaFin como una foto
 * puntual), este componente usa fechaInicio Y fechaFin como el rango
 * completo a analizar.
 *
 * Requiere la librería ng-apexcharts. Si el proyecto no la tiene instalada:
 *   npm install apexcharts ng-apexcharts
 */
@Component({
  selector: 'app-cartera-evolucion',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './cartera-evolucion.component.html',
  styleUrl: './cartera-evolucion.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CarteraEvolucionComponent implements OnInit, OnDestroy {

  loading = false;
  error = false;
  sinDatos = false;
  currency = currency;

  historia: ZoneHistoryAnalysisDto | null = null;

  saldoChartOptions: Partial<SaldoChartOptions> = {};
  transicionesChartOptions: Partial<TransicionesChartOptions> = {};

  private destroy$ = new Subject<void>();

  constructor(
    private sharedFilterService: SharedFilterService,
    private portfolioSnapshotService: PortfolioSnapshotService
  ) {
    this.initEmptyChartOptions();
  }

  ngOnInit(): void {
    this.sharedFilterService.filters$
      .pipe(takeUntil(this.destroy$))
      .subscribe(filters => {
        if (filters.zonaId && filters.fechaInicio && filters.fechaFin) {
          this.loadHistoria(filters.zonaId, filters.fechaInicio, filters.fechaFin);
        } else {
          this.historia = null;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadHistoria(zonaId: number, fechaInicio: string, fechaFin: string): void {
    this.loading = true;
    this.error = false;
    this.sinDatos = false;

    this.portfolioSnapshotService.getZoneHistory(zonaId, fechaInicio, fechaFin).subscribe({
      next: (response) => {
        this.historia = response.data;
        this.buildCharts(response.data);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar la evolución histórica de cartera:', err);
        this.historia = null;

        // El backend responde 404 (ResourceNotFoundException) cuando no hay
        // snapshots en el rango — eso no es un error real, es "sin datos".
        if (err?.status === 404) {
          this.sinDatos = true;
        } else {
          this.error = true;
        }
        this.loading = false;
      }
    });
  }

  private buildCharts(data: ZoneHistoryAnalysisDto): void {
    const fechasSerie = data.serie.map(p => normalizeBackendDate(p.fecha));

    this.saldoChartOptions = {
      series: [
        { name: 'Saldo total', data: data.serie.map(p => p.saldoTotal) },
        { name: 'Capital pendiente', data: data.serie.map(p => p.capitalPendiente) },
        { name: 'Mora pendiente', data: data.serie.map(p => p.moraPendiente) },
      ],
      chart: { type: 'line', height: 320, toolbar: { show: false } },
      xaxis: { categories: fechasSerie },
      stroke: { curve: 'smooth', width: 2 },
      markers: { size: 0, hover: { size: 5 } },
      grid: { borderColor: '#f1f3fa', strokeDashArray: 3 },
      dataLabels: { enabled: false },
      tooltip: {
        shared: true,
        y: { formatter: (v: number) => `${this.currency} ${this.formatCurrency(v)}` },
      },
      legend: { position: 'bottom' },
      colors: ['#f59e0b', '#3b82f6', '#ef4444'],
    };

    const fechasTransiciones = data.transiciones.map(t => normalizeBackendDate(t.fecha));

    this.transicionesChartOptions = {
      series: [
        { name: 'Ingresaron a mora', data: data.transiciones.map(t => t.ingresaronMora) },
        { name: 'Salieron de mora', data: data.transiciones.map(t => t.salieronMora) },
        { name: 'Cancelados', data: data.transiciones.map(t => t.cancelados) },
      ],
      chart: { type: 'bar', height: 280, toolbar: { show: false }, stacked: false },
      xaxis: { categories: fechasTransiciones },
      plotOptions: { bar: { columnWidth: '55%', borderRadius: 4 } },
      grid: { borderColor: '#f1f3fa', strokeDashArray: 3 },
      dataLabels: { enabled: false },
      tooltip: {
        shared: true,
        intersect: false,
        y: { formatter: (v: number) => `${v} créditos` },
      },
      legend: { position: 'bottom' },
      fill: { opacity: 1 },
      colors: ['#ef4444', '#22c55e', '#6b7280'],
    };
  }

  private initEmptyChartOptions(): void {
    this.saldoChartOptions = {
      series: [],
      chart: { type: 'line', height: 320, toolbar: { show: false } },
      xaxis: { categories: [] },
      stroke: { curve: 'smooth', width: 2 },
      markers: { size: 0 },
      grid: { borderColor: '#f1f3fa', strokeDashArray: 3 },
      dataLabels: { enabled: false },
      tooltip: {},
      legend: { position: 'bottom' },
      colors: ['#f59e0b', '#3b82f6', '#ef4444'],
    };
    this.transicionesChartOptions = {
      series: [],
      chart: { type: 'bar', height: 280, toolbar: { show: false } },
      xaxis: { categories: [] },
      plotOptions: { bar: { columnWidth: '55%' } },
      grid: { borderColor: '#f1f3fa', strokeDashArray: 3 },
      dataLabels: { enabled: false },
      tooltip: {},
      legend: { position: 'bottom' },
      fill: { opacity: 1 },
      colors: ['#ef4444', '#22c55e', '#6b7280'],
    };
  }

  formatCurrency(value: number): string {
    return (value ?? 0).toLocaleString('es-CO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  /** Para saldo/capital: un aumento es negativo (rojo) porque implica más deuda pendiente. */
  variacionClass(value: number): string {
    if (value > 0) return 'text-danger';
    if (value < 0) return 'text-success';
    return 'text-muted';
  }

  /** Ícono de tendencia direccional (accesible, no depende solo del color). */
  trendIcon(value: number): string {
    if (value > 0) return 'ti ti-trending-up';
    if (value < 0) return 'ti ti-trending-down';
    return 'ti ti-minus';
  }

  /** Normaliza la fecha del backend (array [y,m,d]) a 'yyyy-MM-dd' legible en la tabla. */
  formatFecha(raw: BackendDate): string {
    return normalizeBackendDate(raw);
  }
}