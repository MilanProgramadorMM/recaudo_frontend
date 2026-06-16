import { Component, OnDestroy, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { SharedFilterService } from '@core/services/shared-filter.service';
import { DashboardHistorialDto, DashBoardMetrictsService } from '@core/services/dashboard-metrics.service';
import { currency } from '@common/constants';
import { DefaultResponseDto } from '@core/services/user.service';

interface GraficoConfig {
  tipo: string;
  titulo: string;
  color: string;
  colorComparacion: string;
  loading: boolean;
  errorMsg: string;
  sinDatos: boolean;
  fechaComparacion: string;
  chartSeries: any[];
  chartOpts: any;
}

@Component({
  selector: 'overview-chart',
  standalone: true,
  imports: [CommonModule, FormsModule, NgApexchartsModule],
  templateUrl: './overview-chart.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OverviewChartComponent implements OnInit, OnDestroy {

  currency = currency;
  private destroy$ = new Subject<void>();
  private currentFilters: any = null;

  graficos: GraficoConfig[] = [
    {
      tipo: 'debidocobrar',
      titulo: 'Debido a Cobrar',
      color: '#3b82f6',
      colorComparacion: '#93c5fd',
      loading: false,
      errorMsg: '',
      sinDatos: false,
      fechaComparacion: '',
      chartSeries: [],
      chartOpts: this.buildDefaultOpts('#3b82f6')
    },
    {
      tipo: 'recaudado',
      titulo: 'Recaudo',
      color: '#22c55e',
      colorComparacion: '#86efac',
      loading: false,
      errorMsg: '',
      sinDatos: false,
      fechaComparacion: '',
      chartSeries: [],
      chartOpts: this.buildDefaultOpts('#22c55e')
    },
    {
      tipo: 'nopago',
      titulo: 'No Pago',
      color: '#ef4444',
      colorComparacion: '#fca5a5',
      loading: false,
      errorMsg: '',
      sinDatos: false,
      fechaComparacion: '',
      chartSeries: [],
      chartOpts: this.buildDefaultOpts('#ef4444')
    }
  ];

  constructor(
    private sharedFilterService: SharedFilterService,
    private dashBoardMetrictsService: DashBoardMetrictsService
  ) {}

  ngOnInit(): void {
    this.sharedFilterService.filters$
      .pipe(takeUntil(this.destroy$))
      .subscribe(filters => {
        this.currentFilters = filters;
        if (filters.zonaId) {
          this.graficos.forEach(g => {
            g.fechaComparacion = '';
            g.errorMsg = '';
            g.sinDatos = false;
          });
          this.cargarTodos();
        } else {
          this.graficos.forEach(g => {
            g.chartSeries = [];
            g.sinDatos = false;
            g.errorMsg = '';
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getRango(): { fechaInicio: string; fechaFin: string } {
    const fechaFin: string = this.currentFilters.fechaFin;
    const fechaFinDate = new Date(fechaFin + 'T00:00:00');
    const fechaInicioDate = new Date(fechaFinDate);
    fechaInicioDate.setDate(fechaInicioDate.getDate() - 4);
    return {
      fechaInicio: fechaInicioDate.toISOString().split('T')[0],
      fechaFin
    };
  }

  cargarTodos(): void {
    this.graficos.forEach(g => this.cargarGrafico(g));
  }

  cargarGrafico(g: GraficoConfig): void {
    if (!this.currentFilters?.zonaId) return;

    g.loading = true;
    g.errorMsg = '';
    g.sinDatos = false;

    const { fechaInicio, fechaFin } = this.getRango();

    const principal$ = this.dashBoardMetrictsService.getHistorial(
      g.tipo, fechaInicio, fechaFin, this.currentFilters.zonaId
    );

    if (g.fechaComparacion) {
      const comparacion$ = this.dashBoardMetrictsService.getHistorial(
        g.tipo, g.fechaComparacion, g.fechaComparacion, this.currentFilters.zonaId
      );

      forkJoin([principal$, comparacion$]).subscribe({
        next: ([principal, comparacion]) => {
          const dataP = (principal as DefaultResponseDto<DashboardHistorialDto[]>).data || [];
          const dataC = (comparacion as DefaultResponseDto<DashboardHistorialDto[]>).data || [];
          this.buildChart(g, dataP, dataC);
          g.loading = false;
        },
        error: () => {
          g.errorMsg = 'Error al cargar el historial. Intente nuevamente.';
          g.loading = false;
        }
      });

    } else {
      principal$.subscribe({
        next: (res: DefaultResponseDto<DashboardHistorialDto[]>) => {
          this.buildChart(g, res.data || [], []);
          g.loading = false;
        },
        error: () => {
          g.errorMsg = 'Error al cargar el historial. Intente nuevamente.';
          g.loading = false;
        }
      });
    }
  }

  private buildChart(
    g: GraficoConfig,
    principal: DashboardHistorialDto[],
    comparacion: DashboardHistorialDto[]
  ): void {
    if (!principal.length && !comparacion.length) {
      g.sinDatos = true;
      g.chartSeries = [];
      return;
    }

    const categorias = principal.map(d => d.fecha);
    const seriePrincipal = {
      name: g.titulo,
      type: 'bar',
      data: principal.map(d => Math.abs(d.valor))
    };

    if (comparacion.length > 0) {
      const valorComp = Math.abs(comparacion[0].valor);
      const fechaComp = comparacion[0].fecha;

      g.chartSeries = [
        seriePrincipal,
        {
          name: `Referencia (${fechaComp})`,
          type: 'line',
          data: categorias.map(() => valorComp)
        }
      ];

      g.chartOpts = {
        ...this.buildDefaultOpts(g.color),
        chart: { type: 'line', height: 280, toolbar: { show: false } },
        series: g.chartSeries,
        stroke: { width: [0, 2], curve: 'straight', dashArray: [0, 6] },
        fill: { opacity: [1, 0.1] },
        markers: { size: [0, 5] },
        colors: [g.color, g.colorComparacion],
        xaxis: { categories: categorias },
        legend: { position: 'bottom' }
      };

    } else {
      g.chartSeries = [seriePrincipal];
      g.chartOpts = {
        ...this.buildDefaultOpts(g.color),
        series: g.chartSeries,
        colors: [g.color],
        xaxis: { categories: categorias }
      };
    }
  }

  onComparacionChange(g: GraficoConfig): void {
    g.errorMsg = '';
    g.sinDatos = false;
    this.cargarGrafico(g);
  }

  limpiarComparacion(g: GraficoConfig): void {
    g.fechaComparacion = '';
    g.errorMsg = '';
    g.sinDatos = false;
    this.cargarGrafico(g);
  }

  private buildDefaultOpts(color: string): any {
    return {
      chart: { type: 'bar', height: 280, toolbar: { show: false } },
      plotOptions: { bar: { borderRadius: 4, columnWidth: '55%' } },
      dataLabels: { enabled: false },
      colors: [color],
      stroke: { width: 0 },
      markers: { size: 0 },
      xaxis: { categories: [] },
      yaxis: {
        labels: { formatter: (val: number) => this.formatCurrency(val) }
      },
      tooltip: {
        y: { formatter: (val: number) => `${this.currency} ${this.formatCurrency(val)}` }
      },
      legend: { position: 'bottom' },
      grid: { borderColor: '#f1f3fa' }
    };
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }
}