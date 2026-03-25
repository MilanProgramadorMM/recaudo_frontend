import { Component, OnInit, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from '@components/page-title.component';
import { NgbModal, NgbPaginationModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CreditIntentionResponseDto, CreditIntentionService } from '@core/services/creditIntention.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-see-intention',
  imports: [PageTitleComponent, NgbPaginationModule, NgbModalModule, CommonModule, FormsModule],
  templateUrl: './see-intention.component.html',
  styleUrl: './see-intention.component.scss'
})
export class SeeIntentionComponent implements OnInit {
  loading = false;
  intentions: CreditIntentionResponseDto[] = [];
  filteredIntentions: CreditIntentionResponseDto[] = [];
  pagedIntentions: CreditIntentionResponseDto[] = [];

  currency = '$';
  searchTerm = '';
  page = 1;
  pageSize = 10;

  intentionType: 'GESTION' | 'DETALLE' = 'GESTION';

  //Intención seleccionada para el modal de detalle
  selectedIntention: CreditIntentionResponseDto | null = null;

  constructor(
    private creditIntentionService: CreditIntentionService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    // Leer el tipo desde el route data 
    this.intentionType = this.route.snapshot.data?.['type'] ?? 'GESTION';
    this.loadIntentions();
  }

  loadIntentions(): void {
    this.loading = true;

    const request$ = this.intentionType === 'DETALLE'
      ? this.creditIntentionService.getAllIntentionsIncludingClosed()
      : this.creditIntentionService.getIntentions();

    request$.subscribe({
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
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar las intenciones de crédito' });
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredIntentions = !term
      ? [...this.intentions]
      : this.intentions.filter(i =>
        i.fullname?.toLowerCase().includes(term) ||
        i.document?.toLowerCase().includes(term)
      );
    this.page = 1;
    this.updatePagedData();
  }

  updatePagedData(): void {
    const start = (this.page - 1) * this.pageSize;
    this.pagedIntentions = this.filteredIntentions.slice(start, start + this.pageSize);
  }

  onPageChange(): void {
    this.updatePagedData();
  }

  getShowingStart(): number {
    return this.filteredIntentions.length === 0 ? 0 : (this.page - 1) * this.pageSize + 1;
  }

  getShowingEnd(): number {
    const end = this.page * this.pageSize;
    return end > this.filteredIntentions.length ? this.filteredIntentions.length : end;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
  }

  manageIntention(intention: CreditIntentionResponseDto): void {
    this.router.navigate(['/operaciones/management-credit-intention', intention.id]);
  }

  openFormSimulateIntention(): void {
    this.router.navigate(['/operaciones/simulacion']);
  }

  /** Abre el modal de detalles (solo en modo DETALLE) */
  openDetailModal(intention: CreditIntentionResponseDto, content: TemplateRef<any>): void {
    this.selectedIntention = intention;
    this.modalService.open(content, { size: 'xl', centered: true, scrollable: true });
  }

  getStatusLabel(status?: string): string {
    switch (status) {
      case 'STUDY': return 'ESTUDIO';
      case 'APPROVED': return 'APROBACIÓN';
      case 'IMPROVEMENT': return 'PERFECCIONAMIENTO';
      case 'DISBURSEMENT': return 'DESEMBOLSO';
      case 'TERMINATED': return 'TERMINADO';
      case 'RECHAZED': return 'RECHAZADO';
      case 'PENDING': return 'PENDIENTE';
      default: return 'SIN ESTADO';
    }
  }

  getStatusLabelCustomer(status?: string): string {
    switch (status) {
      case 'APPROVED': return 'APROBADO';
      case 'PENDING': return 'PENDIENTE';
      case 'REJECTED': return 'RECHAZADO';
      default: return 'SIN ESTADO';
    }
  }

  getStatusBadgeClass(status?: string): string {
    switch (status) {
      case 'STUDY': return 'bg-warning';
      case 'APPROVED': return 'bg-primary';
      case 'IMPROVEMENT': return 'bg-secondary';
      case 'DISBURSEMENT': return 'bg-success';
      case 'TERMINATED': return 'bg-dark';
      case 'RECHAZED': return 'bg-danger';
      default: return 'bg-light text-dark';
    }
  }

  isLibreInversion(intention: CreditIntentionResponseDto): boolean {
    return !!intention.creditLineName?.toUpperCase().includes('LIBRE');
  }
}