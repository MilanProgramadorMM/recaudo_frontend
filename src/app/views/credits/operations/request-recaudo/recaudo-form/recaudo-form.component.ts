// recaudo-form-modal.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Glotypes, GlotypesService } from '@core/services/glotypes.service';
import { RecaudoService, RecaudoDetail } from '@core/services/recaudo.service';
import { AuthenticationService } from '@core/services/auth.service';
import { CreditService } from '@core/services/credit.service';

@Component({
  selector: 'app-recaudo-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recaudo-form.component.html',
  styleUrls: ['./recaudo-form.component.scss']
})
export class RecaudoFormComponent implements OnInit {
  @Input() cliente: any;
  @Input() asesorId: number | null = null;
  @Input() viewMode: boolean = false;

  recaudoForm: FormGroup;
  loading = false;
  submitted = false;

  paymentMetods: Glotypes[] = [];
  bancos: Glotypes[] = [];
  comprobanteTemp: File | null = null;

  quotaValue: number = 0;
  totalPaid: number = 0;
  remainingBalance: number = 0;
  loadingQuota: boolean = false;

  recaudos: RecaudoDetail[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private recaudoService: RecaudoService,
    private glotypesService: GlotypesService,
    private authService: AuthenticationService,
    private creditService: CreditService
  ) {
    this.recaudoForm = this.fb.group({
      metodoDesembolso: ['', Validators.required],
      banco: [''],
      numeroCuenta: [''],
      amount: ['', Validators.required],
      comprobante: [null]
    });
  }

  ngOnInit(): void {
    if (!this.viewMode) {
      this.loadPaymentMetods();
      this.loadBanks();
    }
    this.loadQuotaDetails();
    console.log('Cliente recibido:', this.cliente);
    console.log('Modo vista:', this.viewMode);
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

  loadQuotaDetails(): void {
    this.loadingQuota = true;

    this.recaudoService.getCreditPaymentStatus(this.cliente.creditId).subscribe({
      next: (status) => {
        console.log('Status completo:', status);

        const currentQuota = status.cuotas.find(
          q => q.quotaNumber === this.cliente.quotaNumber
        );

        console.log('Cuota encontrada:', currentQuota);

        if (currentQuota) {
          this.quotaValue = currentQuota.quotaValue;
          this.totalPaid = currentQuota.totalPaid || 0;
          this.remainingBalance = currentQuota.remainingBalance || currentQuota.quotaValue;

          console.log('Valores asignados:', {
            quotaValue: this.quotaValue,
            totalPaid: this.totalPaid,
            remainingBalance: this.remainingBalance
          });
        } else {
          this.quotaValue = this.cliente.clientCuota || 0;
          this.remainingBalance = this.quotaValue;
        }

        // NUEVO: Cargar historial de pagos si está en modo vista
        if (this.viewMode) {
          this.recaudos = status.recaudos.filter(
            r => r.quotaNumber === this.cliente.quotaNumber
          );
        }

        this.loadingQuota = false;
      },
      error: (err) => {
        console.error('Error cargando detalles de cuota:', err);
        this.quotaValue = this.cliente.clientCuota || 0;
        this.remainingBalance = this.quotaValue;
        this.loadingQuota = false;
      }
    });
  }

  get metodoSeleccionado(): string {
    const metodoId = this.recaudoForm.get('metodoDesembolso')?.value;
    if (!metodoId) return '';

    const metodo = this.paymentMetods.find(p => p.id === Number(metodoId));
    if (!metodo) return '';

    return this.normalizarNombreMetodo(metodo.name.trim());
  }

  get metodoSeleccionadoId(): number | null {
    const metodoId = this.recaudoForm.get('metodoDesembolso')?.value;
    return metodoId ? Number(metodoId) : null;
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

    this.recaudoForm.patchValue({
      banco: '',
      numeroCuenta: '',
      amount: '',
      comprobante: null
    });

    this.comprobanteTemp = null;

    // Limpiar validadores
    this.recaudoForm.get('banco')?.clearValidators();
    this.recaudoForm.get('numeroCuenta')?.clearValidators();
    this.recaudoForm.get('comprobante')?.clearValidators();
    this.recaudoForm.get('amount')?.clearValidators();

    // Aplicar validadores según el método NORMALIZADO
    if (metodoNombre === 'Transferencia') {
      this.recaudoForm.get('banco')?.setValidators(Validators.required);
      this.recaudoForm.get('numeroCuenta')?.setValidators([
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]+$/)
      ]);
      this.recaudoForm.get('amount')?.setValidators(Validators.required);
      this.recaudoForm.get('comprobante')?.setValidators(Validators.required);
    }

    if (metodoNombre === 'Nequi' || metodoNombre === 'Daviplata') {
      this.recaudoForm.get('numeroCuenta')?.setValidators([
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/)
      ]);
      this.recaudoForm.get('comprobante')?.setValidators(Validators.required);
      this.recaudoForm.get('amount')?.setValidators(Validators.required);
    }

    if (metodoNombre === 'Efectivo') {
      this.recaudoForm.get('amount')?.setValidators(Validators.required);
    }

    // Refrescar validaciones
    ['banco', 'numeroCuenta', 'comprobante', 'amount'].forEach(c =>
      this.recaudoForm.get(c)?.updateValueAndValidity()
    );

    this.recaudoForm.markAsPristine();
  }

  getNumeroCuentaError(): string {
    const control = this.recaudoForm.get('numeroCuenta');

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
    this.recaudoForm.patchValue({ comprobante: file });
    this.recaudoForm.get('comprobante')?.markAsTouched();
  }

  formatCurrency(controlName: string): void {
    const control = this.recaudoForm.get(controlName);
    if (!control) return;

    let value = control.value.toString().replace(/\D/g, '');
    if (value) {
      const numberValue = parseInt(value);
      control.setValue(numberValue.toLocaleString('es-CO'), { emitEvent: false });
    }
  }

  formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(Math.abs(valor));
  }

  parseCurrency(value: string): number {
    return parseInt(value.replace(/\D/g, '')) || 0;
  }

  close(): void {
    this.activeModal.dismiss();
  }

  guardarRecaudo(): void {
    this.submitted = true;

    if (this.recaudoForm.invalid) {
      this.recaudoForm.markAllAsTouched();
      Swal.fire({
        title: 'Formulario incompleto',
        text: 'Por favor complete todos los campos requeridos',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        customClass: { confirmButton: 'btn btn-warning' }
      });
      return;
    }

    this.loading = true;

    const amountValue = this.parseCurrency(this.recaudoForm.value.amount);

    if (amountValue <= 0) {
      this.loading = false;
      Swal.fire({
        title: 'Monto inválido',
        text: 'El valor a abonar debe ser mayor a 0',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        customClass: { confirmButton: 'btn btn-danger' }
      });
      return;
    }

    const data = {
      creditId: this.cliente.creditId,
      valuePaid: amountValue,
      paymentTypeId: this.recaudoForm.value.metodoDesembolso,
      bankId: this.recaudoForm.value.banco || null,
      accountNumber: this.recaudoForm.value.numeroCuenta || null,
      distributionType: 'RECAUDO_RUTA'
    };

    const formData = new FormData();

    formData.append(
      'data',
      new Blob([JSON.stringify(data)], { type: 'application/json' })
    );

    if (this.comprobanteTemp) {
      formData.append('file', this.comprobanteTemp);
    }

    this.recaudoService.processPayment(formData).subscribe({
      next: (result) => {
        this.loading = false;

        Swal.fire({
          title: '¡Éxito!',
          html: `
          <div class="text-start">
            <p class="mb-3"><strong>Recaudo procesado correctamente</strong></p>
            <ul class="list-unstyled">
              <li><strong>Total pagado:</strong> ${this.formatearMoneda(result.totalPaid)}</li>
              <li><strong>Cuotas pagadas:</strong> ${result.cuotasPagadas}</li>
              <li><strong>Cuotas faltantes:</strong> ${result.cuotasFaltantes}</li>
              ${result.saldoSobrante > 0 ? `
                <li><strong>Saldo sobrante:</strong> ${this.formatearMoneda(result.saldoSobrante)}</li>
              ` : ''}
            </ul>
          </div>
        `,
          icon: 'success',
          confirmButtonText: 'Aceptar',
          customClass: { confirmButton: 'btn btn-success' }
        }).then(() => this.activeModal.close(result));
      },

      error: (err) => {
        this.loading = false;

        let errorMessage = 'No se pudo procesar el recaudo';
        if (err.error?.message) errorMessage = err.error.message;

        Swal.fire({
          title: 'Error al procesar recaudo',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: 'Aceptar',
          customClass: { confirmButton: 'btn btn-danger' }
        });
      }
    });
  }
}