import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { SharedFilterService } from '@core/services/shared-filter.service';
import { currency } from '@common/constants';
import {
  PortfolioSnapshotService,
  ZoneSnapshotStateDto,
  CalificacionBucketDto
} from '@core/services/cartera.service';

interface StatCard {
  title: string;
  icon: string;
  count: string;
  rawValue: number;
  variant: string;
  subtitle?: string;
}

/**
 * Muestra el estado de la cartera de la zona seleccionada, "como si fuera
 * hoy" (endpoint 1 del backend): tarjetas de saldo/capital/mora, conteo de
 * créditos, cuotas y distribución de calificación de riesgo.
 *
 * Usa `filters.fechaFin` como la fecha "a corte de", ya que es un snapshot
 * puntual (una foto), no un rango — mientras que app-cartera-evolucion sí
 * usa el rango completo (fechaInicio..fechaFin).
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
  currency = currency;

  estado: ZoneSnapshotStateDto | null = null;
  statCards: StatCard[] = this.getEmptyCards();
  calificaciones: CalificacionBucketDto[] = [];

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
          this.loadEstado(filters.zonaId, filters.fechaFin);
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

  private loadEstado(zonaId: number, fecha: string): void {
    this.loading = true;
    this.error = false;

    this.portfolioSnapshotService.getZoneState(zonaId, fecha).subscribe({
      next: (response) => {
        this.estado = response.data;
        this.calificaciones = response.data.distribucionCalificacion ?? [];
        this.statCards = this.buildCards(response.data);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar el estado de cartera:', err);
        this.estado = null;
        this.statCards = this.getEmptyCards();
        this.error = true;
        this.loading = false;
      }
    });
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
        title: 'Mora pendiente',
        icon: 'solar:danger-triangle-bold-duotone',
        count: this.formatCurrency(data.mora.pendiente),
        rawValue: data.mora.pendiente,
        variant: 'danger',
        subtitle: `${this.formatPercent(pctMora)}% del saldo pendiente`
      },
    ];
  }

  private getEmptyCards(): StatCard[] {
    return [
      { title: 'Saldo total pendiente', icon: 'solar:wallet-money-bold-duotone', count: this.formatCurrency(0), rawValue: 0, variant: 'warning' },
      { title: 'Total pagado', icon: 'solar:bill-list-bold-duotone', count: this.formatCurrency(0), rawValue: 0, variant: 'success' },
      { title: 'Capital pendiente', icon: 'solar:case-round-minimalistic-bold-duotone', count: this.formatCurrency(0), rawValue: 0, variant: 'primary' },
      { title: 'Mora pendiente', icon: 'solar:danger-triangle-bold-duotone', count: this.formatCurrency(0), rawValue: 0, variant: 'danger' },
    ];
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