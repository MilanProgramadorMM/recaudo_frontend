import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { SharedFilterService } from '@core/services/shared-filter.service';
import { ZonaService } from '@core/services/zona.service';
import { currency } from '@common/constants';
import { DashBoardMetrictsService, DashboardSummaryDto } from '@core/services/dashboard-metrics.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ModalDetalleConsultaComponent } from '@views/dashboards/consultas/modal-detalle-consulta/modal-detalle-consulta.component';

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
  private currentZonaId: number | null = null;
  private currentZonaName = '';
  private currentFecha = '';

  private tipoMap = ['valorcuota', 'recaudado', 'nopago', 'cartera', 'debidocobrar'];
  private colorMap = ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b', '#8b5cf6'];

  constructor(
    private sharedFilterService: SharedFilterService,
    private zonaService: ZonaService,
    private dashBoardMetrictsService: DashBoardMetrictsService,
    private dialog: MatDialog,
    private router: Router
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
    //debugger;
    if (this.currentZonaId === null) return;

    switch (index) {
      case 0: // Valor cuota
        this.abrirModalDetalle('DEBIDO_COBRAR_DETALLE');
        break;
      case 1: // Recaudo
        this.abrirModalDetalle('MOVIMIENTOS_POR_ZONA');
        break;
      case 2: // No pago -> no hay modal para este type
        // sin acción (ver nota abajo)
        break;
      case 3: // Cartera -> redirige a la vista de cartera
        this.router.navigate(['consultas/dashboards-cartera']);
        break;
      case 4: // Debido cobrar
        this.abrirModalDetalle('SALDOS_VENCIDOS');
        break;
    }
  }

  private abrirModalDetalle(type: string): void {
    this.dialog.open(ModalDetalleConsultaComponent, {
      width: '95vw',
      maxWidth: '1200px',
      data: {
        type: type,
        zoneId: this.currentZonaId,
        zoneName: this.currentZonaName,
        startDate: this.currentFecha,
        endDate: this.currentFecha
      }
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
    this.currentZonaId = filters.zonaId;
    this.currentZonaName = filters.zonaName ?? '';
    this.currentFecha = filters.fechaFin ?? filters.fechaInicio;

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
        title: 'Valor cuota',
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
        title: 'Valor cuota',
        icon: 'solar:case-round-minimalistic-bold-duotone',
        count: this.formatCurrency(data.totalValorCuotaTabla),   
        rawValue: data.totalValorCuotaTabla,
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
      {
        title: 'Debido cobrar',
        icon: 'solar:case-round-minimalistic-bold-duotone',
        count: this.formatCurrency(data.totalDebidoCobrar),
        rawValue: data.totalDebidoCobrar,
        variant: 'success'
      },
    ];
  }

  private getEmptyStats(): StatType[] {
    return [
      {
        title: 'Valor cuota',
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
      {
        title: 'Debido cobrar',
        icon: 'solar:case-round-minimalistic-bold-duotone',
        count: this.formatCurrency(0),
        rawValue: 0
      }
    ];
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('es-CO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
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
