// credit-payment-managment-modal.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RecaudoService } from '@core/services/recaudo.service';
import { Glotypes, GlotypesService } from '@core/services/glotypes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-credit-payment-managment-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './credit-payment-managment-modal.component.html',
  styleUrl: './credit-payment-managment-modal.component.scss'
})
export class CreditPaymentManagmentModalComponent implements OnInit {
  @Input() creditId!: number;
  @Input() distributionType: 'NORMAL' | 'RECAUDO_CAPITAL' | 'RECAUDO_INTERESES' | 'AJUSTE_PERDIDA' = 'NORMAL';

  paymentForm!: FormGroup;
  loading = false;
  submitted = false;

  paymentMetods: Glotypes[] = [];
  bancos: Glotypes[] = [];
  comprobanteTemp: File | null = null;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private recaudoService: RecaudoService,
    private glotypesService: GlotypesService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadPaymentMetods();
    this.loadBanks();
  }

  initForm(): void {
    this.paymentForm = this.fb.group({
      valuePaid: ['', [Validators.required, Validators.min(1)]],
      paymentTypeId: ['', Validators.required],
      bankId: [null],
      accountNumber: [''],
      comprobante: [null]
    });
  }

  loadPaymentMetods(): void {
    this.glotypesService.getGlotypesByKey('TIPPAG').subscribe({
      next: (data) => {
        this.paymentMetods = data;
      },
      error: (err) => {
        console.error('Error cargando métodos de pago:', err);
      }
    });
  }

  loadBanks(): void {
    this.glotypesService.getGlotypesByKey('TIPBAN').subscribe({
      next: (data) => {
        this.bancos = data;
      },
      error: (err) => {
        console.error('Error cargando bancos:', err);
      }
    });
  }

  get distributionLabel(): string {
    switch (this.distributionType) {
      case 'NORMAL':
        return 'Recaudo Normal';
      case 'RECAUDO_CAPITAL':
        return 'Recaudo Solo Capital';
      case 'RECAUDO_INTERESES':
        return 'Recaudo Solo Intereses';
      case 'AJUSTE_PERDIDA':
        return 'Ajuste por Pérdida';
      default:
        return 'Recaudo';
    }
  }

  get distributionDescription(): string {
    switch (this.distributionType) {
      case 'NORMAL':
        return 'El pago se distribuirá recorriendo las cuotas en orden: Seguro de Cartera → Seguro de Vida → Intereses → Capital';
      case 'RECAUDO_CAPITAL':
        return 'El pago se registrará directamente como abono a capital, sin afectar cuotas específicas ni intereses';
      case 'RECAUDO_INTERESES':
        return 'El pago se registrará directamente como abono a intereses, sin afectar cuotas específicas ni capital';
      case 'AJUSTE_PERDIDA':
        return 'Ajuste de crédito por pérdida. El pago se distribuirá recorriendo las cuotas pendientes';
      default:
        return '';
    }
  }

  get metodoSeleccionado(): string {
    const metodoId = this.paymentForm.get('paymentTypeId')?.value;
    if (!metodoId) return '';

    const metodo = this.paymentMetods.find(p => p.id === Number(metodoId));
    if (!metodo) return '';

    return this.normalizarNombreMetodo(metodo.name.trim());
  }

  private normalizarNombreMetodo(nombreBD: string): string {
    const nombre = nombreBD.toUpperCase().trim();

    switch (nombre) {
      case 'NEQUI':
        return 'Nequi';
      case 'DAVIPLATA':
        return 'Daviplata';
      case 'EFECTIVO':
        return 'Efectivo';
      case 'TRANSFERENCIA BANCARIA':
      case 'TRANSFERENCIA':
        return 'Transferencia';
      default:
        return nombreBD.charAt(0).toUpperCase() + nombreBD.slice(1).toLowerCase();
    }
  }

  onMetodoChange(): void {
    const metodoNombre = this.metodoSeleccionado;

    // Resetear campos condicionales
    this.paymentForm.patchValue({
      bankId: null,
      accountNumber: '',
      comprobante: null
    });

    this.comprobanteTemp = null;

    // Limpiar validadores
    this.paymentForm.get('bankId')?.clearValidators();
    this.paymentForm.get('accountNumber')?.clearValidators();
    this.paymentForm.get('comprobante')?.clearValidators();

    // Aplicar validadores según el método
    if (metodoNombre === 'Transferencia') {
      this.paymentForm.get('bankId')?.setValidators(Validators.required);
      this.paymentForm.get('accountNumber')?.setValidators([
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]+$/)
      ]);
      this.paymentForm.get('comprobante')?.setValidators(Validators.required);
    }

    if (metodoNombre === 'Nequi' || metodoNombre === 'Daviplata') {
      this.paymentForm.get('accountNumber')?.setValidators([
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/)
      ]);
      this.paymentForm.get('comprobante')?.setValidators(Validators.required);
    }

    // Refrescar validaciones
    ['bankId', 'accountNumber', 'comprobante'].forEach(c =>
      this.paymentForm.get(c)?.updateValueAndValidity()
    );

    this.paymentForm.markAsPristine();
  }

  getNumeroCuentaError(): string {
    const control = this.paymentForm.get('accountNumber');

    if (!control || !control.errors) return '';

    if (control.errors['required']) {
      return 'El número de cuenta es obligatorio';
    }

    if (control.errors['pattern']) {
      if (this.metodoSeleccionado === 'Nequi' || this.metodoSeleccionado === 'Daviplata') {
        return 'Debe contener exactamente 10 números';
      }
      return 'Solo se permiten letras y números';
    }

    return 'Valor inválido';
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.comprobanteTemp = file;
    this.paymentForm.patchValue({ comprobante: file });
    this.paymentForm.get('comprobante')?.markAsTouched();
  }

  formatCurrency(controlName: string): void {
    const control = this.paymentForm.get(controlName);
    if (!control) return;

    let value = control.value.toString().replace(/\D/g, '');
    if (value) {
      const numberValue = parseInt(value);
      const formatted = numberValue.toLocaleString('es-CO');
      control.setValue(formatted, { emitEvent: false });
    }
  }

  parseCurrency(value: string): number {
    return parseInt(value.replace(/\D/g, '')) || 0;
  }

  formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.abs(valor));
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor complete todos los campos requeridos'
      });
      return;
    }

    const amountValue = this.parseCurrency(this.paymentForm.value.valuePaid);

    if (amountValue <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Monto inválido',
        text: 'El valor a pagar debe ser mayor a 0'
      });
      return;
    }

    const formData = new FormData();

    const paymentData = {
      creditId: this.creditId,
      valuePaid: amountValue,
      paymentTypeId: this.paymentForm.value.paymentTypeId,
      bankId: this.paymentForm.value.bankId || null,
      accountNumber: this.paymentForm.value.accountNumber || null,
      distributionType: this.distributionType  
    };

    formData.append('data', new Blob([JSON.stringify(paymentData)], { type: 'application/json' }));

    if (this.comprobanteTemp) {
      formData.append('file', this.comprobanteTemp);
    }

    this.loading = true;

    this.recaudoService.processPayment(formData).subscribe({
      next: (result) => {
        this.loading = false;

        // Mensaje personalizado según el tipo de recaudo
        let successMessage = '';

        if (this.distributionType === 'RECAUDO_CAPITAL') {
          successMessage = `
            <div class="text-start">
              <p><strong>Recaudo a capital registrado exitosamente</strong></p>
              <p><strong>Total aplicado:</strong> $${this.formatearMoneda(result.totalPaid)}</p>
              <p class="text-muted small">El monto fue registrado directamente como abono a capital</p>
            </div>
          `;
        } else if (this.distributionType === 'RECAUDO_INTERESES') {
          successMessage = `
            <div class="text-start">
              <p><strong>Recaudo a intereses registrado exitosamente</strong></p>
              <p><strong>Total aplicado:</strong> $${this.formatearMoneda(result.totalPaid)}</p>
              <p class="text-muted small">El monto fue registrado directamente como abono a intereses</p>
            </div>
          `;
        } else {
          // NORMAL o AJUSTE_PERDIDA
          successMessage = `
            <div class="text-start">
              <p><strong>Total pagado:</strong> $${this.formatearMoneda(result.totalPaid)}</p>
              <p><strong>Cuotas liquidadas:</strong> ${result.cuotasPagadas}</p>
              <p><strong>Cuotas faltantes:</strong> ${result.cuotasFaltantes}</p>
              ${result.saldoSobrante > 0 ? `<p class="text-warning"><strong>Saldo sobrante:</strong> $${this.formatearMoneda(result.saldoSobrante)}</p>` : ''}
            </div>
          `;
        }

        Swal.fire({
          icon: 'success',
          title: '¡Pago procesado!',
          html: successMessage,
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.activeModal.close('saved');
        });
      },
      error: (error) => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error al procesar pago',
          text: error.error?.message || 'Ocurrió un error inesperado'
        });
      }
    });
  }

  close(): void {
    this.activeModal.dismiss();
  }
}