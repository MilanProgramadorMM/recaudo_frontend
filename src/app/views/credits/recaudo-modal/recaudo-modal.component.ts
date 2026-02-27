import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RecaudoService } from '@core/services/recaudo.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DelayPenaltyModalComponent } from './delay-penalty-modal/delay-penalty-modal.component';
import { CreditPaymentManagmentModalComponent } from './credit-payment-managment-modal/credit-payment-managment-modal.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ReversePaymentModalComponent } from './reverse-payment-modal/reverse-payment-modal.component';
import Swal from 'sweetalert2';
import { AuthenticationService } from '@core/services/auth.service';


interface CreditPaymentStatus {
  creditId: number;
  personId: number;
  quotaValue: number;
  periodQuantity: number;
  totalIntentionValue: number;
  totalInterestValue: number;
  totalCapitalValue: number;
  totalCuotas: number;
  cuotasPagadas: number;
  cuotasPendientes: number;
  totalPagado: number;
  totalPendiente: number;
  porcentajePagado: number;
  cuotas: QuotaDetail[];
  recaudos: RecaudoDetail[];
}

interface QuotaDetail {
  quotaId: number;
  quotaNumber: number;
  expirationDate: string;
  liquidated: string;
  quotaValue: number;
  portfolioInsurancePending: number;
  lifeInsurancePending: number;
  interestPending: number;
  investmentPending: number;
  totalPending: number;
  isPaid: boolean;
  isOverdue: boolean;
  delayPenalty: number;
  daysOverdue: number;
}

interface RecaudoDetail {
  recaudoId: number;
  quotaNumber: number;
  conceptName: string;
  valuePaid: number;
  investmentValue: number;
  interestValue: number;
  lifeInsurance: number;
  portfolioInsurance: number;
  userCreate: string;
  createdAt: string;
}

enum UserRole {
  ASISTENTE = 'BACKOFFICE',
  ASESOR = 'Asesor',
  ADMIN = 'Administrador'
}


@Component({
  selector: 'app-recaudo-modal',
  imports: [CommonModule, NgbDropdownModule],
  templateUrl: './recaudo-modal.component.html',
  styleUrl: './recaudo-modal.component.scss'
})
export class RecaudoModalComponent {

  @Input() creditId!: number;

  loading = true;
  error = false;
  errorMessage = '';

  paymentStatus: CreditPaymentStatus | null = null;
  currency = '$';

  currentRole: string = '';
  isAsesor = false;
  isAdmin = false;
  isAsistente = false;


  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private recaudoService: RecaudoService,
    private authService: AuthenticationService

  ) { }

  ngOnInit(): void {
    this.currentRole = this.authService.getUserRole() || '';
    this.isAsesor = this.currentRole === UserRole.ASESOR;
    this.isAdmin = this.currentRole === UserRole.ADMIN;
    this.isAsistente = this.currentRole === UserRole.ASISTENTE;
    this.loadRecaudoStatus();
  }

  loadRecaudoStatus(): void {
    this.loading = true;
    this.error = false;

    this.recaudoService.getCreditPaymentStatus(this.creditId).subscribe({
      next: (response) => {
        this.paymentStatus = response;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar estado de pago:', err);
        this.error = true;
        this.errorMessage = 'Error al cargar la información del crédito';
        this.loading = false;
      }
    });
  }

  formatCurrency(value: number): string {
    if (value === null || value === undefined) return '0';
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(Math.abs(value));
  }

  formatCurrencyValue(value: number): string {
    if (value === null || value === undefined) return '0';
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value); // Sin Math.abs()
  }


  formatDate(dateString: string): string {
    if (!dateString) return '';

    const [year, month, day] = dateString.split('-');
    const date = new Date(Number(year), Number(month) - 1, Number(day));

    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  formatDateTime(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTotalPagadoCuota(quotaNumber: number): number {
    if (!this.paymentStatus) return 0;

    return this.paymentStatus.recaudos
      .filter(r => r.quotaNumber === quotaNumber)
      .filter(r => r.conceptName == 'RECAUDO EN RUTA')
      .reduce((sum, r) => sum + Math.abs(r.valuePaid), 0);
  }

  getEstadoCuota(cuota: QuotaDetail): string {
    if (cuota.isPaid) return 'PAGADA';
    if (cuota.isOverdue) return 'VENCIDA';
    return 'PENDIENTE';
  }

  getEstadoCuotaClass(cuota: QuotaDetail): string {
    if (cuota.isPaid) return 'badge bg-success';
    if (cuota.isOverdue) return 'badge bg-red-custom';
    return 'badge bg-warning';
  }

  close(): void {
    this.activeModal.dismiss();
  }

  getTotalInteresesMoratorios(): number {
    if (!this.paymentStatus) return 0;

    return this.paymentStatus.cuotas
      .reduce((sum, cuota) => sum + (cuota.delayPenalty || 0), 0);
  }

  getTotalRecaudoEnRuta(): number {
    if (!this.paymentStatus) return 0;

    return this.paymentStatus.recaudos
      .filter(r => r.conceptName === 'RECAUDO EN RUTA')
      .reduce((sum, r) => sum + r.valuePaid, 0);
  }

  openDelayPenaltyModal(): void {
    const modalRef = this.modalService.open(DelayPenaltyModalComponent, {
      size: 'xl',
      backdrop: 'static',
      centered: true
    });

    modalRef.componentInstance.creditId = this.creditId;

    modalRef.result.then(
      (result) => {
        if (result === 'saved') {
          this.loadRecaudoStatus();
        }
      },
      () => {
      }
    );
  }

  openPaymentModal(distributionType: 'NORMAL' | 'RECAUDO_CAPITAL' | 'RECAUDO_INTERESES' | 'AJUSTE_PERDIDA'): void {
    const modalRef = this.modalService.open(CreditPaymentManagmentModalComponent, {
      size: 'lg',
      backdrop: 'static',
      centered: true
    });

    modalRef.componentInstance.creditId = this.creditId;
    modalRef.componentInstance.distributionType = distributionType;

    modalRef.result.then(
      (result) => {
        if (result === 'saved') {
          this.loadRecaudoStatus();
        }
      },
      () => { }
    );
  }

  openReverseModal(reverseType: 'RECAUDO' | 'CAPITAL' | 'INTERESES'): void {
    if (!this.paymentStatus || this.paymentStatus.recaudos.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Sin recaudos',
        text: 'No hay recaudos registrados para este crédito'
      });
      return;
    }

    const modalRef = this.modalService.open(ReversePaymentModalComponent, {
      size: 'xl',
      backdrop: 'static',
      centered: true
    });

    modalRef.componentInstance.creditId = this.creditId;
    modalRef.componentInstance.reverseType = reverseType;
    modalRef.componentInstance.recaudos = [...this.paymentStatus.recaudos];

    modalRef.result.then(
      (result) => {
        if (result === 'reversed') {
          this.loadRecaudoStatus();
        }
      },
      () => { }
    );
  }

  //IDENTIFICAR NATURALEZA DE CREDITO
  getRecaudoNaturaleza(conceptName: string): 'DEBITO' | 'CREDITO' {
    const conceptosCredito = ['RECAUDO EN RUTA', 'NOTA CREDITO', 'LIQUIDACIÓN ANTICIPADA CREDITO', 'AJUSTE POR PERDIDA'];
    const conceptosDebito = ['NOTA DEBITO', 'REFINANCIACION'];

    if (conceptosCredito.includes(conceptName)) {
      return 'CREDITO';
    } else if (conceptosDebito.includes(conceptName)) {
      return 'DEBITO';
    }

    return 'DEBITO'; // Por defecto
  }

  getRecaudoClass(conceptName: string): string {
    const naturaleza = this.getRecaudoNaturaleza(conceptName);
    return naturaleza === 'CREDITO' ? 'text-success' : 'text-danger';
  }

}
