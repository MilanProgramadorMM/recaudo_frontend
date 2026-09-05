import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexStroke,
  ApexDataLabels,
  ApexTooltip,
  ApexLegend,
  ApexPlotOptions,
  ApexFill,
  ApexMarkers,
  ApexGrid,
} from 'ng-apexcharts';
import { currency } from '@common/constants';
import {
  BackendDate,
  ClientHistoryAnalysisDto,
  ClientPortfolioStateDto,
  PortfolioSnapshotService,
  PuntoHistoricoClienteDto,
} from '@core/services/cartera.service';
import { CreditResponseDto, CreditService } from '@core/services/credit.service';
import { RecaudoModalComponent } from '@views/credits/recaudo-modal/recaudo-modal.component';

export type EvolucionChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  markers: ApexMarkers;
  grid: ApexGrid;
  colors: string[];
};

export type CreditosChartOptions = {
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

/**
 * Detalle de la cartera de un cliente.
 *
 * Se compone de tres bloques con dependencias distintas:
 *
 *  1. Cartera activa  → endpoint 5, depende de la FECHA puntual seleccionada.
 *  2. Evolución       → endpoint 6, depende del RANGO de fechas seleccionado.
 *  3. Historial de créditos → GET /credits/get-by-person/{id}. NO depende de
 *     ninguna fecha: trae el estado real y actual de cada crédito, porque el
 *     recorrido de un crédito es un hecho fijo y no debe aparecer/desaparecer
 *     según la fecha que el usuario mueva.
 */
@Component({
  selector: 'app-cliente-cartera-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NgApexchartsModule],
  templateUrl: './cliente-cartera-modal.component.html',
  styleUrl: './cliente-cartera-modal.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ClienteCarteraModalComponent implements OnInit {

  @Input() personId!: number;
  @Input() clienteFullname = '';
  @Input() clienteDocumento = '';
  /** Fecha heredada del listado; es el punto de partida de ambos bloques. */
  @Input() fecha: string = this.formatDate(new Date());

  startDate = '';
  endDate = '';

  estado: ClientPortfolioStateDto | null = null;
  historial: ClientHistoryAnalysisDto | null = null;
  creditos: CreditResponseDto[] = [];

  loadingEstado = false;
  loadingHistorial = false;
  loadingCreditos = false;

  errorEstado = false;
  errorHistorial = false;
  errorCreditos = false;

  /** El backend responde 404 cuando no hay snapshot: no es un error real. */
  sinCartera = false;
  sinHistorial = false;

  evolucionChartOptions: Partial<EvolucionChartOptions> = {};
  creditosChartOptions: Partial<CreditosChartOptions> = {};

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private portfolioSnapshotService: PortfolioSnapshotService,
    private creditService: CreditService
  ) {
    this.initEmptyChartOptions();
  }

  ngOnInit(): void {
    // Rango por defecto: los 30 días previos a la fecha seleccionada.
    const hasta = this.parseIsoDate(this.fecha);
    const desde = new Date(hasta);
    desde.setDate(desde.getDate() - 30);

    this.endDate = this.formatDate(hasta);
    this.startDate = this.formatDate(desde);

    this.cargarEstado();
    this.cargarHistorial();
    this.cargarCreditos();
  }

  // ── 1. Cartera activa (fecha puntual) ───────────────────────────────────────

  cargarEstado(): void {
    if (!this.fecha) return;

    this.loadingEstado = true;
    this.errorEstado = false;
    this.sinCartera = false;

    this.portfolioSnapshotService.getClientState(this.personId, this.fecha).subscribe({
      next: (response) => {
        this.estado = response.data;
        this.loadingEstado = false;
      },
      error: (err) => {
        if (err?.status === 404) {
          this.estado = null;
          this.sinCartera = true;
        } else {
          console.error('Error al cargar el estado de cartera del cliente:', err);
          this.estado = null;
          this.errorEstado = true;
        }
        this.loadingEstado = false;
      },
    });
  }

  // ── 2. Evolución (rango de fechas) ──────────────────────────────────────────

  cargarHistorial(): void {
    if (!this.startDate || !this.endDate) return;

    this.loadingHistorial = true;
    this.errorHistorial = false;
    this.sinHistorial = false;

    this.portfolioSnapshotService
      .getClientHistory(this.personId, this.startDate, this.endDate)
      .subscribe({
        next: (response) => {
          this.historial = response.data;
          this.buildCharts(response.data.serie ?? []);
          this.loadingHistorial = false;
        },
        error: (err) => {
          this.historial = null;
          this.initEmptyChartOptions();

          if (err?.status === 404) {
            this.sinHistorial = true;
          } else {
            console.error('Error al cargar la evolución del cliente:', err);
            this.errorHistorial = true;
          }
          this.loadingHistorial = false;
        },
      });
  }

  /** Se dispara al cambiar fecha o rango en los controles del modal. */
  recargar(): void {
    this.cargarEstado();
    this.cargarHistorial();
  }

  get rangoValido(): boolean {
    return !!this.startDate && !!this.endDate && this.startDate <= this.endDate;
  }

  // ── 3. Historial de créditos (independiente de la fecha) ────────────────────

  private cargarCreditos(): void {
    this.loadingCreditos = true;
    this.errorCreditos = false;

    this.creditService.getCreditsbyPersonId(this.personId).subscribe({
      next: (response) => {
        this.creditos = response.data ?? [];
        this.loadingCreditos = false;
      },
      error: (err) => {
        console.error('Error al cargar el historial de créditos del cliente:', err);
        this.creditos = [];
        this.errorCreditos = true;
        this.loadingCreditos = false;
      },
    });
  }

  // ── Gráficos ────────────────────────────────────────────────────────────────

  private buildCharts(serie: PuntoHistoricoClienteDto[]): void {
    if (serie.length === 0) {
      this.initEmptyChartOptions();
      return;
    }

    const categorias = serie.map((p) => this.formatShortDate(p.fecha));

    // Evolución de montos en el tiempo
    this.evolucionChartOptions = {
      series: [
        { name: 'Saldo total', data: serie.map((p) => p.saldoTotal) },
        { name: 'Capital pendiente', data: serie.map((p) => p.capitalPendiente) },
        { name: 'Mora pendiente', data: serie.map((p) => p.moraPendiente) },
      ],
      chart: { type: 'line', height: 320, toolbar: { show: false }, zoom: { enabled: false } },
      xaxis: { categories: categorias, tickAmount: 10 },
      yaxis: {
        labels: { formatter: (v: number) => this.formatCompact(v) },
      },
      stroke: { curve: 'smooth', width: 2 },
      dataLabels: { enabled: false },
      tooltip: {
        y: { formatter: (v: number) => `${this.currency} ${this.formatCurrency(v)}` },
      },
      legend: { position: 'top' },
      markers: { size: 0, hover: { size: 4 } },
      grid: { borderColor: '#e5e7eb', strokeDashArray: 3 },
      colors: ['#f59e0b', '#3b82f6', '#ef4444'],
    };

    // Conteo de créditos activos vs en mora en el tiempo
    this.creditosChartOptions = {
      series: [
        { name: 'Al día', data: serie.map((p) => (p.creditosActivos ?? 0) - (p.creditosEnMora ?? 0)) },
        { name: 'En mora', data: serie.map((p) => p.creditosEnMora) },
      ],
      chart: { type: 'bar', height: 240, stacked: true, toolbar: { show: false } },
      xaxis: { categories: categorias, tickAmount: 10 },
      plotOptions: { bar: { columnWidth: '55%', borderRadius: 2 } },
      dataLabels: { enabled: false },
      tooltip: {},
      legend: { position: 'top' },
      fill: { opacity: 1 },
      colors: ['#22c55e', '#ef4444'],
    };
  }

  private initEmptyChartOptions(): void {
    this.evolucionChartOptions = {
      series: [],
      chart: { type: 'line', height: 320, toolbar: { show: false } },
      xaxis: { categories: [] },
      yaxis: {},
      stroke: { curve: 'smooth', width: 2 },
      dataLabels: { enabled: false },
      tooltip: {},
      legend: { position: 'top' },
      markers: { size: 0 },
      grid: { borderColor: '#e5e7eb', strokeDashArray: 3 },
      colors: ['#f59e0b', '#3b82f6', '#ef4444'],
    };
    this.creditosChartOptions = {
      series: [],
      chart: { type: 'bar', height: 240, stacked: true, toolbar: { show: false } },
      xaxis: { categories: [] },
      plotOptions: { bar: { columnWidth: '55%' } },
      dataLabels: { enabled: false },
      tooltip: {},
      legend: { position: 'top' },
      fill: { opacity: 1 },
      colors: ['#22c55e', '#ef4444'],
    };
  }

  // ── Helpers de presentación ────────────────────────────────────────────────

  get zonasTexto(): string {
    return this.estado?.zonas?.length ? this.estado.zonas.join(', ') : '—';
  }

  variacionClass(valor: number | null | undefined, mayorEsMejor = false): string {
    const v = valor ?? 0;
    if (v === 0) return 'text-muted';
    const positivo = v > 0;
    return positivo === mayorEsMejor ? 'text-success' : 'text-danger';
  }

  variacionIcon(valor: number | null | undefined): string {
    const v = valor ?? 0;
    if (v === 0) return 'ti ti-minus';
    return v > 0 ? 'ti ti-arrow-up-right' : 'ti ti-arrow-down-right';
  }

  /** Color del borde del stat-tile, misma polaridad que variacionClass (menos es mejor). */
  variacionTileClass(valor: number | null | undefined, mayorEsMejor = false): string {
    const v = valor ?? 0;
    if (v === 0) return 'stat-neutral';
    const positivo = v > 0;
    return positivo === mayorEsMejor ? 'stat-success' : 'stat-danger';
  }

  estadoCreditoBadge(estado: string): string {
    switch ((estado ?? '').toUpperCase()) {
      case 'ACTIVE':
        return 'bg-success-subtle text-success';
      case 'CANCELLED':
        return 'bg-secondary-subtle text-secondary';
      case 'INACTIVE':
        return 'bg-warning-subtle text-warning';
      default:
        return 'bg-light text-muted';
    }
  }

  moraBadgeClass(diasMora: number | null): string {
    const dias = diasMora ?? 0;
    if (dias === 0) return 'bg-success-subtle text-success';
    if (dias <= 30) return 'bg-warning-subtle text-warning';
    if (dias <= 60) return 'bg-orange-subtle text-orange';
    return 'bg-danger-subtle text-danger';
  }

  formatCurrency(value: number | null | undefined): string {
    return (value ?? 0).toLocaleString('es-CO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  private formatCompact(value: number): string {
    const v = value ?? 0;
    if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
    if (Math.abs(v) >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
    return `${v}`;
  }

  get currency() {
    return currency;
  }

  trackByCreditId(_index: number, credito: CreditResponseDto): number {
    return credito.id;
  }

  /**
   * "Cartera activa" y "Evolución" son un consolidado de los créditos ACTIVOS
   * del cliente. La tabla de historial solo muestra esos mismos créditos —
   * para ver créditos cancelados/inactivos habría que ir a otra pantalla.
   */
  get creditosActivos(): CreditResponseDto[] {
    return this.creditos.filter(c => (c.creditStatus ?? '').toUpperCase() === 'ACTIVE');
  }

  /**
   * El backend serializa LocalDate como [year, month, day].
   * Si ya tienes `normalizeBackendDate` en core/utils/date-utils.ts,
   * reemplaza este helper por ese para no duplicar lógica.
   */
  toDate(value: BackendDate | null | undefined): Date | null {
    if (!value) return null;
    if (Array.isArray(value)) {
      const [y, m, d] = value;
      return new Date(y, m - 1, d);
    }
    return this.parseIsoDate(value);
  }

  formatShortDate(value: BackendDate | null | undefined): string {
    const date = this.toDate(value);
    if (!date) return '—';
    return String(date.getDate()).padStart(2, '0') + '/' +
      String(date.getMonth() + 1).padStart(2, '0');
  }

  formatLongDate(value: BackendDate | null | undefined): string {
    const date = this.toDate(value);
    if (!date) return '—';
    return this.formatDate(date);
  }

  private parseIsoDate(value: string): Date {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, (m ?? 1) - 1, d ?? 1);
  }

  private formatDate(date: Date): string {
    return date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' +
      String(date.getDate()).padStart(2, '0');
  }

  verDetalleCredito(credito: CreditResponseDto): void {
    const modalRef = this.modalService.open(RecaudoModalComponent, {
      size: 'xl',
      backdrop: 'static',
      keyboard: true,
      centered: true,
      scrollable: true,
      windowClass: 'modal-extra-large'
    });

    modalRef.componentInstance.creditId = credito.id;
    modalRef.componentInstance.creditIntentionId = credito.creditIntentionId;
  }
}