import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from '@components/page-title.component';
import { NgbModal, NgbPaginationModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CreditIntentionResponseDto, CreditIntentionService } from '@core/services/creditIntention.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreditResponseDto, CreditService } from '@core/services/credit.service';
import { RecaudoModalComponent } from '@views/credits/recaudo-modal/recaudo-modal.component';
import { AuthenticationService } from '@core/services/auth.service';
import { UserRole } from '../closing/closing.component';
import { ZonaResponseDto, ZonaService } from '@core/services/zona.service';
import { FlatpickrDirective } from '@core/directive/flatpickr.directive';

@Component({
  selector: 'app-credits',
  imports: [
    CommonModule,
    PageTitleComponent,
    NgbPaginationModule,
    NgbModalModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlatpickrDirective
  ],
  templateUrl: './credits.component.html',
  styleUrl: './credits.component.scss'
})
export class CreditsComponent {

  loading: boolean = false;
  intentions: CreditResponseDto[] = [];
  filteredIntentions: CreditResponseDto[] = [];
  pagedIntentions: CreditResponseDto[] = [];
  zonas: ZonaResponseDto[] = [];
  filterForm!: FormGroup;

  isAsistente = false;
  isAsesor = false;
  isAdmin = false;
  currentRole: string = '';

  currency = '$';
  searchTerm: string = '';

  page: number = 1;
  pageSize: number = 10;

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
    private creditservice: CreditService,
    private authService: AuthenticationService,
    private zonaService: ZonaService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.loadCredit();
    this.loadUserRole();
    this.loadAllActiveZonas();
    
    this.filterForm = this.fb.group({
      line: [''],
      zona: [''],
      date: ['']
    });

    this.filterForm.valueChanges.subscribe(filters => {
      const zona = filters.zona;
      const date = filters.date;
      const line = filters.line;
      if (zona == '' && (date == '' || date == null) && line == '') {
        this.filteredIntentions = [...this.intentions];
      } else {
        this.filteredIntentions = this.intentions.filter(intention => {
          const createdAt = intention.createdAt
            ? new Date(intention.createdAt.replace(' ', 'T'))
            : null;
          const sameZone = !zona || intention.zoneId == zona;
          const sameDate = !date || (
            createdAt &&
            this.formatDate(createdAt) === this.formatDate(date)
          );
          const sameLine = !line || intention.creditLineName == line;
          return sameZone && sameDate && sameLine;
        });
      }
      this.page = 1;
      this.updatePagedData();
    });
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

  loadUserRole(): void {
    this.currentRole = this.authService.getUserRole() || '';
    this.isAsistente = this.currentRole === UserRole.ASISTENTE;
    this.isAsesor = this.currentRole === UserRole.ASESOR;
    this.isAdmin = this.currentRole === UserRole.ADMIN;
  }

  clearFilters() {
    this.filterForm.patchValue({
      zona: '',
      line: '',
      date: null
    });
    this.filteredIntentions = [...this.intentions];
  }

  private formatDate(date: Date | string): string {
    if (typeof date === 'string') return date;
    return date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' +
      String(date.getDate()).padStart(2, '0');
  }

  loadCredit(): void {
    this.loading = true;
    this.creditservice.getCredits().subscribe({
      next: (response) => {
        if (response.status === 'OK') {
          this.intentions = response.data;
          this.filteredIntentions = [...this.intentions];
          this.updatePagedData();
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar intenciones:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los créditos'
        });
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    const dataFilter = this.filterForm.value;    
    this.filteredIntentions = this.intentions.filter(intention =>
      // intention.fullname?.toLowerCase().includes(term) ||
      // intention.document?.toLowerCase().includes(term) ||
      intention.zoneId == dataFilter.zona
    );    

    this.page = 1;
    this.updatePagedData();
  }

  updatePagedData(): void {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedIntentions = this.filteredIntentions.slice(startIndex, endIndex);
  }

  onPageChange(): void {
    this.updatePagedData();
  }

  getShowingStart(): number {
    if (this.filteredIntentions.length === 0) return 0;
    return (this.page - 1) * this.pageSize + 1;
  }

  getShowingEnd(): number {
    const end = this.page * this.pageSize;
    return end > this.filteredIntentions.length ? this.filteredIntentions.length : end;
  }

  // Métodos de utilidad para el template
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  isLibreInversion(intention: CreditResponseDto): boolean {
    return intention.creditLineName
      ?.toUpperCase()
      .includes('LIBRE');
  }

  isFinanciamiento(intention: CreditResponseDto): boolean {
    return intention.creditLineName
      ?.toUpperCase()
      .includes('FINANCIAMIENTO');
  }

  manageIntention(intention: any): void {
    const modalRef = this.modalService.open(RecaudoModalComponent, {
      size: 'xl',
      backdrop: 'static',
      keyboard: true,
      centered: true,
      scrollable: true,
      windowClass: 'modal-extra-large'  // Agregar clase personalizada

    });

    modalRef.componentInstance.creditId = intention.id;
  }


}
