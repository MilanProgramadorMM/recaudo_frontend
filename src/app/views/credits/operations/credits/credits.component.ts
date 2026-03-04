import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from '@components/page-title.component';
import { NgbModal, NgbPaginationModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CreditIntentionResponseDto, CreditIntentionService } from '@core/services/creditIntention.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CreditResponseDto, CreditService } from '@core/services/credit.service';
import { RecaudoModalComponent } from '@views/credits/recaudo-modal/recaudo-modal.component';

@Component({
  selector: 'app-credits',
  imports: [CommonModule, PageTitleComponent, NgbPaginationModule, NgbModalModule, CommonModule, FormsModule],
  templateUrl: './credits.component.html',
  styleUrl: './credits.component.scss'
})
export class CreditsComponent {

  loading: boolean = false;
  intentions: CreditResponseDto[] = [];
  filteredIntentions: CreditResponseDto[] = [];
  pagedIntentions: CreditResponseDto[] = [];

  currency = '$';
  searchTerm: string = '';

  page: number = 1;
  pageSize: number = 10;

  constructor(
    private creditservice: CreditService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.loadCredit();
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
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredIntentions = [...this.intentions];
    } else {
      this.filteredIntentions = this.intentions.filter(intention =>
        intention.fullname?.toLowerCase().includes(term) ||
        intention.document?.toLowerCase().includes(term) ||
        intention.zoneName?.toLowerCase().includes(term)
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
