import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { SharedFilterService } from '@core/services/shared-filter.service';
import { DashboardSummaryDto, ZonaService } from '@core/services/zona.service';
import { currency } from '@common/constants';

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
  styles: ``,
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class StatsComponent implements OnInit, OnDestroy {
  statData: StatType[] = this.getEmptyStats();
  loading = false;
  currency = currency;
  private destroy$ = new Subject<void>();

  constructor(
    private sharedFilterService: SharedFilterService,
    private zonaService: ZonaService
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

  loadDashboardData(filters: any): void {
    this.loading = true;

    this.zonaService.getDashboardSummary(
      filters.fechaInicio,
      filters.fechaFin,
      filters.zonaId
    ).subscribe({
      next: (response) => {
        console.log('Stats - Datos recibidos:', response.data);
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

  private updateStats(data: DashboardSummaryDto[]): void {
    const totals = data.reduce((acc, item) => ({
      debidoCobrar: acc.debidoCobrar + (item.totalDebidoCobrar || 0),
      recaudado: acc.recaudado + (item.totalRecaudado || 0),
      noPagado: acc.noPagado + (item.totalNoPagado || 0),
    }), { debidoCobrar: 0, recaudado: 0, noPagado: 0 });

    const totalCartera = totals.debidoCobrar + totals.recaudado;

    this.statData = [
      {
        title: 'Debido a Cobrar',
        icon: 'solar:case-round-minimalistic-bold-duotone',
        count: this.formatCurrency(totals.debidoCobrar),
        rawValue: totals.debidoCobrar
      },
      {
        title: 'Recaudo',
        icon: 'solar:bill-list-bold-duotone',
        count: this.formatCurrency(totals.recaudado),
        rawValue: totals.recaudado
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
        variant: 'success'
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

}
