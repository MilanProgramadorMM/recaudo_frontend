import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { SharedFilterService } from '@core/services/shared-filter.service';
import { ZonaService } from '@core/services/zona.service';
import { currency } from '@common/constants';
import { DashBoardMetrictsService, DashboardSummaryDto } from '@core/services/dashboard-metrics.service';

interface StatType {
  title: string;
  icon: string;
  count: string;
  rawValue: number;
  variant?: string;
}

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StatsComponent implements OnInit, OnDestroy {
  statData: StatType[] = this.getEmptyStats();
  loading = false;
  currency = currency;
  private destroy$ = new Subject<void>();
  @Output() cardSelected = new EventEmitter<{ tipo: string; titulo: string; color: string }>();

  private tipoMap = ['debidocobrar', 'recaudado', 'nopago', 'cartera'];
  private colorMap = ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b'];


  constructor(
    private sharedFilterService: SharedFilterService,
    private zonaService: ZonaService,
    private dashBoardMetrictsService: DashBoardMetrictsService
  ) { }

  ngOnInit(): void {
    // Escuchar cambios en los filtros
    this.sharedFilterService.filters$
      .pipe(takeUntil(this.destroy$))
      .subscribe(filters => {
        console.log('Stats - Filtros recibidos:', filters);

        if (filters.zonaId) {
          this.loadDashboardData(filters);
        } else {
          console.log('Stats - Esperando selección de zona');
          this.statData = this.getEmptyStats();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCardClick(index: number): void {
  if (index === 3) return; // cartera no tiene acción
  const item = this.statData[index];
  this.cardSelected.emit({
    tipo: this.tipoMap[index],
    titulo: item.title,
    color: this.colorMap[index]
  });
}

  // loadDashboardDataOld(filters: any): void {
  //   this.loading = true;

  //   this.zonaService.getDashboardSummary(
  //     filters.fechaInicio,
  //     filters.fechaFin,
  //     filters.zonaId
  //   ).subscribe({
  //     next: (response) => {
  //       console.log('Stats - Datos recibidos:', response.data);
  //       this.updateStats(response.data);
  //       this.loading = false;
  //     },
  //     error: (err) => {
  //       console.error('Error al cargar dashboard:', err);
  //       this.statData = this.getEmptyStats();
  //       this.loading = false;
  //     }
  //   });
  // }

  loadDashboardData(filters: any): void {
    this.loading = true;

    this.dashBoardMetrictsService.getData(
      filters.fechaInicio,
      filters.fechaFin,
      filters.zonaId
    ).subscribe({
      next: (response) => {
        this.updateStats(response.data);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar dashboard:', err);
        this.statData = this.getEmptyStats();
        this.loading = false;
      }
    });
  }

  private updateStatsOld(data: DashboardSummaryDto[]): void {
    const totals = data.reduce((acc, item) => ({
      debidoCobrar: acc.debidoCobrar + (item.totalDebidoCobrar || 0),
      recaudado: acc.recaudado + (item.totalRecaudado || 0) * -1,
      noPagado: acc.noPagado + (item.totalNoPagado || 0),
    }), { debidoCobrar: 0, recaudado: 0, noPagado: 0 });

    const totalCartera = totals.debidoCobrar + (totals.recaudado * -1);

    this.statData = [
      {
        title: 'Debido a Cobrar',
        icon: 'solar:case-round-minimalistic-bold-duotone',
        count: this.formatCurrency(totals.debidoCobrar),
        rawValue: totals.debidoCobrar,
        variant: 'primary'
      },
      {
        title: 'Recaudo',
        icon: 'solar:bill-list-bold-duotone',
        count: this.formatCurrency(totals.recaudado),
        rawValue: totals.recaudado,
        variant: 'success'
      },
      {
        title: 'No pago',
        icon: 'solar:wallet-money-bold-duotone',
        count: this.formatCurrency(totals.noPagado),
        rawValue: totals.noPagado,
        variant: 'danger'
      },
      {
        title: 'Total cartera',
        icon: 'solar:eye-bold-duotone',
        count: this.formatCurrency(totalCartera),
        rawValue: totalCartera,
        variant: 'warning'
      },
    ];
  }

  private updateStats(data: DashboardSummaryDto): void {
    this.statData = [
      {
        title: 'Debido a Cobrar',
        icon: 'solar:case-round-minimalistic-bold-duotone',
        count: this.formatCurrency(data.totalDebidoCobrar),
        rawValue: data.totalDebidoCobrar,
        variant: 'primary'
      },
      {
        title: 'Recaudo',
        icon: 'solar:bill-list-bold-duotone',
        count: this.formatCurrency(data.totalRecaudado),
        rawValue: data.totalRecaudado,
        variant: 'success'
      },
      {
        title: 'No pago',
        icon: 'solar:wallet-money-bold-duotone',
        count: this.formatCurrency(data.totalNoPagado),
        rawValue: data.totalNoPagado,
        variant: 'danger'
      },
      {
        title: 'Total cartera',
        icon: 'solar:eye-bold-duotone',
        count: this.formatCurrency(data.totalCartera),
        rawValue: data.totalCartera,
        variant: 'warning'
      },
    ];
  }

  private getEmptyStats(): StatType[] {
    return [
      {
        title: 'Debido a Cobrar',
        icon: 'solar:case-round-minimalistic-bold-duotone',
        count: this.formatCurrency(0),
        rawValue: 0
      },
      {
        title: 'Recaudo',
        icon: 'solar:bill-list-bold-duotone',
        count: this.formatCurrency(0),
        rawValue: 0
      },
      {
        title: 'No pago',
        icon: 'solar:wallet-money-bold-duotone',
        count: this.formatCurrency(0),
        rawValue: 0,
        variant: 'danger'
      },
      {
        title: 'Total cartera',
        icon: 'solar:eye-bold-duotone',
        count: this.formatCurrency(0),
        rawValue: 0,
        variant: 'success'
      },
    ];
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('es-CO', {
      minimumFractionDigits: 0,  // ✅ Sin decimales
      maximumFractionDigits: 0   // ✅ Sin decimales
    });
  }

  getColor(variant: string): string {
    switch (variant) {
      case 'success': return '#198754';
      case 'danger': return '#DC3545';
      case 'warning': return '#FFC107';
      case 'primary': return '#0D6EFD';
      default: return '#6c757d';
    }
  }

  getCardStyle(variant: string) {
    switch (variant) {
      case 'success':
        return { background: 'linear-gradient(135deg, #22c55e, #4ade80)' };
      case 'danger':
        return { background: 'linear-gradient(135deg, #ef4444, #f87171)' };
      case 'primary':
        return { background: 'linear-gradient(135deg, #3b82f6, #60a5fa)' };
      case 'warning':
        return { background: 'linear-gradient(135deg, #f59e0b, #fbbf24)' };
      default:
        return { background: 'linear-gradient(135deg, #6b7280, #9ca3af)' };
    }
  }

}
