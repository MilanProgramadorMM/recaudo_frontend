import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AgreementResponse,
  CreateAgreementRequest,
  DelayPenaltyAgreementService,
  PendingQuotaForAgreement
} from '@core/services/delay-penalty-agreement.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-delay-penalty-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './delay-penalty-modal.component.html',
  styleUrl: './delay-penalty-modal.component.scss'
})
export class DelayPenaltyModalComponent implements OnInit {

  @Input() creditId!: number;

  loading = true;
  error = false;
  errorMessage = '';
  saving = false;

  pendingQuotas: PendingQuotaForAgreement[] = [];
  selectedQuotas: number[] = [];

  discountValue: number | null = null;
  discountValueFormatted: string = '';
  paymentDate: string = '';

  currency = '$';

  constructor(
    public activeModal: NgbActiveModal,
    private agreementService: DelayPenaltyAgreementService
  ) { }

  ngOnInit(): void {
    this.paymentDate = new Date().toLocaleDateString('en-CA');
    this.loadPendingQuotas();
  }

  // ── Carga ────────────────────────────────────────────────────
  loadPendingQuotas(): void {
    this.loading = true;
    this.error = false;

    this.agreementService.getPendingQuotasWithPenalties(this.creditId).subscribe({
      next: (response) => {
        this.pendingQuotas = response.data || [];
        this.loading = false;

        if (this.pendingQuotas.length === 0) {
          Swal.fire({
            icon: 'info',
            title: 'Sin cuotas vencidas',
            text: 'No hay cuotas vencidas con intereses moratorios para este crédito',
            confirmButtonColor: '#dc3545'
          }).then(() => this.activeModal.dismiss());
        }
      },
      error: (err) => {
        console.error('Error al cargar cuotas:', err);
        this.error = true;
        this.errorMessage = 'Error al cargar las cuotas pendientes';
        this.loading = false;
      }
    });
  }

  // ── Selección ────────────────────────────────────────────────
  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedQuotas = checked
      ? this.pendingQuotas.map(q => q.quotaId)
      : [];
  }

  toggleQuotaSelection(quotaId: number): void {
    this.selectedQuotas = this.isQuotaSelected(quotaId)
      ? this.selectedQuotas.filter(id => id !== quotaId)
      : [...this.selectedQuotas, quotaId];
  }

  isQuotaSelected(quotaId: number): boolean {
    return this.selectedQuotas.includes(quotaId);
  }

  areAllSelected(): boolean {
    return this.pendingQuotas.length > 0 &&
      this.selectedQuotas.length === this.pendingQuotas.length;
  }

  // ── Cálculos ─────────────────────────────────────────────────
  getTotalProjectedValue(): number {
    return this.pendingQuotas
      .filter(q => this.selectedQuotas.includes(q.quotaId))
      .reduce((sum, q) => sum + q.delayPenalty, 0);
  }

  getAgreedValue(): number {
    return Math.max(0, this.getTotalProjectedValue() - (this.discountValue ?? 0));
  }

  // ── Guardar ──────────────────────────────────────────────────
  saveAgreements(): void {
    if (this.selectedQuotas.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Selección requerida',
        text: 'Debe seleccionar al menos una cuota',
        confirmButtonColor: '#dc3545'
      });
      return;
    }

    if (!this.paymentDate) {
      Swal.fire({
        icon: 'warning',
        title: 'Fecha requerida',
        text: 'Debe especificar la fecha de pago del pacto',
        confirmButtonColor: '#dc3545'
      });
      return;
    }

    const discount = this.discountValue ?? 0;

    if (discount > this.getTotalProjectedValue()) {
      Swal.fire({
        icon: 'error',
        title: 'Descuento inválido',
        text: 'El descuento no puede ser mayor al valor proyectado',
        confirmButtonColor: '#dc3545'
      });
      return;
    }

    Swal.fire({
      title: '¿Confirmar pacto de pago?',
      html: `
        <div class="text-start">
          <p><strong>Cuotas seleccionadas:</strong> ${this.selectedQuotas.length}</p>
          <p><strong>Descuento:</strong> $${this.formatCurrency(discount)}</p>
          <p><strong>Valor pactado:</strong> $${this.formatCurrency(this.getAgreedValue())}</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, crear pacto',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) this.createAgreement();
    });
  }

  private createAgreement(): void {
    this.saving = true;

    // Construir lista de cuotas con todos los datos que necesita el detalle
    const quotas = this.selectedQuotas.map(quotaId => {
      const quota = this.pendingQuotas.find(q => q.quotaId === quotaId)!;
      return {
        cuotaId: quota.quotaId,
        daysLate: quota.daysOverdue,
        pastduePeriods: quota.pastduePeriods,
        balancePending: quota.remainingBalance,
        delayPenalty: quota.delayPenalty
      };
    });

    const request: CreateAgreementRequest = {
      creditId: this.creditId,
      discountValue: this.discountValue ?? 0,
      quotas
    };

    this.agreementService.createAgreement(request).subscribe({
      next: (response) => {
        this.saving = false;
        const agreement: AgreementResponse = response.data;

        Swal.fire({
          icon: 'success',
          title: '¡Pacto creado!',
          html: `
            <div class="text-start">
              <p><strong>Valor pactado:</strong> $${this.formatCurrency(agreement.agreedValue)}</p>
              <p><strong>Cuotas incluidas:</strong> ${agreement.detalles.length}</p>
            </div>
          `,
          confirmButtonColor: '#dc3545'
        }).then(() => this.activeModal.close('saved'));
      },
      error: (err) => {
        console.error('Error al crear pacto:', err);
        this.saving = false;

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error?.message || 'Error al crear el pacto de pago',
          confirmButtonColor: '#dc3545'
        });
      }
    });
  }

  // ── Formato ──────────────────────────────────────────────────
  formatCurrency(value: number): string {
    if (value == null) return '0';
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(Math.abs(value));
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return new Date(Number(year), Number(month) - 1, Number(day))
      .toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' });
  }

  formatCurrencyString(event: Event): void {
    const raw = (event.target as HTMLInputElement).value.replace(/\D/g, '');
    if (!raw) {
      this.discountValue = null;
      this.discountValueFormatted = '';
      return;
    }
    this.discountValue = Number(raw);
    this.discountValueFormatted = this.discountValue.toLocaleString('es-CO');
  }

  close(): void {
    this.activeModal.dismiss();
  }
}