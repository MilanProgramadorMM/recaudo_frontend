import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FlatpickrDirective } from '@core/directive/flatpickr.directive';
import { ConsultasService, MovimientoDetalleDto } from '@core/services/consultas.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

export interface DetalleModalData {
  zoneId: number;
  zoneName: string;
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-modal-detalle-consulta',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    FlatpickrDirective,
    NgbPaginationModule
  ],
  templateUrl: './modal-detalle-consulta.component.html',
  styleUrl: './modal-detalle-consulta.component.scss'
})
export class ModalDetalleConsultaComponent implements OnInit {

  filterForm: FormGroup;
  flatpickrOptions: any;

  rawData: MovimientoDetalleDto[] = [];
  filteredData: MovimientoDetalleDto[] = [];
  pagedData: MovimientoDetalleDto[] = [];

  conceptOptions: string[] = [];
  paymentTypeOptions: string[] = [];

  loading = false;
  page: number = 1;
  pageSize: number = 10;

  constructor(
    private fb: FormBuilder,
    private consultasService: ConsultasService,
    public dialogRef: MatDialogRef<ModalDetalleConsultaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DetalleModalData
  ) {
    this.filterForm = this.fb.group({
      concept: [''],
      paymentType: [''],
      dateRange: [`${data.startDate} to ${data.endDate}`],
    });

    this.flatpickrOptions = {
      mode: 'range',
      dateFormat: 'Y-m-d',
      defaultDate: [data.startDate, data.endDate],
      onChange: (selectedDates: Date[]) => this.onDateRangeChange(selectedDates),
    };
  }

  ngOnInit(): void {
    this.loadDetalle(this.data.startDate, this.data.endDate);
  }

  onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.page = 1;
    this.updatePagedData();
    // const body = document.querySelector('.modal-detalle-body');
    // if (body) body.scrollTop = 0;
  }

  loadDetalle(startDate: string, endDate: string): void {
    this.loading = true;
    this.consultasService.getMovimientosDetalle(this.data.zoneId, startDate, endDate).subscribe({
      next: (data) => {
        this.rawData = data;
        this.buildFilterOptions();
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando detalle:', err);
        this.rawData = [];
        this.filteredData = [];
        this.loading = false;
      }
    });
  }

  private buildFilterOptions(): void {
    this.conceptOptions = [...new Set(this.rawData.map(r => r.concept))].sort();
    this.paymentTypeOptions = [...new Set(this.rawData.map(r => r.payment_type))].sort();
  }

  applyFilters(): void {
    const concept = (this.filterForm.get('concept')?.value ?? '').trim();
    const paymentType = (this.filterForm.get('paymentType')?.value ?? '').trim();

    this.filteredData = this.rawData.filter(row => {
      const matchConcept = !concept || row.concept === concept;
      const matchPayment = !paymentType || row.payment_type === paymentType;
      return matchConcept && matchPayment;
    });

    this.page = 1;
    this.updatePagedData();
  }

  updatePagedData(): void {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedData = this.filteredData.slice(startIndex, endIndex);
  }

  onPageChange(): void {
    this.updatePagedData();
    const body = document.querySelector('.modal-detalle-body');
    if (body) body.scrollTop = 0;
  }

  getShowingStart(): number {
    if (this.filteredData.length === 0) return 0;
    return (this.page - 1) * this.pageSize + 1;
  }

  getShowingEnd(): number {
    const end = this.page * this.pageSize;
    return end > this.filteredData.length ? this.filteredData.length : end;
  }

  onDateRangeChange(selectedDates: Date[]): void {
    if (selectedDates && selectedDates.length === 2) {
      const startDate = this.formatDate(selectedDates[0]);
      const endDate = this.formatDate(selectedDates[1]);
      this.filterForm.patchValue({ concept: '', paymentType: '' }, { emitEvent: false });
      this.loadDetalle(startDate, endDate);
    }
  }

  clearFilters(): void {
    this.filterForm.patchValue({ concept: '', paymentType: '' }, { emitEvent: false });
    this.applyFilters();
  }

  get totalValuePaid(): number {
    return this.filteredData.reduce((acc, r) => acc + r.value_paid, 0);
  }
  get totalInvestment(): number {
    return this.filteredData.reduce((acc, r) => acc + r.investment_value, 0);
  }
  get totalInterest(): number {
    return this.filteredData.reduce((acc, r) => acc + r.interest_value, 0);
  }
  get totalLifeInsurance(): number {
    return this.filteredData.reduce((acc, r) => acc + r.life_insurance, 0);
  }
  get totalPortfolioInsurance(): number {
    return this.filteredData.reduce((acc, r) => acc + r.portfolio_insurance, 0);
  }

  close(): void {
    this.dialogRef.close();
  }

  private formatDate(date: Date): string {
    return date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' +
      String(date.getDate()).padStart(2, '0');
  }
}