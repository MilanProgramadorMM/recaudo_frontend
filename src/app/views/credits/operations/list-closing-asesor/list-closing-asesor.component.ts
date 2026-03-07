import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PageTitleComponent } from '@components/page-title.component';
import { AuthenticationService } from '@core/services/auth.service';
import { ClosingService, ClosingResponseDto } from '@core/services/closing.service';
import { ClosingStatusService } from '@core/services/closingStatus.service';
import { UserRole } from '../closing/closing.component';
import { FlatpickrDirective } from '@core/directive/flatpickr.directive';
import { ZonaResponseDto, ZonaService } from '@core/services/zona.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

interface ClosingWithStatus extends ClosingResponseDto {
  closingStatus?: string;
  canEdit?: boolean;
}
@Component({
  selector: 'app-list-closing-asesor',
  imports: [CommonModule, PageTitleComponent, FlatpickrDirective, ReactiveFormsModule],
  templateUrl: './list-closing-asesor.component.html',
  styleUrl: './list-closing-asesor.component.scss'
})
export class ListClosingAsesorComponent {

  closings: ClosingWithStatus[] = [];
  filteredClosings: ClosingWithStatus[] = [];
  zonas: ZonaResponseDto[] = [];
  loading = false;
  personId: number | null = null;
  lastUpdate: Date | null = null;

  isAsistente = false;
  isAsesor = false;
  isAdmin = false;
  currentRole: string = '';

  
  @ViewChild('date', { static: false }) dateInput!: any;

  filterForm!: FormGroup;
  flatpickrOptions = {
    dateFormat: 'Y-m-d',
    defaultDate: [],
    locale: {
      firstDayOfWeek: 1,
      weekdays: {
        shorthand: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
        longhand: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      },
      months: {
        shorthand: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        longhand: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      },
    },
    onChange: (selectedDates: Date[]) => {
      if (selectedDates.length > 0) {
        //this.filterForm.patchValue({date: this.formatDate(selectedDates[0])});
      }
    }
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private closingService: ClosingService,
    private closingStatusService: ClosingStatusService,
    private router: Router,
    private zonaService: ZonaService
  ) {
  }

  ngOnInit(): void {
    this.personId = this.authService.getUserId();

    if (!this.personId) {
      console.error('No se pudo obtener el ID del usuario');
      return;
    }    

    this.loadClosings();
    this.loadUserRole();
    this.loadAllActiveZonas();
    this.filterForm = this.fb.group({
      zona: [''],
      date: ['']
    });

    this.filterForm.valueChanges.subscribe(filters => {
      const zona = filters.zona;
      const date = filters.date;
      this.filteredClosings = this.closings.filter(closing => {
        const zonaMatch = !zona || closing.zonaId == zona;
        const dateMatch = !date || closing.closingDate == date;
        return zonaMatch && dateMatch;
      });

    });
  }

  testZona(e: any){
    // this.filterForm.patchValue({
    //     zona: e.target.value
    // });
  }

  applyFilters() {
    const dataFilter = this.filterForm.value;
    this.filteredClosings = this.closings.filter(closing => (closing.zonaId == dataFilter.zona) && (closing.closingDate == dataFilter.date));
  }

  clearFilters() {
    this.filterForm.patchValue({
      zona: '',
      date: null
    });
    this.filteredClosings = [...this.closings];
  }

  private initializeFilters(): void {
    if (this.zonas.length > 0) {
      const primeraZona = this.zonas[0];
      this.filterForm.patchValue({
        zona: primeraZona.id
      });
    }
  }

  private loadAllActiveZonas(): void {
    this.zonaService.getByStatus().subscribe({
      next: (response) => {
        this.zonas = response.data;
         //this.initializeFilters();
        this.loading = false;
        console.log('Zonas activas cargadas:', this.zonas);
      },
      error: (err) => {
        console.error('Error al cargar zonas:', err);
        this.zonas = [];
        this.loading = false;
      }
    });
  }

  onDateRangeChange(selectedDates: Date[]): void {
    if (selectedDates && selectedDates.length === 2) {
      const fechaInicio = this.formatDate(selectedDates[0]);
      const fechaFin = this.formatDate(selectedDates[1]);

      /*const filters = this.sharedFilterService.getFilters();
      this.sharedFilterService.setFilters({
        ...filters,
        fechaInicio,
        fechaFin
      });*/
      console.log('Filtro fecha aplicado:', { fechaInicio, fechaFin });
    }
  }

  private formatDate(date: Date | string): string {
    if (typeof date === 'string') return date;
    return date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' +
      String(date.getDate()).padStart(2, '0');
  }

  loadUserRole(): void {
    this.currentRole = this.authService.getUserRole() || '';
    this.isAsistente = this.currentRole === UserRole.ASISTENTE;
    this.isAsesor = this.currentRole === UserRole.ASESOR;
    this.isAdmin = this.currentRole === UserRole.ADMIN;
  }

  loadClosings(): void {
    if (!this.personId) return;

    this.loading = true;
    this.closingService.getClosingsByPerson(this.personId).subscribe({
      next: (response) => {
        this.closings = response.data || [];
        this.filteredClosings = [...this.closings];
        this.lastUpdate = new Date();
        this.loading = false;

        console.log('Cierres cargados:', this.closings);
      },
      error: (error) => {
        console.error('Error al cargar cierres:', error);
        this.loading = false;
      }
    });
  }

  refreshClosings(): void {
    this.loadClosings();
  }

  canEditClosing(closing: ClosingResponseDto): boolean {
    return (
      closing.closingStatus === 'PRE_CIERRE' &&
      closing.amount !== null &&
      closing.amount !== undefined &&
      closing.amount >= 0  
    );
  }

  goToClosing(closingId: number): void {
    this.router.navigate(['/configuration/closing', closingId]);
  }

  viewClosing(closingId: number): void {
    this.router.navigate(['/configuration/closing', closingId]);
  }

  // Métodos de conteo
  getPendingCount(): number {
    return this.closings.filter(c => c.closingStatus === 'PRE_CIERRE').length;
  }

  getStudyCount(): number {
    return this.closings.filter(c => c.closingStatus === 'STUDY').length;
  }

  getApprovedCount(): number {
    return this.closings.filter(c => c.closingStatus === 'APPROVED').length;
  }

  getRejectedCount(): number {
    return this.closings.filter(c => c.closingStatus === 'REJECTED').length;
  }

  hasPendingClosings(): boolean {
    return this.getPendingCount() > 0;
  }

  // Utilidades de UI
  getStatusBadgeClass(status?: string): string {
    switch (status) {
      case 'PRE_CIERRE':
        return 'badge bg-warning text-dark';
      case 'STUDY':
        return 'badge bg-info';
      case 'PRE_APPROVED':
        return 'badge bg-success';
      case 'APPROVED':
        return 'badge bg-success';
      case 'REJECTED':
        return 'badge  bg-danger-custom';
      default:
        return 'badge bg-secondary';
    }
  }

  getActionButtonText(closing: ClosingResponseDto): string {
    if (this.canEditClosing(closing)) {
      return 'Completar';
    }

    if (closing.closingStatus === 'PRE_CIERRE' &&
      (closing.amount === null || closing.amount === undefined || closing.amount === 0)) {
      return 'Esperando BASE'; 
    }

    if (this.canEditClosing(closing)) {
      return 'Completar';
    }
    switch (closing.closingStatus) {
      case 'STUDY':
      case 'PRE_APPROVED':
        return 'Ver Estado';
      case 'APPROVED':
      case 'REJECTED':
        return 'Ver Detalles';
      default:
        return 'Ver';
    }
  }

  getStatusText(status?: string): string {
    switch (status) {
      case 'PRE_CIERRE':
        return 'Pendiente';
      case 'STUDY':
        return 'En Estudio';
      case 'PRE_APPROVED':
        return 'Pre-Aprobado';
      case 'APPROVED':
        return 'Aprobado';
      case 'REJECTED':
        return 'Rechazado';
      default:
        return 'Desconocido';
    }
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }
}
