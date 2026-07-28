import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { currency } from '@common/constants';
import { ZonaService, ZonaResponseDto } from '@core/services/zona.service';
import {
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexLegend,
  ApexPlotOptions,
  ApexFill,
  ApexResponsive,
} from 'ng-apexcharts';
import {
  PortfolioSnapshotService,
  ZoneSnapshotStateDto,
} from '@core/services/cartera.service';

export type MontosChartOptions = {
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

export type ConteosChartOptions = {
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

export type ParticipacionChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  responsive: ApexResponsive[];
  colors: string[];
};

interface ZonaSeleccionable extends ZonaResponseDto {
  seleccionada: boolean;
}

/**
 * Comparativo de varias zonas en una fecha específica.
 * Consume el endpoint 2: GET /portfolio-snapshots/zones?zoneIds=1,2,3&date=...
 *
 * A diferencia de app-cartera-estado y app-cartera-evolucion (que dependen
 * de la zona única seleccionada en SharedFilterService), este componente
 * tiene su PROPIO selector de zonas (multi-selección) y su propia fecha,
 * porque su propósito es justamente comparar varias zonas a la vez — no
 * tiene sentido atarlo al filtro de "una sola zona" del componente padre.
 */
@Component({
  selector: 'app-cartera-comparativo',
  standalone: true,
  imports: [CommonModule, FormsModule, NgApexchartsModule],
  templateUrl: './cartera-comparativo.component.html',
  styleUrl: './cartera-comparativo.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CarteraComparativoComponent implements OnInit {

  zonas: ZonaSeleccionable[] = [];
  fecha: string = this.formatDate(new Date());

  loadingZonas = false;
  loadingResultados = false;
  error = false;
  consultado = false;

  resultados: ZoneSnapshotStateDto[] = [];

  montosChartOptions: Partial<MontosChartOptions> = {};
  conteosChartOptions: Partial<ConteosChartOptions> = {};
  participacionChartOptions: Partial<ParticipacionChartOptions> = {};

  constructor(
    private zonaService: ZonaService,
    private portfolioSnapshotService: PortfolioSnapshotService
  ) {
    this.initEmptyChartOptions();
  }

  ngOnInit(): void {
    this.loadZonas();
  }

  private loadZonas(): void {
    this.loadingZonas = true;

    this.zonaService.getByStatus().subscribe({
      next: (response) => {
        this.zonas = response.data.map(z => ({ ...z, seleccionada: false }));
        this.loadingZonas = false;
      },
      error: (err) => {
        console.error('Error al cargar zonas para el comparativo:', err);
        this.zonas = [];
        this.loadingZonas = false;
      }
    });
  }

  toggleSeleccionarTodas(seleccionar: boolean): void {
    this.zonas.forEach(z => z.seleccionada = seleccionar);
  }

  get zonasSeleccionadas(): ZonaSeleccionable[] {
    return this.zonas.filter(z => z.seleccionada);
  }

  get puedeConsultar(): boolean {
    return this.zonasSeleccionadas.length > 0 && !!this.fecha;
  }

  consultar(): void {
    if (!this.puedeConsultar) return;

    const zoneIds = this.zonasSeleccionadas
      .map(z => z.id)
      .filter((id): id is number => id !== undefined && id !== null);

    this.loadingResultados = true;
    this.error = false;
    this.consultado = true;

    this.portfolioSnapshotService.getZonesState(zoneIds, this.fecha).subscribe({
      next: (response) => {
        this.resultados = response.data;
        this.buildCharts(response.data);
        this.loadingResultados = false;
      },
      error: (err) => {
        console.error('Error al cargar el comparativo de zonas:', err);
        this.resultados = [];
        this.initEmptyChartOptions();
        this.error = true;
        this.loadingResultados = false;
      }
    });
  }

  private buildCharts(data: ZoneSnapshotStateDto[]): void {
    if (data.length === 0) {
      this.initEmptyChartOptions();
      return;
    }

    const zonasNombres = data.map(r => r.zonaNombre);

    // Gráfico 1: barras agrupadas — montos por zona (saldo, capital, mora)
    this.montosChartOptions = {
      series: [
        { name: 'Saldo total', data: data.map(r => r.saldoTotal) },
        { name: 'Capital pendiente', data: data.map(r => r.capital.pendiente) },
        { name: 'Mora pendiente', data: data.map(r => r.mora.pendiente) },
      ],
      chart: { type: 'bar', height: 320, toolbar: { show: false } },
      xaxis: { categories: zonasNombres },
      plotOptions: { bar: { columnWidth: '55%', borderRadius: 3 } },
      dataLabels: { enabled: false },
      tooltip: { y: { formatter: (v: number) => `${this.currency} ${this.formatCurrency(v)}` } },
      legend: { position: 'top' },
      fill: { opacity: 1 },
      colors: ['#f59e0b', '#3b82f6', '#ef4444'],
    };

    // Gráfico 2: barras apiladas — conteo de créditos por zona (al día, en mora, cancelados)
    this.conteosChartOptions = {
      series: [
        { name: 'Al día', data: data.map(r => r.conteos.alDia) },
        { name: 'En mora', data: data.map(r => r.conteos.enMora) },
        { name: 'Cancelados', data: data.map(r => r.conteos.cancelados) },
      ],
      chart: { type: 'bar', height: 300, stacked: true, toolbar: { show: false } },
      xaxis: { categories: zonasNombres },
      plotOptions: { bar: { columnWidth: '45%', borderRadius: 3 } },
      dataLabels: { enabled: false },
      tooltip: {},
      legend: { position: 'top' },
      fill: { opacity: 1 },
      colors: ['#22c55e', '#ef4444', '#6b7280'],
    };

    // Gráfico 3: donut — participación de cada zona en el saldo total comparado
    this.participacionChartOptions = {
      series: data.map(r => r.saldoTotal),
      chart: { type: 'donut', height: 300 },
      labels: zonasNombres,
      dataLabels: { enabled: true, formatter: (val: number) => `${val.toFixed(1)}%` },
      tooltip: { y: { formatter: (v: number) => `${this.currency} ${this.formatCurrency(v)}` } },
      legend: { position: 'bottom' },
      responsive: [{ breakpoint: 480, options: { chart: { width: 260 }, legend: { position: 'bottom' } } }],
      colors: ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#6b7280'],
    };
  }

  private initEmptyChartOptions(): void {
    this.montosChartOptions = {
      series: [],
      chart: { type: 'bar', height: 320, toolbar: { show: false } },
      xaxis: { categories: [] },
      plotOptions: { bar: { columnWidth: '55%' } },
      dataLabels: { enabled: false },
      tooltip: {},
      legend: { position: 'top' },
      fill: { opacity: 1 },
      colors: ['#f59e0b', '#3b82f6', '#ef4444'],
    };
    this.conteosChartOptions = {
      series: [],
      chart: { type: 'bar', height: 300, stacked: true, toolbar: { show: false } },
      xaxis: { categories: [] },
      plotOptions: { bar: { columnWidth: '45%' } },
      dataLabels: { enabled: false },
      tooltip: {},
      legend: { position: 'top' },
      fill: { opacity: 1 },
      colors: ['#22c55e', '#ef4444', '#6b7280'],
    };
    this.participacionChartOptions = {
      series: [],
      chart: { type: 'donut', height: 300 },
      labels: [],
      dataLabels: { enabled: true },
      tooltip: {},
      legend: { position: 'bottom' },
      responsive: [],
      colors: ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#6b7280'],
    };
  }

  get totalCreditos(): number {
    return this.resultados.reduce((acc, r) => acc + r.conteos.total, 0);
  }

  get totalEnMora(): number {
    return this.resultados.reduce((acc, r) => acc + r.conteos.enMora, 0);
  }

  get totalAlDia(): number {
    return this.resultados.reduce((acc, r) => acc + r.conteos.alDia, 0);
  }

  get totalSaldoTotal(): number {
    return this.resultados.reduce((acc, r) => acc + r.saldoTotal, 0);
  }

  get totalCapitalPendiente(): number {
    return this.resultados.reduce((acc, r) => acc + r.capital.pendiente, 0);
  }

  get totalMoraPendiente(): number {
    return this.resultados.reduce((acc, r) => acc + r.mora.pendiente, 0);
  }

  get totalPagadoSuma(): number {
    return this.resultados.reduce((acc, r) => acc + r.totalPagado, 0);
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
}