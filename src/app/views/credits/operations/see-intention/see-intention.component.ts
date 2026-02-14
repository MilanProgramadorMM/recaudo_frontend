import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from '@components/page-title.component';
import { NgbModal, NgbPaginationModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CreditIntentionResponseDto, CreditIntentionService } from '@core/services/creditIntention.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-see-intention',
  imports: [PageTitleComponent, NgbPaginationModule, NgbModalModule, CommonModule, FormsModule],
  templateUrl: './see-intention.component.html',
  styleUrl: './see-intention.component.scss'
})
export class SeeIntentionComponent {
  loading: boolean = false;
  intentions: CreditIntentionResponseDto[] = [];
  filteredIntentions: CreditIntentionResponseDto[] = [];
  pagedIntentions: CreditIntentionResponseDto[] = [];

  currency = '$';
  searchTerm: string = '';

  page: number = 1;
  pageSize: number = 10;

  constructor(
    private creditIntentionService: CreditIntentionService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.loadIntentions();
  }

  loadIntentions(): void {
    this.loading = true;
    this.creditIntentionService.getIntentions().subscribe({
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
          text: 'No se pudieron cargar las intenciones de crédito'
        });
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredIntentions = [...this.intentions];
    } else {
      this.filteredIntentions = this.intentions.filter(intention =>
        intention.fullname?.toLowerCase().includes(term) ||
        intention.document?.toLowerCase().includes(term)
      );
    }

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

  manageIntention(intention: CreditIntentionResponseDto): void {
    this.router.navigate(['/operaciones/management-credit-intention', intention.id]);
  }

  openFormSimulateIntention(): void {
    this.router.navigate(['/operaciones/simulacion']);
  }

  getStatusLabel(status?: string): string {
    switch (status) {
      case 'STUDY':
        return 'ESTUDIO';
      case 'APPROVED':
        return 'APROBACIÓN';
      case 'IMPROVEMENT':
        return 'PERFECCIONAMIENTO';
      case 'DISBURSEMENT':
        return 'DESEMBOLSO';
      default:
        return 'SIN ESTADO';
    }
  }

  isLibreInversion(intention: CreditIntentionResponseDto): boolean {
    return intention.creditLineName?.toUpperCase().includes('LIBRE');
  }


}
