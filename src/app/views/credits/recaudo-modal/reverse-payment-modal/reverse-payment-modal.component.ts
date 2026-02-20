import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RecaudoService, RecaudoDetail } from '@core/services/recaudo.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-reverse-payment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reverse-payment-modal.component.html',
  styleUrl: './reverse-payment-modal.component.scss'
})
export class ReversePaymentModalComponent {
  @Input() creditId!: number;
  @Input() reverseType: 'RECAUDO' | 'CAPITAL' | 'INTERESES' = 'RECAUDO';
  @Input() recaudos: RecaudoDetail[] = [];

  selectedRecaudos: Set<number> = new Set();
  loading = false;

  constructor(
    public activeModal: NgbActiveModal,
    private recaudoService: RecaudoService
  ) { }

  ngOnInit(): void {
    console.log(this.recaudos); this.filterRecaudos();
  }

  get title(): string {
    switch (this.reverseType) {
      case 'RECAUDO':
        return 'Reversar recaudos completos';
      case 'CAPITAL':
        return 'Reversar pagos a capital';
      case 'INTERESES':
        return 'Reversar pagos a intereses';
    }
  }

  get description(): string {
    switch (this.reverseType) {
      case 'RECAUDO':
        return 'Seleccione uno o más recaudos completos para reversar. Se revertirán todos los componentes del pago.';
      case 'CAPITAL':
        return 'Seleccione los pagos a capital que desea reversar. Solo se revertirá el componente de capital.';
      case 'INTERESES':
        return 'Seleccione los pagos a intereses que desea reversar. Solo se revertirá el componente de intereses.';
    }
  }

  filterRecaudos(): void {
    switch (this.reverseType) {

      case 'RECAUDO':
        this.recaudos = this.recaudos.filter(r =>
          r.valuePaid !== 0 && r.valuePaid !== null
        );
        break;

      case 'CAPITAL':
        this.recaudos = this.recaudos.filter(r =>
          r.investmentValue !== 0 && r.investmentValue !== null
        );
        break;

      case 'INTERESES':
        this.recaudos = this.recaudos.filter(r =>
          r.interestValue !== 0 && r.interestValue !== null
        );
        break;
    }
  }


  toggleSelection(recaudoId: number): void {
    if (this.selectedRecaudos.has(recaudoId)) {
      this.selectedRecaudos.delete(recaudoId);
    } else {
      this.selectedRecaudos.add(recaudoId);
    }
  }

  isSelected(recaudoId: number): boolean {
    return this.selectedRecaudos.has(recaudoId);
  }

  selectAll(): void {
    this.recaudos.forEach(r => this.selectedRecaudos.add(r.recaudoId));
  }

  deselectAll(): void {
    this.selectedRecaudos.clear();
  }

  getTotalSelected(): number {
    return this.recaudos
      .filter(r => this.selectedRecaudos.has(r.recaudoId))
      .reduce((sum, r) => {
        switch (this.reverseType) {
          case 'CAPITAL':
            return sum + Math.abs(r.investmentValue);
          case 'INTERESES':
            return sum + Math.abs(r.interestValue);
          default:
            return sum + Math.abs(r.valuePaid);
        }
      }, 0);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.abs(value));
  }

  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  onSubmit(): void {
    if (this.selectedRecaudos.size === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Selección requerida',
        text: 'Debe seleccionar al menos un pago para reversar'
      });
      return;
    }

    Swal.fire({
      title: '¿Confirmar reversión?',
      html: `
        <p>Se revertirán <strong>${this.selectedRecaudos.size}</strong> pago(s)</p>
        <p>Total a reversar: <strong>$${this.formatCurrency(this.getTotalSelected())}</strong></p>
        <p class="text-danger">Esta acción no se puede deshacer</p>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, reversar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d'
    }).then((result) => {
      if (result.isConfirmed) {
        this.processReverse();
      }
    });
  }

  processReverse(): void {
    this.loading = true;

    const request = {
      creditId: this.creditId,
      recaudoIds: Array.from(this.selectedRecaudos)
    };

    let observable;
    switch (this.reverseType) {
      case 'CAPITAL':
        observable = this.recaudoService.reverseCapital(request);
        break;
      case 'INTERESES':
        observable = this.recaudoService.reverseInterest(request);
        break;
      default:
        observable = this.recaudoService.reverseRecaudos(request);
        break;
    }

    observable.subscribe({
      next: (result) => {
        this.loading = false;
        Swal.fire({
          icon: 'success',
          title: '¡Reversión exitosa!',
          html: `
            <p>Total revertido: <strong>$${this.formatCurrency(result.totalPaid)}</strong></p>
            <p>Registros afectados: <strong>${this.selectedRecaudos.size}</strong></p>
          `,
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.activeModal.close('reversed');
        });
      },
      error: (error) => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error al reversar',
          text: error.error?.message || 'Ocurrió un error inesperado'
        });
      }
    });
  }

  close(): void {
    this.activeModal.dismiss();
  }
}
