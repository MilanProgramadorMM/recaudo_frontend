import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FlatpickrDirective } from '@core/directive/flatpickr.directive';
import { ZonaService, ZonaResponseDto } from '@core/services/zona.service';
import { PersonZonaService } from '@core/services/person-zona.service';
import { SharedFilterService } from '@core/services/shared-filter.service';
import { AuthenticationService } from '@core/services/auth.service';
import { UserService } from '@core/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { LoadingComponent } from '@views/ui/loading/loading.component';
import { ConsultasService, DebidoCobrarPorZonaDto, DefaultConsultasDto, MovimientoZonaDto } from '@core/services/consultas.service';
import { ModalDetalleConsultaComponent } from './modal-detalle-consulta/modal-detalle-consulta.component';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute, Route } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';

export interface ConsultaRow {
  id: number;
  zone_id: number;
  zona: string;
  name: string;
  quota_value: number;
  investment_value: number;
  capital_balance: number;
  interest_value: number;
  portfolio_insurance: number;
  life_insurance: number;
}

@Component({
  selector: 'app-consultas',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlatpickrDirective,
    NgApexchartsModule
  ],
  templateUrl: './consultas.component.html',
  styleUrl: './consultas.component.scss'
})
export class ConsultasComponent implements OnInit, AfterViewInit {

  @ViewChild('dateRangeInput') dateRangeInput!: ElementRef;

  filterForm: FormGroup;
  zonas: ZonaResponseDto[] = [];
  loading = false;
  flatpickrOptions: any;
  currency = '$';

  currentUserRole: string | null = null;
  currentUserId: number | null = null;

  type: string | null = null;

  tableData1: ConsultaRow[] = [];
  tableData2: DefaultConsultasDto[] = [];
  tableData3: DefaultConsultasDto[] = [];
  tableData4: DebidoCobrarPorZonaDto[] = [];

  // ── Gráficos ──────────────────────────────────────────
  chart1Opts: any = this.buildBarChart('Movimientos por Zona', '#3b82f6');
  chart2Opts: any = this.buildBarChart('Saldos Vencidos por Zona', '#ef4444');
  chart3Opts: any = this.buildBarChart('Créditos por Zona', '#f59e0b');
  chart4Opts: any = this.buildBarChart('Debido Cobrar por Zona', '#22c55e');

  chart1Series: any[] = [];
  chart2Series: any[] = [];
  chart3Series: any[] = [];
  chart4Series: any[] = [];

  chart1Categories: string[] = [];
  chart2Categories: string[] = [];
  chart3Categories: string[] = [];
  chart4Categories: string[] = [];

  constructor(
    private fb: FormBuilder,
    private zonaService: ZonaService,
    private personZonaService: PersonZonaService,
    private authService: AuthenticationService,
    private sharedFilterService: SharedFilterService,
    private userService: UserService,
    private dialog: MatDialog,
    private consultasService: ConsultasService,
    private route: ActivatedRoute
  ) {
    this.route.data.subscribe(data => {
      this.type = data['type'];
    });
    const today = new Date();
    const todayStr = today.getFullYear() + '-' +
      String(today.getMonth() + 1).padStart(2, '0') + '-' +
      String(today.getDate()).padStart(2, '0');

    this.filterForm = this.fb.group({
      zona: [''],
      dateRange: [todayStr]
    });

    this.flatpickrOptions = {
      mode: 'range',
      dateFormat: 'Y-m-d',
      defaultDate: todayStr,
      altFormat: 'd F Y',
      onChange: (selectedDates: Date[]) => this.onDateRangeChange(selectedDates)
    };
  }

  ngOnInit(): void {
    this.getUserDataFromToken();
    this.loadTable1();
    this.loadTable2();
    this.loadTable3();
    this.loadTable4();
  }

  ngAfterViewInit(): void { }

  getUserDataFromToken(): void {
    this.currentUserRole = this.authService.getUserRole();
    this.currentUserId = this.authService.getUserId();
  }

  async loadTable1(fechaInicio?: string, fechaFin?: string) {
    const hoy = this.formatDate(new Date());
    const desde = fechaInicio ?? hoy;
    const hasta = fechaFin ?? hoy;

    try {
      const data: MovimientoZonaDto[] = await firstValueFrom(
        this.consultasService.getMovimientosAll(desde, hasta)
      );

      this.tableData1 = this.mapMovimientosToRows(data);
      this.updateChart1();

    } catch (err) {
      console.error('Error cargando movimientos tabla 1:', err);
      this.tableData1 = [];
    }
  }

  async loadTable2(fechaInicio?: string, fechaFin?: string) {
    const hoy = this.formatDate(new Date());
    const desde = fechaInicio ?? hoy;
    const hasta = fechaFin ?? hoy;

    try {
      const data: DefaultConsultasDto[] = await firstValueFrom(
        this.consultasService.getSaldosVencidos(desde, hasta)
      );

      this.tableData2 = data;
      this.updateChart2();

    } catch (err) {
      console.error('Error cargando movimientos tabla 1:', err);
      this.tableData2 = [];
    }
  }

  async loadTable3(fechaInicio?: string, fechaFin?: string) {
    const hoy = this.formatDate(new Date());
    const desde = fechaInicio ?? hoy;
    const hasta = fechaFin ?? hoy;

    try {
      const data: DefaultConsultasDto[] = await firstValueFrom(
        this.consultasService.getCreditosPorZona(desde, hasta)
      );

      this.tableData3 = data;
      this.updateChart3();

    } catch (err) {
      console.error('Error cargando movimientos tabla 1:', err);
      this.tableData3 = [];
    }
  }

  async loadTable4(fechaInicio?: string, fechaFin?: string) {
    const hoy = this.formatDate(new Date());
    const desde = fechaInicio ?? hoy;
    const hasta = fechaFin ?? hoy;

    try {
      const data: DebidoCobrarPorZonaDto[] = await firstValueFrom(
        this.consultasService.getDebidoCobrarPorZona(desde, hasta)
      );

      this.tableData4 = data;
      this.updateChart4();

    } catch (err) {
      console.error('Error cargando movimientos tabla 1:', err);
      this.tableData4 = [];
    }
  }

  private mapMovimientosToRows(data: MovimientoZonaDto[]): ConsultaRow[] {
    return data.map(item => ({
      id: item.zone_id,
      zone_id: item.zone_id,
      zona: item.zone_name,
      name: item.zone_name,
      quota_value: item.total_recaudado,
      investment_value: 0,
      capital_balance: item.total_capital,
      interest_value: item.total_interes,
      portfolio_insurance: item.total_seguro_cartera,
      life_insurance: item.total_seguro_vida,
    }));
  }

  onDateRangeChange(selectedDates: Date[]): void {
    if (selectedDates && selectedDates.length === 2) {
      const fechaInicio = this.formatDate(selectedDates[0]);
      const fechaFin = this.formatDate(selectedDates[1]);
      const filters = this.sharedFilterService.getFilters();
      this.sharedFilterService.setFilters({ ...filters, fechaInicio, fechaFin });
    }
  }

  async consultar() {
    const filters = this.sharedFilterService.getFilters();
    if (!filters.fechaInicio || !filters.fechaFin) {
      alert('Selecciona un rango de fechas válido');
      return;
    }
    if (this.loading) return;

    this.loading = true;
    const dialogRef = this.dialog.open(LoadingComponent, { disableClose: true });

    await this.loadTable1(filters.fechaInicio, filters.fechaFin);
    await this.loadTable2(filters.fechaInicio, filters.fechaFin);
    await this.loadTable3(filters.fechaInicio, filters.fechaFin);
    await this.loadTable4(filters.fechaInicio, filters.fechaFin);

    this.loading = false;
    dialogRef.close();
    /*this.consultasService.getMovimientosAll(filters.fechaInicio, filters.fechaFin).subscribe({
      next: (data) => {
        this.tableData1 = this.mapMovimientosToRows(data);
        this.loading = false;
        dialogRef.close();
      },
      error: (err) => {
        console.error('Error en consultar:', err);
        this.loading = false;
        dialogRef.close();
      }
    });*/
  }

  onRowClick(type: string, row: ConsultaRow): void {
    const filters = this.sharedFilterService.getFilters();
    const hoy = this.formatDate(new Date());

    this.dialog.open(ModalDetalleConsultaComponent, {
      width: '97vw',
      maxWidth: '1500px',
      panelClass: 'modal-detalle-panel',
      data: {
        zoneId: row.zone_id || row.id,
        zoneName: row.zona || row.name,
        startDate: filters.fechaInicio ?? hoy,
        endDate: filters.fechaFin ?? hoy,
        type: type
      }
    });
  }

  private formatDate(date: Date | string): string {
    if (typeof date === 'string') return date;
    return date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' +
      String(date.getDate()).padStart(2, '0');
  }

  private buildBarChart(titulo: string, color: string): any {
    return {
      chart: {
        type: 'bar',
        height: 260,
        toolbar: { show: false },
        fontFamily: 'inherit'
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '60%',
          borderRadius: 4,
          dataLabels: { position: 'top' }
        }
      },
      dataLabels: { enabled: false },
      colors: [color],
      xaxis: {
        categories: [],
        labels: {
          formatter: (val: number) => this.formatChartValue(val)
        }
      },
      yaxis: { labels: { style: { fontSize: '12px' } } },
      tooltip: {
        y: { formatter: (val: number) => `$ ${this.formatChartValue(val)}` }
      },
      grid: { borderColor: '#f1f3fa', xaxis: { lines: { show: true } } },
      legend: { show: false }
    };
  }

  private formatChartValue(val: number): string {
    if (val >= 1_000_000) return (val / 1_000_000).toFixed(1) + 'M';
    if (val >= 1_000) return (val / 1_000).toFixed(0) + 'K';
    return val.toFixed(0);
  }

  private updateChart1(): void {
    if (!this.tableData1.length) { this.chart1Series = []; return; }
    this.chart1Categories = this.tableData1.map(r => r.zona);
    this.chart1Series = [
      { name: 'Total', data: this.tableData1.map(r => Math.abs(r.quota_value)) },
      { name: 'Capital', data: this.tableData1.map(r => Math.abs(r.capital_balance)) },
      { name: 'Interés', data: this.tableData1.map(r => Math.abs(r.interest_value)) },
    ];
    this.chart1Opts = {
      ...this.chart1Opts,
      colors: ['#3b82f6', '#22c55e', '#f59e0b'],
      xaxis: { ...this.chart1Opts.xaxis, categories: this.chart1Categories },
      legend: { show: true, position: 'bottom' }
    };
  }

  private updateChart2(): void {
    if (!this.tableData2.length) { this.chart2Series = []; return; }
    this.chart2Categories = this.tableData2.map(r => r.name);
    this.chart2Series = [{ name: 'Saldo Vencido', data: this.tableData2.map(r => Math.abs(r.value)) }];
    this.chart2Opts = { ...this.chart2Opts, xaxis: { ...this.chart2Opts.xaxis, categories: this.chart2Categories } };
  }

  private updateChart3(): void {
    if (!this.tableData3.length) { this.chart3Series = []; return; }
    this.chart3Categories = this.tableData3.map(r => r.name);
    this.chart3Series = [{ name: 'Créditos', data: this.tableData3.map(r => r.value) }];
    this.chart3Opts = {
      ...this.chart3Opts,
      colors: ['#f59e0b'],
      xaxis: {
        ...this.chart3Opts.xaxis,
        categories: this.chart3Categories,
        labels: { formatter: (val: number) => val.toFixed(0) }
      },
      tooltip: { y: { formatter: (val: number) => `${val} créditos` } }
    };
  }

  private updateChart4(): void {
    if (!this.tableData4.length) { this.chart4Series = []; return; }
    this.chart4Categories = this.tableData4.map(r => r.zona);
    this.chart4Series = [
      { name: 'Cuota', data: this.tableData4.map(r => Math.abs(r.quotaValue)) },
      { name: 'Interés', data: this.tableData4.map(r => Math.abs(r.interestValue)) },
      { name: 'Inversión', data: this.tableData4.map(r => Math.abs(r.investmentValue)) },
    ];
    this.chart4Opts = {
      ...this.chart4Opts,
      colors: ['#22c55e', '#3b82f6', '#a855f7'],
      xaxis: { ...this.chart4Opts.xaxis, categories: this.chart4Categories },
      legend: { show: true, position: 'bottom' }
    };
  }

}