import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { SharedFilterService } from '@core/services/shared-filter.service';
import { currency } from '@common/constants';
import {
  PortfolioSnapshotService,
  ZoneSnapshotStateDto,
  CalificacionBucketDto,
  ResumenEvolucionDto
} from '@core/services/cartera.service';

interface StatCard {
  title: string;
  icon: string;
  count: string;
  rawValue: number;
  variant: string;
  /** Líneas de contexto bajo el valor: % sobre otro total, variación en el rango, etc. */
  subtitles?: string[];
}

/**
 * Muestra el estado de la cartera de la zona seleccionada a corte de
 * `filters.fechaFin` (endpoint 1 del backend): tarjetas de saldo/capital/mora,
 * conteo de créditos, cuotas y distribución de calificación de riesgo.
 *
 * Sigue siendo un snapshot puntual (una foto a `fechaFin`), no una serie —
 * para eso está app-cartera-evolucion, que usa el rango completo. Pero
 * cuando el filtro es un rango real (fechaInicio ≠ fechaFin), además se
 * consulta el endpoint 3 (getZoneHistory) solo para tomar su
 * `resumenEvolucion` y agregar, como contexto, cuánto cambió cada indicador
 * desde el inicio del rango hasta `fechaFin` — sin duplicar los gráficos que
 * ya muestra app-cartera-evolucion.
 */
@Component({
  selector: 'app-cartera-estado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cartera-estado.component.html',
  styleUrl: './cartera-estado.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CarteraEstadoComponent implements OnInit, OnDestroy {

  loading = false;
  error = false;
  /** El backend responde 404 cuando aún no existe un corte para esa fecha; no es un error real. */
  sinRegistro = false;
  currency = currency;

  estado: ZoneSnapshotStateDto | null = null;
  statCards: StatCard[] = this.getEmptyCards();
  calificaciones: CalificacionBucketDto[] = [];
  /** Fecha de corte que se muestra actualmente, para dejarla explícita en la vista. */
  fechaCorte = '';
  /** true cuando el filtro activo es un rango real (fechaInicio ≠ fechaFin). */
  esRango = false;
  /** Fecha de inicio del rango, solo para el texto informativo cuando esRango. */
  fechaInicioRango = '';

  private destroy$ = new Subject<void>();

  constructor(
    private sharedFilterService: SharedFilterService,
    private portfolioSnapshotService: PortfolioSnapshotService
  ) { }

  ngOnInit(): void {
    this.sharedFilterService.filters$
      .pipe(takeUntil(this.destroy$))
      .subscribe(filters => {
        if (filters.zonaId && filters.fechaFin) {
          this.loadEstado(filters.zonaId, filters.fechaInicio, filters.fechaFin);
        } else {
          this.estado = null;
          this.statCards = this.getEmptyCards();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadEstado(zonaId: number, fechaInicio: string, fechaFin: string): void {
    this.loading = true;
    this.error = false;
    this.sinRegistro = false;
    this.fechaCorte = fechaFin;
    this.esRango = !!fechaInicio && fechaInicio !== fechaFin;
    this.fechaInicioRango = fechaInicio;

    // El estado puntual (a corte de fechaFin) es siempre la fuente de las
    // tarjetas — el rango solo le agrega contexto de variación, no lo reemplaza.
    this.portfolioSnapshotService.getZoneState(zonaId, fechaFin).subscribe({
      next: (response) => {
        this.estado = response.data;
        this.calificaciones = response.data.distribucionCalificacion ?? [];
        this.statCards = this.buildCards(response.data);
        this.loading = false;

        if (this.esRango) {
          this.cargarVariacionDelRango(zonaId, fechaInicio, fechaFin);
        }
      },
      error: (err) => {
        this.estado = null;
        this.statCards = this.getEmptyCards();
        this.loading = false;

        // Un 404 aquí no es una falla real: solo significa que todavía no
        // existe un corte de cartera para esa fecha (p. ej. el día de hoy,
        // cuyo corte se genera al finalizar el día).
        if (err?.status === 404) {
          this.sinRegistro = true;
        } else {
          console.error('Error al cargar el estado de cartera:', err);
          this.error = true;
        }
      }
    });
  }

  /**
   * Complementa las tarjetas del estado puntual con la variación del rango
   * seleccionado (endpoint 3 — mismo `resumenEvolucion` que ya calcula
   * app-cartera-evolucion). Si ese rango no tiene snapshots (404), las
   * tarjetas simplemente se quedan sin el dato de variación — no es un error.
   */
  private cargarVariacionDelRango(zonaId: number, fechaInicio: string, fechaFin: string): void {
    this.portfolioSnapshotService.getZoneHistory(zonaId, fechaInicio, fechaFin).subscribe({
      next: (response) => this.aplicarVariacionDelRango(response.data.resumenEvolucion),
      error: () => {
        // Sin resumen de rango disponible — las tarjetas del estado puntual
        // ya están mostradas y siguen siendo válidas, solo sin ese contexto.
      }
    });
  }

  private aplicarVariacionDelRango(resumen: ResumenEvolucionDto): void {
    const variacionSaldo = this.formatVariacion(resumen.variacionSaldo, resumen.pctVariacionSaldo);
    const variacionCapital = this.formatVariacion(resumen.variacionCapitalPendiente, null);
    const variacionMora = this.formatVariacion(resumen.variacionMoraPendiente, resumen.pctVariacionMoraPendiente);
    const recuperadoEnRango = `${this.currency} ${this.formatCurrency(resumen.totalRecuperado)} recuperados en el rango`;

    this.statCards = this.statCards.map(card => {
      switch (card.title) {
        case 'Saldo total pendiente':
          return { ...card, subtitles: [...(card.subtitles ?? []), variacionSaldo] };
        case 'Total pagado':
          return { ...card, subtitles: [...(card.subtitles ?? []), recuperadoEnRango] };
        case 'Capital pendiente':
          return { ...card, subtitles: [...(card.subtitles ?? []), variacionCapital] };
        case 'Mora pendiente':
          return { ...card, subtitles: [...(card.subtitles ?? []), variacionMora] };
        default:
          return card;
      }
    });
  }

  /**
   * Texto de variación en el rango: flecha + monto absoluto + % (si el
   * backend lo trae). Un aumento de saldo/capital/mora es más deuda (▲), una
   * baja es menos deuda (▼) — se interpreta igual para los tres.
   */
  private formatVariacion(valor: number, pct: number | null): string {
    if (valor === 0) return 'Sin cambios en el rango';
    const flecha = valor > 0 ? '▲' : '▼';
    const pctTexto = pct != null ? ` (${this.formatPercent(Math.abs(pct))}%)` : '';
    return `${flecha} ${this.currency} ${this.formatCurrency(Math.abs(valor))}${pctTexto} desde el inicio del rango`;
  }

  private buildCards(data: ZoneSnapshotStateDto): StatCard[] {
    // % de mora sobre el saldo pendiente: indicador crítico de calidad de cartera.
    // Se deriva de datos ya disponibles, sin tocar el backend.
    const pctMora = data.saldoTotal > 0
      ? (data.mora.pendiente / data.saldoTotal) * 100
      : 0;

    return [
      {
        title: 'Saldo total pendiente',
        icon: 'solar:wallet-money-bold-duotone',
        count: this.formatCurrency(data.saldoTotal),
        rawValue: data.saldoTotal,
        variant: 'warning'
      },
      {
        title: 'Total pagado',
        icon: 'solar:bill-list-bold-duotone',
        count: this.formatCurrency(data.totalPagado),
        rawValue: data.totalPagado,
        variant: 'success'
      },
      {
        title: 'Capital pendiente',
        icon: 'solar:case-round-minimalistic-bold-duotone',
        count: this.formatCurrency(data.capital.pendiente),
        rawValue: data.capital.pendiente,
        variant: 'primary'
      },
      {
        title: 'Interés pendiente',
        icon: 'solar:percentage-square-bold-duotone',
        count: this.formatCurrency(data.interes.pendiente),
        rawValue: data.interes.pendiente,
        variant: 'info'
      },
      {
        title: 'Mora pendiente',
        icon: 'solar:danger-triangle-bold-duotone',
        count: this.formatCurrency(data.mora.pendiente),
        rawValue: data.mora.pendiente,
        variant: 'danger',
        subtitles: [`${this.formatPercent(pctMora)}% del saldo pendiente`]
      },
    ];
  }

  private getEmptyCards(): StatCard[] {
    return [
      { title: 'Saldo total pendiente', icon: 'solar:wallet-money-bold-duotone', count: this.formatCurrency(0), rawValue: 0, variant: 'warning' },
      { title: 'Total pagado', icon: 'solar:bill-list-bold-duotone', count: this.formatCurrency(0), rawValue: 0, variant: 'success' },
      { title: 'Capital pendiente', icon: 'solar:case-round-minimalistic-bold-duotone', count: this.formatCurrency(0), rawValue: 0, variant: 'primary' },
      { title: 'Interés pendiente', icon: 'solar:percentage-square-bold-duotone', count: this.formatCurrency(0), rawValue: 0, variant: 'info' },
      { title: 'Mora pendiente', icon: 'solar:danger-triangle-bold-duotone', count: this.formatCurrency(0), rawValue: 0, variant: 'danger' },
    ];
  }

  /**
   * Desglose financiero por concepto, para que el usuario vea de qué se
   * compone `saldoTotal`/`totalPagado` (no son solo capital + mora, sino la
   * suma de los 5 conceptos: capital, interés, seguro de vida, seguro de
   * cartera y mora).
   */
  get desgloseConceptos(): { nombre: string; generado: number; pagado: number; pendiente: number }[] {
    if (!this.estado) return [];
    return [
      { nombre: 'Capital', generado: this.estado.capital.generado, pagado: this.estado.capital.pagado, pendiente: this.estado.capital.pendiente },
      { nombre: 'Interés', generado: this.estado.interes.generado, pagado: this.estado.interes.pagado, pendiente: this.estado.interes.pendiente },
      { nombre: 'Seguro de vida', generado: this.estado.seguroVida.generado, pagado: this.estado.seguroVida.pagado, pendiente: this.estado.seguroVida.pendiente },
      { nombre: 'Seguro de cartera', generado: this.estado.seguroCartera.generado, pagado: this.estado.seguroCartera.pagado, pendiente: this.estado.seguroCartera.pendiente },
      { nombre: 'Mora', generado: this.estado.mora.generado, pagado: this.estado.mora.pagado, pendiente: this.estado.mora.pendiente },
    ];
  }

  /** Suma de lo generado en los 5 conceptos — debe coincidir con totalPagado + saldoTotal. */
  get totalGeneradoDesglose(): number {
    return this.desgloseConceptos.reduce((sum, c) => sum + c.generado, 0);
  }

  formatCurrency(value: number): string {
    return (value ?? 0).toLocaleString('es-CO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  formatPercent(value: number): string {
    return (value ?? 0).toLocaleString('es-CO', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    });
  }

  /** Calificaciones ordenadas A→E para una lectura consistente de riesgo. */
  get calificacionesOrdenadas(): CalificacionBucketDto[] {
    return [...this.calificaciones].sort((a, b) =>
      a.ratingValue.localeCompare(b.ratingValue)
    );
  }

  /** Total de créditos calificados, para calcular proporciones. */
  get totalCalificados(): number {
    return this.calificaciones.reduce((sum, c) => sum + c.cantidad, 0);
  }

  /** % que representa un bucket de calificación sobre el total calificado. */
  pctCalificacion(c: CalificacionBucketDto): number {
    const total = this.totalCalificados;
    return total > 0 ? Math.round((c.cantidad / total) * 100) : 0;
  }

  /** Color sólido de la barra de proporción por calificación (paleta del tema). */
  ratingBarClass(rating: string): string {
    switch (rating) {
      case 'A': return 'bg-success';
      case 'B': return 'bg-info';
      case 'C': return 'bg-warning';
      case 'D': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getCardStyle(variant: string) {
    switch (variant) {
      case 'success': return { background: 'linear-gradient(135deg, #22c55e, #4ade80)' };
      case 'danger': return { background: 'linear-gradient(135deg, #ef4444, #f87171)' };
      case 'primary': return { background: 'linear-gradient(135deg, #3b82f6, #60a5fa)' };
      case 'warning': return { background: 'linear-gradient(135deg, #f59e0b, #fbbf24)' };
      case 'info': return { background: 'linear-gradient(135deg, #06b6d4, #67e8f9)' };
      default: return { background: 'linear-gradient(135deg, #6b7280, #9ca3af)' };
    }
  }

  ratingBadgeClass(rating: string): string {
    switch (rating) {
      case 'A': return 'bg-success-subtle text-success';
      case 'B': return 'bg-info-subtle text-info';
      case 'C': return 'bg-warning-subtle text-warning';
      case 'D': return 'bg-danger-subtle text-danger';
      default: return 'bg-secondary-subtle text-secondary';
    }
  }
}