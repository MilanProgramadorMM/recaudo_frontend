import { Component, OnDestroy, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Subject, takeUntil } from 'rxjs';
import { SharedFilterService } from '@core/services/shared-filter.service';
import { DashboardHistorialDto, DashBoardMetrictsService } from '@core/services/dashboard-metrics.service';
import { currency } from '@common/constants';
import { DefaultResponseDto } from '@core/services/user.service';

/** El valor actual siempre se compara contra el día anterior. */
const OFFSET_COMPARACION = 1;
const LABEL_COMPARACION = '';

/**
 * Qué significa que el valor SUBA para cada métrica, para pintar el delta en
 * verde/rojo con el sentido correcto (más recaudo es bueno, más no-pago es malo).
 */
type Polaridad = 'positiva' | 'negativa' | 'neutral';

interface GraficoConfig {
  tipo: string;
  titulo: string;
  color: string;
  colorMuted: string;
  polaridad: Polaridad;
  loading: boolean;
  errorMsg: string;
  sinDatos: boolean;
  /** Histórico diario (hasta 30 días), orden ascendente por fecha. */
  historial: DashboardHistorialDto[];
  /** Los últimos SPARKLINE_DIAS puntos que se graficaron (mismo orden que chartSeries[0].data). */
  sparklinePuntos: DashboardHistorialDto[];
  /** Índice del punto enfocado (hover o tap); null = mostrar el de hoy por defecto. */
  focoIndex: number | null;
  chartSeries: any[];
  chartOpts: any;
}

const SPARKLINE_DIAS = 14;

@Component({
  selector: 'overview-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
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
      titulo: 'Valor cuota',
      color: '#3b82f6',
      colorMuted: '#bfdbfe',
      polaridad: 'neutral',
      loading: false,
      errorMsg: '',
      sinDatos: false,
      historial: [],
      sparklinePuntos: [],
      focoIndex: null,
      chartSeries: [],
      chartOpts: {}
    },
    {
      tipo: 'recaudado',
      titulo: 'Recaudo',
      color: '#22c55e',
      colorMuted: '#bbf7d0',
      polaridad: 'positiva',
      loading: false,
      errorMsg: '',
      sinDatos: false,
      historial: [],
      sparklinePuntos: [],
      focoIndex: null,
      chartSeries: [],
      chartOpts: {}
    },
    {
      tipo: 'nopago',
      titulo: 'No Pago',
      color: '#ef4444',
      colorMuted: '#fecaca',
      polaridad: 'negativa',
      loading: false,
      errorMsg: '',
      sinDatos: false,
      historial: [],
      sparklinePuntos: [],
      focoIndex: null,
      chartSeries: [],
      chartOpts: {}
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
            g.errorMsg = '';
            g.sinDatos = false;
          });
          this.cargarTodos();
        } else {
          this.graficos.forEach(g => {
            g.historial = [];
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

  /** Ventana de 30 días terminando en la fecha de filtro: cubre sparkline + los 3 períodos de comparación. */
  private getRango(): { fechaInicio: string; fechaFin: string } {
    const fechaFin: string = this.currentFilters.fechaFin;
    const fechaFinDate = new Date(fechaFin + 'T00:00:00');
    const fechaInicioDate = new Date(fechaFinDate);
    fechaInicioDate.setDate(fechaInicioDate.getDate() - 29);
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

    this.dashBoardMetrictsService.getHistorial(g.tipo, fechaInicio, fechaFin, this.currentFilters.zonaId)
      .subscribe({
        next: (res: DefaultResponseDto<DashboardHistorialDto[]>) => {
          const valorPorFecha = new Map<string, number>();
          (res.data || []).forEach(d => {
            const fecha = this.normalizeFecha((d as any).fecha);
            if (fecha) valorPorFecha.set(fecha, d.valor);
          });

          // Se rellena cada día del rango, aunque el backend no traiga registro para
          // ese día (p. ej. una zona sin "no pago" hoy) — así el último día del
          // rango es SIEMPRE hoy, con 0 si no hay dato, y nunca se arrastra el
          // valor de un día anterior como si fuera el de hoy.
          g.historial = this.generarRangoFechas(fechaInicio, fechaFin)
            .map(fecha => ({ fecha, valor: valorPorFecha.get(fecha) ?? 0 }));
          g.sinDatos = valorPorFecha.size === 0;
          if (!g.sinDatos) this.buildSparkline(g);
          g.loading = false;
        },
        error: () => {
          g.errorMsg = 'Error al cargar el historial. Intente nuevamente.';
          g.loading = false;
        }
      });
  }

  private generarRangoFechas(fechaInicio: string, fechaFin: string): string[] {
    const fechas: string[] = [];
    const actual = new Date(`${fechaInicio}T00:00:00`);
    const fin = new Date(`${fechaFin}T00:00:00`);
    while (actual <= fin) {
      fechas.push(actual.toISOString().split('T')[0]);
      actual.setDate(actual.getDate() + 1);
    }
    return fechas;
  }

  private buildSparkline(g: GraficoConfig): void {
    const puntos = g.historial.slice(-SPARKLINE_DIAS);
    const ultimoIndex = puntos.length - 1;
    g.sparklinePuntos = puntos;
    g.focoIndex = null;

    g.chartSeries = [{
      name: g.titulo,
      data: puntos.map(d => Math.abs(d.valor))
    }];

    g.chartOpts = {
      chart: {
        type: 'bar', height: 220, sparkline: { enabled: true },
        animations: { enabled: true, easing: 'easeinout', speed: 450 },
        events: {
          // Pasar el mouse muestra el detalle de esa barra; tocarla (touch) lo deja fijo.
          dataPointMouseEnter: (_e: any, _ctx: any, opts: any) => { g.focoIndex = opts.dataPointIndex; },
          dataPointMouseLeave: () => { g.focoIndex = null; },
          dataPointSelection: (_e: any, _ctx: any, opts: any) => { g.focoIndex = opts.dataPointIndex; }
        }
      },
      plotOptions: { bar: { borderRadius: 4, columnWidth: '65%' } },
      // Solo se etiqueta la barra de hoy, para no saturar el gráfico de números.
      dataLabels: {
        enabled: true,
        offsetY: -6,
        style: { fontSize: '10px', fontWeight: 700, colors: [g.color] },
        formatter: (val: number, opts: any) => opts.dataPointIndex === ultimoIndex ? this.formatCurrency(val) : ''
      },
      states: {
        hover: { filter: { type: 'lighten', value: 0.08 } },
        active: { filter: { type: 'darken', value: 0.1 } }
      },
      // Día actual resaltado en el color de la métrica; el resto en su tono tenue.
      colors: [({ dataPointIndex }: any) => dataPointIndex === ultimoIndex ? g.color : g.colorMuted],
      tooltip: {
        x: { formatter: (_val: number, opts: any) => this.formatFechaCompleta(puntos[opts.dataPointIndex]?.fecha) },
        y: { formatter: (val: number) => `${this.currency} ${this.formatCurrency(val)}` }
      }
    };
  }

  /** Texto dinámico: el día enfocado (hover/tap) o, por defecto, hoy. */
  diaFocoTexto(g: GraficoConfig): string {
    if (!g.sparklinePuntos.length) return '';
    const ultimo = g.sparklinePuntos.length - 1;
    const idx = g.focoIndex ?? ultimo;
    const punto = g.sparklinePuntos[idx];
    const etiqueta = idx === ultimo ? 'Hoy' : this.formatFechaCompleta(punto.fecha);
    return `${etiqueta} · ${this.currency} ${this.formatCurrency(Math.abs(punto.valor))}`;
  }

  // ───────────────────────── KPI: valor actual, delta, período ─────────────────────────

  valorActual(g: GraficoConfig): number {
    if (!g.historial.length) return 0;
    return Math.abs(g.historial[g.historial.length - 1].valor);
  }

  private valorEnOffset(g: GraficoConfig, offset: number): number | null {
    const idx = g.historial.length - 1 - offset;
    if (idx < 0) return null;
    return Math.abs(g.historial[idx].valor);
  }

  tieneComparacion(g: GraficoConfig): boolean {
    return this.valorEnOffset(g, OFFSET_COMPARACION) !== null;
  }

  private deltaAbsoluto(g: GraficoConfig): number | null {
    const comp = this.valorEnOffset(g, OFFSET_COMPARACION);
    if (comp === null) return null;
    return this.valorActual(g) - comp;
  }

  private deltaPorcentaje(g: GraficoConfig): number | null {
    const comp = this.valorEnOffset(g, OFFSET_COMPARACION);
    if (comp === null || comp === 0) return null;
    return ((this.valorActual(g) - comp) / comp) * 100;
  }

  deltaTexto(g: GraficoConfig): string {
    const pct = this.deltaPorcentaje(g);
    if (pct !== null) {
      const signo = pct > 0 ? '+' : '';
      return `${signo}${pct.toFixed(1)}%`;
    }
    const abs = this.deltaAbsoluto(g);
    if (abs === null) return '';
    const signo = abs > 0 ? '+' : '';
    return `${signo}${this.currency}${this.formatCurrency(abs)}`;
  }

  claseDelta(g: GraficoConfig): string {
    const delta = this.deltaAbsoluto(g);
    if (!delta) return 'text-muted';
    if (g.polaridad === 'neutral') return 'text-primary';
    const subida = delta > 0;
    const esBueno = (g.polaridad === 'positiva' && subida) || (g.polaridad === 'negativa' && !subida);
    return esBueno ? 'text-success' : 'text-danger';
  }

  iconoDelta(g: GraficoConfig): string {
    const delta = this.deltaAbsoluto(g);
    if (!delta) return 'ti-minus';
    return delta > 0 ? 'ti-trending-up' : 'ti-trending-down';
  }

  periodoLabel(): string {
    return LABEL_COMPARACION;
  }

  diasEnSparkline(g: GraficoConfig): number {
    return Math.min(g.historial.length, SPARKLINE_DIAS);
  }

  // ───────────────────────── Formato ─────────────────────────

  formatCurrency(value: number): string {
    return (value ?? 0).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  private static readonly DIAS_SEMANA = [
    'domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'
  ];

  /** "2026-09-02" -> "miércoles 02-09-2026" */
  private formatFechaCompleta(fecha?: string): string {
    if (!fecha) return '';
    const [anio, mes, dia] = fecha.split('-');
    const diaSemana = OverviewChartComponent.DIAS_SEMANA[new Date(`${fecha}T00:00:00`).getDay()];
    return `${diaSemana} ${dia}-${mes}-${anio}`;
  }

  /**
   * El backend puede serializar la fecha como string "YYYY-MM-DD", como
   * LocalDate tipo Jackson ([year, month, day]), como epoch (number) o como
   * Date. Se normaliza siempre a "YYYY-MM-DD" para poder ordenar y comparar.
   */
  private normalizeFecha(fecha: unknown): string {
    if (typeof fecha === 'string') {
      return fecha.split('T')[0];
    }
    if (Array.isArray(fecha) && fecha.length >= 3) {
      const [anio, mes, dia] = fecha;
      return `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    }
    if (fecha instanceof Date) {
      return fecha.toISOString().split('T')[0];
    }
    if (typeof fecha === 'number') {
      return new Date(fecha).toISOString().split('T')[0];
    }
    return '';
  }
}
