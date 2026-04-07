import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FlatpickrDirective } from '@core/directive/flatpickr.directive';
import { ConsultasService, CreditosZonaDetalleDto, MovimientoDetalleDto, SaldosVencidosDetalleDto } from '@core/services/consultas.service';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx-js-style';
import * as FileSaver from 'file-saver';
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import { RecaudoModalComponent } from '@views/credits/recaudo-modal/recaudo-modal.component';

export interface DetalleModalData {
  zoneId: number;
  zoneName: string;
  startDate: string;
  endDate: string;
  type: string;
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

  rawDataSaldosVencidos: SaldosVencidosDetalleDto[] = [];
  filteredDataSaldosVencidos: SaldosVencidosDetalleDto[] = [];
  pagedDataSaldosVencidos: SaldosVencidosDetalleDto[] = [];

  rawDataCreditosZona: CreditosZonaDetalleDto[] = [];
  filteredDataCreditosZona: CreditosZonaDetalleDto[] = [];
  pagedDataCreditosZona: CreditosZonaDetalleDto[] = [];


  conceptOptions: string[] = [];
  paymentTypeOptions: string[] = [];
  creditLines: string[] = [];
  periods: string[] = [];

  loading = false;
  page: number = 1;
  pageSize: number = 10;
  startDate: string = '';
  endDate: string = '';

  TODOS: number[] = [];

  constructor(
    private fb: FormBuilder,
    private consultasService: ConsultasService,
    public dialogRef: MatDialogRef<ModalDetalleConsultaComponent>,
    private modalService: NgbModal,
    @Inject(MAT_DIALOG_DATA) public data: DetalleModalData
  ) {
    this.filterForm = this.fb.group({
      concept: [''],
      paymentType: [''],
      cartera: [this.TODOS],
      creditLine: [''],
      period: [''],
      customer: [''],
      dateRange: [`${data.startDate} to ${data.endDate}`],
    });

    this.flatpickrOptions = {
      mode: 'range',
      dateFormat: 'Y-m-d',
      defaultDate: [data.startDate, data.endDate],
      locale: Spanish,
      altFormat: 'd F Y',
      onChange: (selectedDates: Date[]) => this.onDateRangeChange(selectedDates),
    };
    this.startDate = data.startDate;
    this.endDate = data.endDate;
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
    switch (this.data.type) {
      case 'MOVIMIENTOS_POR_ZONA':
        this.loadDetalleMovimientos(startDate, endDate);
        break;
      case 'SALDOS_VENCIDOS':
        this.loadDetalleSaldosVencidos(startDate, endDate);
        break;
      case 'CREDITOS_ZONA':
        this.loadDetalleCreditosZona(startDate, endDate);
        break;
    }
  }

  private loadDetalleMovimientos(startDate: string, endDate: string) {
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

  private loadDetalleSaldosVencidos(startDate: string, endDate: string) {
    this.loading = true;
    this.consultasService.getSaldosVencidosDetalle(this.data.zoneId, startDate, endDate).subscribe({
      next: (data) => {
        this.rawDataSaldosVencidos = data;        
        this.applyFiltersSaldosVencidos();
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando detalle:', err);
        this.rawDataSaldosVencidos = [];
        this.filteredDataSaldosVencidos = [];
        this.loading = false;
      }
    });
  }

  private loadDetalleCreditosZona(startDate: string, endDate: string) {
    this.loading = true;
    this.consultasService.getDetalleCreditosPorZona(this.data.zoneId, startDate, endDate).subscribe({
      next: (data) => {
        this.rawDataCreditosZona = data;
        this.buildFilterOptionsCreditosZona();
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando detalle:', err);
        this.rawDataCreditosZona = [];
        this.filteredDataCreditosZona = [];
        this.loading = false;
      }
    });
  }

  private buildFilterOptions(): void {
    this.conceptOptions = [...new Set(this.rawData.map(r => r.concept))].sort();
    this.paymentTypeOptions = [...new Set(this.rawData.map(r => r.payment_type))].sort();
  }

  private buildFilterOptionsCreditosZona(): void {
    this.creditLines = [...new Set(this.rawDataCreditosZona.map(r => r.creditLine))].sort();
    this.periods = [...new Set(this.rawDataCreditosZona.map(r => r.period))].sort();
  }

  applyFilters(): void {
    switch (this.data.type) {
      case 'MOVIMIENTOS_POR_ZONA':
        this.applyFiltersDetalleMovimientos();
        break;
      case 'SALDOS_VENCIDOS':
        this.applyFiltersSaldosVencidos();
        break;
      case 'CREDITOS_ZONA':
        this.applyFiltersCreditosZona();
        break;
    }    
  }

  applyFiltersDetalleMovimientos(): void {
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
      this.startDate = this.formatDate(selectedDates[0]);
      this.endDate = this.formatDate(selectedDates[1]);
      this.filterForm.patchValue({ concept: '', paymentType: '', cartera: [], creditLine: '', period: '', customer: '' }, { emitEvent: false });
      this.loadDetalle(this.startDate, this.endDate);
    }
  }

  clearFilters(): void {
    this.filterForm.patchValue({ concept: '', paymentType: '', cartera: [], creditLine: '', period: '', customer: '' }, { emitEvent: false });
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

  exportToExcel(): void {
    switch(this.data.type) {
      case 'MOVIMIENTOS_POR_ZONA':
        this.exportToExcelMovimientosPorZona();
        break;
      case 'SALDOS_VENCIDOS':        
        this.exportToExcelSaldosVencidos();
        break;
      case 'CREDITOS_ZONA':        
        this.exportToExcelCreditosZona();
        break;
    }
  }

  exportToExcelMovimientosPorZona() {
    const tableData = this.rawData.map(item => ({
      'ZONA': item.zona,
      'CONCEPTO': item.concept,
      'TIPO DE PAGO': item.payment_type,
      'VALOR RECAUDADO': item.value_paid,
      'CAPITAL': item.investment_value,
      'INTERÉS': item.interest_value,
      'FECHA': item.date,
      'USUARIO': item.user
    }));

    const totalRow = {
      'ZONA': 'TOTAL',
      'CONCEPTO': '',
      'TIPO DE PAGO': '',
      'VALOR RECAUDADO': this.rawData.reduce((sum, i) => sum + (i.value_paid || 0), 0),
      'CAPITAL': this.rawData.reduce((sum, i) => sum + (i.investment_value || 0), 0),
      'INTERÉS': this.rawData.reduce((sum, i) => sum + (i.interest_value || 0), 0),
      'FECHA': '',
      'USUARIO': ''
    };

    const moneyColumns = [3, 4, 5];

    tableData.push(totalRow);

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(tableData);

    const range = XLSX.utils.decode_range(worksheet['!ref']!);

    const colWidths: any[] = [];

    for (let col = range.s.c; col <= range.e.c; col++) {
      let maxLength = 10;

      for (let row = range.s.r; row <= range.e.r; row++) {
        const cell = worksheet[XLSX.utils.encode_cell({ r: row, c: col })];
        if (cell && cell.v) {
          maxLength = Math.max(maxLength, cell.v.toString().length);
        }
      }

      colWidths.push({ wch: maxLength + 5 });
    }

    worksheet['!cols'] = colWidths;

    for (let row = range.s.r; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {

        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });

        if (!worksheet[cellAddress]) continue;
        const cell = worksheet[cellAddress];

        cell.s = {
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" }
          }
        };

        if (row === 0) {
          cell.s = {
            ...cell.s,
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "1F4E78" } },
            alignment: { horizontal: "center" }
          };
        }

        if (row > 0 && moneyColumns.includes(col) && typeof cell.v === 'number') {
          cell.z = '$#,##0.00;[Red]-$#,##0.00';
          cell.s = {
            ...cell.s,
            alignment: { horizontal: "right" }
          };
        }

        if (row === range.e.r) {
          cell.s = {
            ...cell.s,
            font: { bold: true },
            fill: { fgColor: { rgb: "D9D9D9" } }
          };
        }
      }
    }

    const totalRowIndex = range.e.r;
    worksheet['!merges'] = worksheet['!merges'] || [];
    worksheet['!merges'].push({
      s: { r: totalRowIndex, c: 0 },
      e: { r: totalRowIndex, c: 2 }
    });
    worksheet['!merges'].push({
      s: { r: totalRowIndex, c: 6 },
      e: { r: totalRowIndex, c: 7 }
    });

    const totalCell = XLSX.utils.encode_cell({ r: totalRowIndex, c: 0 });
    if (worksheet[totalCell]) {
      worksheet[totalCell].s = {
        ...worksheet[totalCell].s,
        alignment: { horizontal: "center" },
        font: { bold: true }
      };
    }
    
    worksheet['!freeze'] = { xSplit: 0, ySplit: 1 };

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Reporte': worksheet },
      SheetNames: ['Reporte']
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const blob: Blob = new Blob([excelBuffer], {
      type: 'application/octet-stream'
    });

    const safeName = this.data.zoneName.replace(/[\\/:*?"<>|]/g, '');

    FileSaver.saveAs(blob, `MOVIMIENTOS ${safeName} ${this.startDate} - ${this.endDate}.xlsx`);
  }

  exportToExcelSaldosVencidos() {
    const tableData = this.rawDataSaldosVencidos.map(item => ({
      'ZONA': item.zona,
      'CLIENTE': item.personName,      
      'VALOR': item.value,
      'DÍAS DE MORA': item.diasMora,
      'PERIODOS VENCIDOS': item.periodosVencidos,
      'INTERÉS MORATORIO': item.interesMoratorio
    }));

    const totalRow = {
      'ZONA': 'TOTAL',
      'CLIENTE': '',      
      'VALOR': this.rawDataSaldosVencidos.reduce((sum, i) => sum + (i.value || 0), 0),
      'DÍAS DE MORA': 0,
      'PERIODOS VENCIDOS': 0,
      'INTERÉS MORATORIO': this.rawDataSaldosVencidos.reduce((sum, i) => sum + (i.interesMoratorio || 0), 0)
    };

    const moneyColumns = [2, 5];

    tableData.push(totalRow);

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(tableData);

    const range = XLSX.utils.decode_range(worksheet['!ref']!);

    const colWidths: any[] = [];

    for (let col = range.s.c; col <= range.e.c; col++) {
      let maxLength = 10;

      for (let row = range.s.r; row <= range.e.r; row++) {
        const cell = worksheet[XLSX.utils.encode_cell({ r: row, c: col })];
        if (cell && cell.v) {
          maxLength = Math.max(maxLength, cell.v.toString().length);
        }
      }

      colWidths.push({ wch: maxLength + 5 });
    }

    worksheet['!cols'] = colWidths;

    for (let row = range.s.r; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {

        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });

        if (!worksheet[cellAddress]) continue;
        const cell = worksheet[cellAddress];

        cell.s = {
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" }
          }
        };

        if (row === 0) {
          cell.s = {
            ...cell.s,
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "1F4E78" } },
            alignment: { horizontal: "center" }
          };
        }

        if (row > 0 && moneyColumns.includes(col) && typeof cell.v === 'number') {
          cell.z = '$#,##0.00;[Red]-$#,##0.00';
          cell.s = {
            ...cell.s,
            alignment: { horizontal: "right" }
          };
        }

        if (row === range.e.r) {
          cell.s = {
            ...cell.s,
            font: { bold: true },
            fill: { fgColor: { rgb: "D9D9D9" } }
          };
        }
      }
    }

    const totalRowIndex = range.e.r;
    worksheet['!merges'] = worksheet['!merges'] || [];
    worksheet['!merges'].push({
      s: { r: totalRowIndex, c: 0 },
      e: { r: totalRowIndex, c: 1 }
    });

    const totalCell = XLSX.utils.encode_cell({ r: totalRowIndex, c: 0 });
    if (worksheet[totalCell]) {
      worksheet[totalCell].s = {
        ...worksheet[totalCell].s,
        alignment: { horizontal: "center" },
        font: { bold: true }
      };
    }
    
    worksheet['!freeze'] = { xSplit: 0, ySplit: 1 };

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Reporte': worksheet },
      SheetNames: ['Reporte']
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const blob: Blob = new Blob([excelBuffer], {
      type: 'application/octet-stream'
    });

    const safeName = this.data.zoneName.replace(/[\\/:*?"<>|]/g, '');

    FileSaver.saveAs(blob, `SALDOS VENCIDOS ${safeName} ${this.startDate} - ${this.endDate}.xlsx`);
  }

  exportToExcelCreditosZona() {
    const tableData = this.rawDataCreditosZona.map(item => ({
      'N. CRÉDITO': item.creditId,
      'CLIENTE': item.fullName,
      'LÍNEA': item.creditLine,
      'PERIODO': item.period,
      'N. CUOTAS': item.periodQuantity,
      'V. CUOTA': item.quotaValue,
      'T. CAPITAL': item.totalCapitalValue,
      'C. INICIAL': item.initialValuePayment,
      'V. FINANCIADO': item.totalFinancedValue,
      'T. INTENCIÓN': item.totalIntentionValue,
      'T. INTERES': item.totalInterestValue,
      'PAPELERÍA': item.stationery
    }));

    const totalRow = { 
      'N. CRÉDITO': 0,
      'CLIENTE': '',
      'LÍNEA': '',
      'PERIODO': '',
      'N. CUOTAS': 0,
      'V. CUOTA': 0,
      'T. CAPITAL': this.rawDataCreditosZona.reduce((sum, i) => sum + (i.totalCapitalValue || 0), 0),
      'C. INICIAL': 0,
      'V. FINANCIADO': this.rawDataCreditosZona.reduce((sum, i) => sum + (i.totalFinancedValue || 0), 0),
      'T. INTENCIÓN': 0,
      'T. INTERES': this.rawDataCreditosZona.reduce((sum, i) => sum + (i.totalInterestValue || 0), 0),
      'PAPELERÍA': 0
    };

    const moneyColumns = [5, 6, 7, 8, 9, 10, 11];

    tableData.push(totalRow);

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(tableData);

    const range = XLSX.utils.decode_range(worksheet['!ref']!);

    const colWidths: any[] = [];

    for (let col = range.s.c; col <= range.e.c; col++) {
      let maxLength = 10;

      for (let row = range.s.r; row <= range.e.r; row++) {
        const cell = worksheet[XLSX.utils.encode_cell({ r: row, c: col })];
        if (cell && cell.v) {
          maxLength = Math.max(maxLength, cell.v.toString().length);
        }
      }

      colWidths.push({ wch: maxLength + 5 });
    }

    worksheet['!cols'] = colWidths;

    for (let row = range.s.r; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {

        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });

        if (!worksheet[cellAddress]) continue;
        const cell = worksheet[cellAddress];

        cell.s = {
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" }
          }
        };

        if (row === 0) {
          cell.s = {
            ...cell.s,
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "1F4E78" } },
            alignment: { horizontal: "center" }
          };
        }

        if (row > 0 && moneyColumns.includes(col) && typeof cell.v === 'number') {
          cell.z = '$#,##0.00;[Red]-$#,##0.00';
          cell.s = {
            ...cell.s,
            alignment: { horizontal: "right" }
          };
        }

        if (row === range.e.r) {
          cell.s = {
            ...cell.s,
            font: { bold: true },
            fill: { fgColor: { rgb: "D9D9D9" } }
          };
        }
      }
    }

    const totalRowIndex = range.e.r;
    worksheet['!merges'] = worksheet['!merges'] || [];
    worksheet['!merges'].push({
      s: { r: totalRowIndex, c: 0 },
      e: { r: totalRowIndex, c: 5 }
    });

    const totalCell = XLSX.utils.encode_cell({ r: totalRowIndex, c: 0 });
    if (worksheet[totalCell]) {
      worksheet[totalCell].s = {
        ...worksheet[totalCell].s,
        alignment: { horizontal: "center" },
        font: { bold: true }
      };
      worksheet[totalCell] = {
        t: 's',
        v: 'TOTAL',
        s: {
          ...(worksheet[totalCell]?.s || {}),
          alignment: { horizontal: "center" },
          font: { bold: true }
        }
      };
    }
    
    worksheet['!freeze'] = { xSplit: 0, ySplit: 1 };

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Reporte': worksheet },
      SheetNames: ['Reporte']
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const blob: Blob = new Blob([excelBuffer], {
      type: 'application/octet-stream'
    });

    const safeName = this.data.zoneName.replace(/[\\/:*?"<>|]/g, '');

    FileSaver.saveAs(blob, `CREDITOS ZONA ${safeName} ${this.startDate} - ${this.endDate}.xlsx`);
  }

  //SALDOS VENCIDOS LOGIC
  applyFiltersSaldosVencidos(): void {
    const cartera = this.filterForm.get('cartera')?.value ?? [];    
    this.filteredDataSaldosVencidos = this.rawDataSaldosVencidos.filter(row => {
      if (cartera.length == 0) {
        return row;
      } else if (cartera.length == 2){
        const isValid = row.diasMora > cartera[0] && row.diasMora < cartera[1];
        return isValid;
      } else if (cartera.length == 1) {
        const isValid = row.diasMora > cartera[0];
        return isValid;
      }
      return true;
    });

    this.page = 1;
    this.updatePagedDataSaldosVencidos();
  }

  updatePagedDataSaldosVencidos(): void {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedDataSaldosVencidos = this.filteredDataSaldosVencidos.slice(startIndex, endIndex);
  }

  onPageChangeSaldosVencidos(): void {
    this.updatePagedDataSaldosVencidos();
    const body = document.querySelector('.modal-detalle-body');
    if (body) body.scrollTop = 0;
  }

  getShowingStartSaldosVencidos(): number {
    if (this.filteredDataSaldosVencidos.length === 0) return 0;
    return (this.page - 1) * this.pageSize + 1;
  }

  getShowingEndSaldosVencidos(): number {
    const end = this.page * this.pageSize;
    return end > this.filteredDataSaldosVencidos.length ? this.filteredDataSaldosVencidos.length : end;
  }

  onSaldosVencidosRowClick(creditId: number, creditIntentionId: number) {
      const modalRef = this.modalService.open(RecaudoModalComponent, {
          size: 'xl',
          backdrop: 'static',
          keyboard: true,
          centered: true,
          scrollable: true,
          windowClass: 'modal-extra-large'
        });
        modalRef.componentInstance.creditId = creditId;
        modalRef.componentInstance.creditIntentionId = creditIntentionId;
  }

  onPageSizeChangeSaldosVencidos(newSize: number): void {
    this.pageSize = newSize;
    this.page = 1;
    this.updatePagedDataSaldosVencidos();
  }

  get totalSaldosVencidos(): number {
    return this.filteredDataSaldosVencidos.reduce((acc, r) => acc + r.value, 0);
  }
  get totalInterestSaldosVencidos(): number {
    return this.filteredDataSaldosVencidos.reduce((acc, r) => acc + r.interesMoratorio, 0);
  }

  //CREDITOS ZONA LOGIC
  applyFiltersCreditosZona(): void {
    const creditLine = (this.filterForm.get('creditLine')?.value ?? '').trim();
    const period = (this.filterForm.get('period')?.value ?? '').trim();
    const customer = (this.filterForm.get('customer')?.value ?? '').trim().toUpperCase();;

    this.filteredDataCreditosZona = this.rawDataCreditosZona.filter(row => {
      const matchConcept = !creditLine || row.creditLine === creditLine;
      const matchPayment = !period || row.period === period;
      const matchCustomer = !customer || row.fullName.toUpperCase().includes(customer);
      return matchConcept && matchPayment && matchCustomer;
    });

    this.page = 1;
    this.updatePagedDataCreditosZona();
  }

  updatePagedDataCreditosZona(): void {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedDataCreditosZona = this.filteredDataCreditosZona.slice(startIndex, endIndex);
  }

  onPageChangeCreditosZona(): void {
    this.updatePagedDataCreditosZona();
    const body = document.querySelector('.modal-detalle-body');
    if (body) body.scrollTop = 0;
  }

  getShowingStartCreditosZona(): number {
    if (this.filteredDataCreditosZona.length === 0) return 0;
    return (this.page - 1) * this.pageSize + 1;
  }

  getShowingEndCreditosZona(): number {
    const end = this.page * this.pageSize;
    return end > this.filteredDataCreditosZona.length ? this.filteredDataCreditosZona.length : end;
  }

  onCreditosZonaRowClick(creditId: number, creditIntentionId: number) {
      const modalRef = this.modalService.open(RecaudoModalComponent, {
          size: 'xl',
          backdrop: 'static',
          keyboard: true,
          centered: true,
          scrollable: true,
          windowClass: 'modal-extra-large'
        });
        modalRef.componentInstance.creditId = creditId;
        modalRef.componentInstance.creditIntentionId = creditIntentionId;
  }

  onPageSizeChangeCreditosZona(newSize: number): void {
    this.pageSize = newSize;
    this.page = 1;
    this.updatePagedDataCreditosZona();
  }

  get totalCapitalCreditosZona(): number {
    return this.filteredDataCreditosZona.reduce((acc, r) => acc + r.totalCapitalValue, 0);
  }

  get totalIntencionCreditosZona(): number {
    return this.filteredDataCreditosZona.reduce((acc, r) => acc + r.totalIntentionValue, 0);
  }  

  get totalFinancedValueCreditosZona(): number {
    return this.filteredDataCreditosZona.reduce((acc, r) => acc + r.totalFinancedValue, 0);
  }  

  get totalInteresCreditosZona(): number {
    return this.filteredDataCreditosZona.reduce((acc, r) => acc + r.totalInterestValue, 0);
  }
  
}