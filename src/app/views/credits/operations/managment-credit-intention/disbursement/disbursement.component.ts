import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreditIntentionResponseDto, CreditIntentionService, UpdateFechaTentativaCreditIntentionUpdateDto } from '@core/services/creditIntention.service';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { Glotypes, GlotypesService } from '@core/services/glotypes.service';
import { MatDialog } from '@angular/material/dialog';
import { LoadingComponent } from '@views/ui/loading/loading.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import Swal from 'sweetalert2';
import { finalize, switchMap } from 'rxjs';
import { PersonRegisterDto, PersonService } from '@core/services/person.service';
import { CreditRegisterDto, CreditService } from '@core/services/credit.service';
import { CreditIntentionDisbursementService, Desembolso, DisbursementMetadata, DisbursementResponseDto } from '@core/services/creditIntentionDisbursement.service';

@Component({
  selector: 'app-disbursement',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatRadioModule
  ],
  templateUrl: './disbursement.component.html',
  styleUrl: './disbursement.component.scss'
})
export class DisbursementComponent {
  private _credit!: CreditIntentionResponseDto;
  loading: boolean = false;

  //Output para notificar al padre
  @Output() allActivitiesCompleted = new EventEmitter<boolean>();

  //Variable para trackear el estado
  isPhaseCompleted = false;

  today: string = (() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  })();

  minDate: string = '';


  @Input()
  set credit(value: CreditIntentionResponseDto) {
    if (!value) return;

    this._credit = value;
    if (this.form1) {
      this.patchFormWithDate();
    }
  }

  get credit(): CreditIntentionResponseDto {
    return this._credit;
  }

  @ViewChild(MatStepper) stepper!: MatStepper;

  form1!: FormGroup;
  form2!: FormGroup;
  form3!: FormGroup;

  isLinear = true;
  submitted = false;
  errorMessage = '';
  isSaving = false;
  fechaTentativaOriginal!: string;
  documentTypes: Glotypes[] = [];
  genderGlotypes: Glotypes[] = [];
  bancos: Glotypes[] = [];
  paymentMetods: Glotypes[] = [];
  desembolsosCargadosDeBD: boolean = false;
  decisionTomada: string = '';
  desembolsos: any[] = []; // Array para almacenar los desembolsos
  comprobanteTemp: File | null = null; // Archivo temporal del comprobante

  // Propiedades para foto del producto
  productoFoto: File | null = null;
  productoFotoPreview: string | null = null;




  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private creditIntencionService: CreditIntentionService,
    private personService: PersonService,
    private creditService: CreditService,
    private glotypesService: GlotypesService,
    private disbursementService: CreditIntentionDisbursementService
  ) { }

  ngOnInit(): void {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    this.today = `${yyyy}-${mm}-${dd}`;
    this.initializeForms();
    this.loadBanks();
    this.loadPaymentMetods();
    if (this.credit) {
      this.patchFormWithDate();
      this.loadExistingDisbursements();
    }
  }

  /**
   * Verifica si la línea de crédito es "LÍNEA DE FINANCIAMIENTO"
   */
  isLineaFinanciamiento(): boolean {
    return this.credit?.creditLineName === 'LÍNEA DE FINANCIAMIENTO';
  }

  private getCreditLineType(): string {
    return this.normalizeText(this.credit.creditLineName);
  }


  private normalizeText(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .trim();
  }

  private initializeForms(): void {
    const fechaFormateada = this.formatDateForInput(this.credit.fechaInicio);
    this.fechaTentativaOriginal = fechaFormateada;

    this.form1 = this.fb.group({
      fecha_inicio_tentativa: ['', Validators.required]
    });

    // Form2 - Campos sin deshabilitar nada
    this.form2 = this.fb.group({
      metodoDesembolso: [''],
      banco: [''],
      numeroCuenta: [''],
      amount: [''],
      comprobante: [null],
      // Campos para LÍNEA DE FINANCIAMIENTO
      productoReferencia: ['', this.isLineaFinanciamiento() ? Validators.required : []],
      productoFoto: [null, this.isLineaFinanciamiento() ? Validators.required : []]
    });

    this.form3 = this.fb.group({
      decision: ['', Validators.required]
    });
  }

  formatCurrency(controlName: string) {
    const control = this.form2.get(controlName);
    if (!control) return;

    const rawValue = control.value;
    if (rawValue === null || rawValue === '') return;

    // Solo números
    const numericValue = rawValue.toString().replace(/\D/g, '');

    if (numericValue === '') {
      control.setValue('', { emitEvent: false });
      return;
    }

    const formatted = Number(numericValue).toLocaleString('es-CO');

    control.setValue(formatted, { emitEvent: false });
  }


  loadBanks() {
    this.glotypesService.getGlotypesByKey('TIPBAN').subscribe({
      next: (data) => {
        this.bancos = data;
      },
      error: (err) => {
        console.error('Error cargando opciones:', err);
      }
    });
  }

  loadPaymentMetods() {
    this.glotypesService.getGlotypesByKey('TIPPAG').subscribe({
      next: (data) => {
        this.paymentMetods = data;
      },
      error: (err) => {
        console.error('Error cargando opciones:', err);
      }
    });
  }

  get metodoSeleccionado(): string {
    const metodoId = this.form2.get('metodoDesembolso')?.value;
    if (!metodoId) return '';

    const metodo = this.paymentMetods.find(p => p.id === Number(metodoId));
    if (!metodo) return '';

    // Normalizar el nombre: "TRANSFERENCIA BANCARIA" → "Transferencia"
    const nombre = metodo.name.trim();

    // Mapear nombres de BD a nombres normalizados
    const nombreNormalizado = this.normalizarNombreMetodo(nombre);
    return nombreNormalizado;
  }

  get metodoSeleccionadoId(): number | null {
    const metodoId = this.form2.get('metodoDesembolso')?.value;
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
        // Fallback: capitalizar primera letra
        return nombreBD.charAt(0).toUpperCase() + nombreBD.slice(1).toLowerCase();
    }
  }

  onMetodoChange(): void {
    const metodoNombre = this.metodoSeleccionado;

    this.form2.patchValue({
      banco: '',
      numeroCuenta: '',
      amount: '',
      comprobante: null
    });

    this.comprobanteTemp = null;

    // Limpiar validadores
    this.form2.get('banco')?.clearValidators();
    this.form2.get('numeroCuenta')?.clearValidators();
    this.form2.get('comprobante')?.clearValidators();
    this.form2.get('amount')?.clearValidators();

    // Aplicar validadores según el método NORMALIZADO
    if (metodoNombre === 'Transferencia') {
      this.form2.get('banco')?.setValidators(Validators.required);
      this.form2.get('numeroCuenta')?.setValidators([
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]+$/)
      ]);
      this.form2.get('amount')?.setValidators(Validators.required);
      this.form2.get('comprobante')?.setValidators(Validators.required);
    }

    if (metodoNombre === 'Nequi' || metodoNombre === 'Daviplata') {
      this.form2.get('numeroCuenta')?.setValidators([
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/)
      ]);
      this.form2.get('comprobante')?.setValidators(Validators.required);
      this.form2.get('amount')?.setValidators(Validators.required);
    }

    if (metodoNombre === 'Efectivo') {
      this.form2.get('amount')?.setValidators(Validators.required);
    }

    // Refrescar validaciones
    ['banco', 'numeroCuenta', 'comprobante', 'amount'].forEach(c =>
      this.form2.get(c)?.updateValueAndValidity()
    );

    this.form2.markAsPristine();
  }


  getNumeroCuentaError(): string {
    const control = this.form2.get('numeroCuenta');

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

  onProductoFotoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        title: 'Formato inválido',
        text: 'Solo se permiten archivos de imagen (JPG, PNG, etc.)',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        customClass: {
          confirmButton: 'btn btn-primary'
        }
      });
      return;
    }

    this.productoFoto = file;
    this.form2.patchValue({ productoFoto: file });
    this.form2.get('productoFoto')?.markAsTouched();

    // Generar preview
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.productoFotoPreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  removeProductoFoto(): void {
    this.productoFoto = null;
    this.productoFotoPreview = null;
    this.form2.patchValue({ productoFoto: null });
    this.form2.get('productoFoto')?.markAsUntouched();
  }

  onFileSelectedActividad2(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.comprobanteTemp = file;
    this.form2.patchValue({ comprobante: file });
    this.form2.get('comprobante')?.markAsTouched();
  }


  createDisbursement(tipo: string): FormGroup {
    return this.fb.group({
      tipo: [tipo],
      numeroCuenta: [
        '',
        tipo !== 'Efectivo' ? Validators.required : []
      ],
      comprobante: [null, Validators.required]
    });
  }


  patchFormWithDate() {
    const fechaCredito = this.formatDateForInput(this.credit.fechaInicio);

    // El mínimo seleccionable es la fecha de la intención
    this.minDate = fechaCredito;
    this.fechaTentativaOriginal = fechaCredito;

    this.form1.patchValue({
      fecha_inicio_tentativa: fechaCredito
    });
  }


  onSubmitActividad1(): void {
    this.submitted = true;

    if (this.form1.invalid) return;

    const fechaActual = this.form1.getRawValue().fecha_inicio_tentativa;

    const [year, month, day] = fechaActual.split('-').map(Number);
    const selectedDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < new Date(this.minDate + 'T00:00:00')) {
      Swal.fire({
        title: 'Fecha inválida',
        text: 'La fecha no puede ser anterior a la fecha registrada en la intención',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    if (fechaActual === this.fechaTentativaOriginal) {
      this.stepper.next();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const dialogRef = this.dialog.open(LoadingComponent, {
      disableClose: true,
    });

    const payload: UpdateFechaTentativaCreditIntentionUpdateDto = {
      start_date: fechaActual
    };

    this.creditIntencionService
      .updateFechaTentativaData(this.credit.id, payload)
      .pipe(
        finalize(() => {
          this.isSaving = false;
          dialogRef.close();
        })
      )
      .subscribe({
        next: () => {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Fecha tentativa actualizada correctamente.',
            icon: 'success',
            buttonsStyling: false,
            confirmButtonText: 'Aceptar',
            customClass: {
              confirmButton: 'btn btn-success'
            }
          }).then(() => {
            this.stepper.next();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          });
        },
        error: (err) => {
          Swal.fire({
            title: 'Error',
            text: err?.error?.message || 'No se pudo actualizar la fecha tentativa',
            icon: 'error',
            confirmButtonText: 'Cerrar',
            customClass: {
              confirmButton: 'btn btn-danger'
            }
          });
        }
      });
  }

  onSubmitActividad2(): void {
    this.submitted = true;

    if (this.form2.invalid) {
      this.form2.markAllAsTouched();
      return;
    }

    // Si no hay desembolsos, avanzar directamente
    if (this.desembolsos.length === 0) {
      this.stepper.next();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Mostrar loading
    const dialogRef = this.dialog.open(LoadingComponent, {
      disableClose: true,
    });

    this.isSaving = true;

    // Guardar desembolsos
    this.saveDisbursementsToDatabase()
      .then(() => {
        dialogRef.close();
        this.isSaving = false;

        Swal.fire({
          title: '¡Éxito!',
          text: 'Desembolsos guardados correctamente.',
          icon: 'success',
          buttonsStyling: false,
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        }).then(() => {
          this.stepper.next();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      })
      .catch((error) => {
        dialogRef.close();
        this.isSaving = false;
        this.handleError(error, null);
      });
  }

  onSubmitActividad3(): void {
    if (this.isSaving) return;

    this.submitted = true;

    if (this.form3.invalid) {
      this.form3.markAllAsTouched();
      return;
    }

    const decision = this.form3.get('decision')?.value;
    this.decisionTomada = decision;

    this.isSaving = true;

    const dialogRef = this.dialog.open(LoadingComponent, {
      disableClose: true,
    });

    this.createOrUpdatePerson(dialogRef);
  }

  private createOrUpdatePerson(dialogRef: any): void {
    const credit = this._credit;


    const personPayload: PersonRegisterDto = {

      document_type: Number(credit.documentType),
      document: credit.document,
      first_name: credit.firstname,
      middlename: credit.middlename || '',
      last_name: credit.lastname,
      maternal_lastname: credit.maternalLastname || '',
      full_name: credit.fullname,
      gender: Number(credit.gender),
      occupation: credit.occupation || '',
      type_person: 'CLIENTE',
      zona: credit.zoneId,
      countryId: credit.countryId,
      departentId: credit.departmentId,
      cityId: credit.municipalityId,
      neighborhoodId: credit.neighborhoodId,
      adress: credit.homeAddress || '',
      correo: credit.email || '',
      celular: credit.whatsappNumber || '',
      telefono: credit.phoneNumber || ''
    };

    // Verificar si el cliente existe
    if (credit.clientExists) {
      // Actualizar cliente existente
      this.personService.updatePerson(personPayload).subscribe({
        next: (personResponse) => {
          // Continuar con la creación del crédito
          const idperson = personResponse.data.id;
          this.createCreditRecord(idperson, dialogRef);
        },
        error: (error) => {
          this.handleError(error, dialogRef);
        }
      });
    } else {
      // Crear nuevo cliente
      this.personService.registerPerson(personPayload).subscribe({
        next: (personResponse) => {
          // Continuar con la creación del crédito
          this.createCreditRecord(personResponse.data.id, dialogRef);
        },
        error: (error) => {
          this.handleError(error, dialogRef);
        }
      });
    }
  }

  private createCreditRecord(personId: number, dialogRef: any): void {
    const credit = this._credit;

    const creditPayload: CreditRegisterDto = {
      creditIntentionId: credit.id,
      personId: personId,
      creditLineId: credit.creditLineId,
      quotaValue: credit.quotaValue,
      periodId: credit.periodId,
      periodQuantity: credit.periodQuantity,
      taxTypeId: credit.taxTypeId,
      taxValue: credit.taxValue,
      totalIntentionValue: credit.totalIntentionValue,
      totalInterestValue: credit.totalInterestValue,
      totalCapitalValue: credit.totalCapitalValue,
      itemValue: credit.itemValue,
      initialValuePayment: credit.initialValuePayment,
      totalFinancedValue: credit.totalFinancedValue,
      stationery: credit.stationery
    };

    this.creditService.createCredit(creditPayload).pipe(
      finalize(() => {
        this.isSaving = false;
        debugger;
        dialogRef.close();
      })
    ).subscribe({
      next: (response) => {
        Swal.fire({
          title: '¡Éxito!',
          text: response.message || 'El crédito ha sido causado y registrado en cartera correctamente.',
          icon: 'success',
          buttonsStyling: false,
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        }).then(() => {
          this.isPhaseCompleted = true;
          this.allActivitiesCompleted.emit(this.isPhaseCompleted);
        });
      },
      error: (error) => {
        this.handleError(error, dialogRef);
        this.isSaving = false;
      }
    });
  }

  private saveDisbursementsToDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const desembolsosNuevos = this.desembolsos.filter(d => !d.esDeBD);

      if (desembolsosNuevos.length === 0 && this.desembolsos.every(d => d.esDeBD)) {
        resolve();
        return;
      }

      const files: File[] = [];
      const metadata: DisbursementMetadata[] = [];

      this.desembolsos.forEach((desembolso) => {
        const meta: DisbursementMetadata = {
          id: desembolso.id,
          paymentTypeId: desembolso.metodoId,
          bankId: desembolso.bancoId,
          accountNumber: desembolso.numeroCuenta !== 'N/A' ? desembolso.numeroCuenta : null,
          amount: desembolso.cantidadNumerica,
          hasFile: desembolso.comprobante != null
        };

        metadata.push(meta);

        if (desembolso.comprobante) {
          files.push(desembolso.comprobante);
        }
      });

      const creditLineType = this.getCreditLineType();

      this.disbursementService.savePayments(
        this.credit.id,
        creditLineType,
        files,
        metadata
      ).subscribe({
        next: (response) => {
          this.desembolsos = response.data.map(dto => this.convertDtoToDesembolso(dto));
          this.desembolsosCargadosDeBD = true;
          resolve();
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }

  private handleError(error: any, dialogRef: any): void {
    this.isSaving = false;
    dialogRef.close();

    let errorMessage = 'Ocurrió un error al procesar la solicitud.';

    if (error?.error?.message) {
      errorMessage = error.error.message;
    } else if (error?.message) {
      errorMessage = error.message;
    }

    Swal.fire({
      title: 'Error',
      text: errorMessage,
      icon: 'error',
      buttonsStyling: false,
      confirmButtonText: 'Aceptar',
      customClass: {
        confirmButton: 'btn btn-danger'
      }
    });
  }


  nextStep(step: number): void {
    let currentForm: FormGroup | null = null;
    let isValid = false;

    switch (step) {
      case 1:
        currentForm = this.form1;
        isValid = this.validateActividad1();
        break;

      case 2:
        currentForm = this.form2;
        isValid = this.validateActividad2();
        break;

      case 3:
        currentForm = this.form3;
        isValid = this.validateActividad3();
        break;
    }

    if (isValid && currentForm) {
      // Limpia el mensaje de error
      this.errorMessage = '';
      this.submitted = false;

      // MARCA EL PASO ACTUAL COMO COMPLETADO (esto activa el ícono verde)
      if (this.stepper.selected) {
        this.stepper.selected.completed = true;
        this.stepper.selected.editable = true;
      }

      // Avanza al siguiente paso
      this.stepper.next();

      setTimeout(() => {
        if (this.stepper.selected) {
          this.stepper.selected.completed = false;
        }
      }, 0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      this.submitted = true;
      if (currentForm) {
        currentForm.markAllAsTouched();
      }

      // Scroll al primer campo inválido
      setTimeout(() => {
        const firstInvalid = document.querySelector('.is-invalid');
        if (firstInvalid) {
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }

  previousStep(): void {
    if (this.stepper.selected) {
      this.stepper.selected.completed = false;
    }

    this.stepper.previous();

    setTimeout(() => {
      if (this.stepper.selected) {
        this.stepper.selected.completed = false;
      }
    }, 0);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private validateActividad1(): boolean {
    const raw = this.form1.getRawValue();

    if (!raw.fecha_inicio_tentativa) {
      this.errorMessage = 'Por favor complete todos los campos obligatorios del paso 1';
      return false;
    }

    // Validación fecha no anterior a hoy
    const [year, month, day] = raw.fecha_inicio_tentativa.split('-').map(Number);
    const selectedDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      this.errorMessage = 'La fecha de inicio no puede ser anterior a hoy';
      return false;
    }

    this.errorMessage = '';
    return true;
  }

  private validateActividad2(): boolean {
    const camposActividad3 = [
      'observacion_actividad3',
    ];

    let isValid = true;

    camposActividad3.forEach(field => {
      const control = this.form3.get(field);
      if (control) {
        control.markAsTouched();
        if (control.invalid) {
          isValid = false;
        }
      }
    });

    if (!isValid) {
      this.errorMessage = 'Por favor complete todos los campos obligatorios del paso 2';
    } else {
      this.errorMessage = '';
    }

    return isValid;
  }

  private validateActividad3(): boolean {
    const decision = this.form3.get('decision');

    if (decision) {
      decision.markAsTouched();
      if (decision.invalid) {
        this.errorMessage = 'Por favor seleccione una decisión (Aprobar o Rechazar)';
        return false;
      }
    }

    this.errorMessage = '';
    return true;
  }

  isCompleted(): boolean {
    return this.isPhaseCompleted;
  }

  resetPhase(): void {
    this.isPhaseCompleted = false;
    this.stepper.reset();
  }

  soloNumeros(event: KeyboardEvent): boolean {
    const char = event.key;
    if (!/^[0-9]$/.test(char) &&
      event.key !== 'Backspace' &&
      event.key !== 'Tab' &&
      event.key !== 'Delete' &&
      event.key !== 'ArrowLeft' &&
      event.key !== 'ArrowRight') {
      event.preventDefault();
      return false;
    }
    return true;
  }

  // Función para convertir fecha a formato "YYYY-MM-DD"
  formatDateForInput(dateStr: string): string {
    if (!dateStr) return '';
    return dateStr.split(' ')[0];
  }

  hasActividad2Changes(): boolean {
    // Si hay desembolsos nuevos (no de BD)
    const tieneNuevos = this.desembolsos.some(d => !d.esDeBD);

    // Si el número de desembolsos cambió
    const cambioEnCantidad = this.desembolsosCargadosDeBD &&
      this.desembolsos.length !== this.desembolsos.filter(d => d.esDeBD).length;

    return tieneNuevos || cambioEnCantidad || this.desembolsos.length > 0;
  }

  isActividad2Complete(): boolean {
    if (this.isLineaFinanciamiento()) {
      // Para línea de financiamiento: validar referencia, foto y monto de cuota inicial
      const referenciaValida = this.form2.get('productoReferencia')?.valid ?? false;
      const fotoValida = this.form2.get('productoFoto')?.valid ?? false;
      const montoCompleto = this.isMontoCompleto();

      return referenciaValida && fotoValida && montoCompleto;
    } else {
      // Para línea libre inversión: solo validar que el monto esté completo
      return this.isMontoCompleto();
    }
  }

  requiresDataActividad2(): boolean {
    return this.metodoSeleccionado !== 'Efectivo';
  }


  /**
 * Calcula el total de los desembolsos en la tabla
 */
  getTotalDesembolsos(): number {
    return this.desembolsos.reduce((sum, item) => sum + this.parseFormattedCurrency(item.cantidad), 0);
  }

  /**
   * Calcula el monto restante que falta por registrar
   */
  getMontoRestante(): number {
    const totalRequerido = this.isLineaFinanciamiento()
      ? this.credit.initialValuePayment
      : this.credit.totalCapitalValue;

    return totalRequerido - this.getTotalDesembolsos();
  }

  /**
   * Obtiene el monto total requerido según la línea
   */
  getMontoRequerido(): number {
    return this.isLineaFinanciamiento()
      ? this.credit.initialValuePayment
      : this.credit.totalCapitalValue;
  }

  /**
   * Verifica si se completó el monto total
   */
  isMontoCompleto(): boolean {
    return this.getMontoRestante() === 0;
  }

  /**
   * Formatea número a moneda colombiana
   */
  formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  }

  /**
   * Convierte string formateado a número
   */
  parseFormattedCurrency(formatted: string): number {
    if (!formatted) return 0;
    return Number(formatted.toString().replace(/\D/g, ''));
  }

  /**
   * Guarda un desembolso en la tabla dinamica
   */
  guardarEnTabla(): void {
    const metodoId = this.metodoSeleccionadoId;
    const metodoNombre = this.metodoSeleccionado;
    const cantidad = this.form2.get('amount')?.value;
    const numeroCuenta = this.form2.get('numeroCuenta')?.value;
    const bancoId = this.form2.get('banco')?.value;

    if (!metodoId || !metodoNombre) {
      Swal.fire({
        icon: 'error',
        title: 'Campo requerido',
        text: 'Debe seleccionar un método de desembolso',
        customClass: { confirmButton: 'btn btn-danger' }
      });
      return;
    }

    if (!cantidad) {
      Swal.fire({
        icon: 'error',
        title: 'Campo requerido',
        text: 'Debe ingresar una cantidad',
        customClass: { confirmButton: 'btn btn-danger' }
      });
      return;
    }

    const cantidadNumerica = this.parseFormattedCurrency(cantidad);

    if (cantidadNumerica > this.getMontoRestante()) {
      Swal.fire({
        icon: 'error',
        title: 'Cantidad excedida',
        text: `La cantidad ingresada excede el monto restante: ${this.formatearMoneda(this.getMontoRestante())}`,
        customClass: { confirmButton: 'btn btn-danger' }
      });
      return;
    }

    // Validar campos según método (menos Efectivo)
    if (metodoNombre !== 'Efectivo') {
      if (!numeroCuenta) {
        Swal.fire({
          icon: 'error',
          title: 'Campo requerido',
          text: 'Debe ingresar el número de cuenta',
          customClass: { confirmButton: 'btn btn-danger' }
        });
        return;
      }

      if (metodoNombre === 'Transferencia' && !bancoId) {
        Swal.fire({
          icon: 'error',
          title: 'Campo requerido',
          text: 'Debe seleccionar un banco',
          customClass: { confirmButton: 'btn btn-danger' }
        });
        return;
      }

      if (!this.comprobanteTemp) {
        Swal.fire({
          icon: 'error',
          title: 'Comprobante requerido',
          text: 'Debe adjuntar el comprobante de pago',
          customClass: { confirmButton: 'btn btn-danger' }
        });
        return;
      }
    }

    // Buscar el nombre del banco
    let bancoNombre = 'N/A';
    if (metodoNombre === 'Transferencia' && bancoId) {
      const bancoEncontrado = this.bancos.find(b => b.id === Number(bancoId));
      bancoNombre = bancoEncontrado ? bancoEncontrado.name : 'N/A';
    }

    // Crear el objeto desembolso
    const desembolso = {
      metodoId: metodoId,           // ID para enviar al backend
      metodo: metodoNombre,         // Nombre normalizado para UI
      cantidad: cantidad,
      cantidadNumerica: cantidadNumerica,
      numeroCuenta: numeroCuenta || 'N/A',
      bancoId: bancoId ? Number(bancoId) : null,
      banco: bancoNombre,
      comprobante: this.comprobanteTemp
    };

    this.desembolsos.push(desembolso);
    this.limpiarCamposDesembolso();

    // Swal.fire({
    //   icon: 'success',
    //   title: 'Agregado',
    //   text: 'Desembolso agregado a la tabla',
    //   timer: 1500,
    //   showConfirmButton: false
    // });
  }

  /**
   * Limpia los campos del formulario de desembolso
   */
  limpiarCamposDesembolso(): void {
    this.form2.patchValue({
      metodoDesembolso: '',
      banco: '',
      numeroCuenta: '',
      amount: '',
      comprobante: null
    });

    this.comprobanteTemp = null;

    // Limpiar TODOS los inputs de archivo
    const fileInputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
    fileInputs.forEach(input => {
      input.value = '';
    });

    // Resetear validadores
    this.onMetodoChange();
  }

  /**
   * Carga desembolsos existentes desde la BD
   */
  private loadExistingDisbursements(): void {
    const creditLineType = this.getCreditLineType();

    this.disbursementService.getPayments(this.credit.id, creditLineType).subscribe({

      next: (response) => {
        if (response.data && response.data.length > 0) {
          this.desembolsosCargadosDeBD = true;
          this.desembolsos = response.data.map(dto => this.convertDtoToDesembolso(dto));
        }
      },
      error: (error) => {
        debugger;
      }
    });
  }

  /**
   * Convierte DTO del backend a objeto Desembolso del frontend
   */
  private convertDtoToDesembolso(dto: DisbursementResponseDto): Desembolso {
    // Normalizar el nombre del método de pago
    const metodoNombre = this.normalizarNombreMetodo(dto.paymentTypeName || '');

    // Normalizar el nombre del banco si existe
    const bancoNombre = dto.bankName ? dto.bankName : 'N/A';

    return {
      id: dto.id,
      metodoId: dto.paymentTypeId,
      metodo: metodoNombre,
      cantidad: this.formatearMoneda(dto.amount),
      cantidadNumerica: dto.amount,
      numeroCuenta: dto.accountNumber || 'N/A',
      bancoId: dto.bankId || null,
      banco: bancoNombre,
      comprobante: null,
      esDeBD: true
    };
  }

  /**
   * Eliminar un registro de desembolso de la tabla dinamica
   */
  eliminarDesembolso(index: number): void {
    const desembolso = this.desembolsos[index];

    Swal.fire({
      title: '¿Eliminar pago?',
      text: desembolso.esDeBD
        ? 'Este pago será eliminado de la base de datos'
        : 'Este pago será removido de la lista',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-secondary'
      }
    }).then((result) => {

      if (!result.isConfirmed) {
        return;
      }

      if (!desembolso.esDeBD || !desembolso.id) {
        this.desembolsos.splice(index, 1);
        return;
      }

      const loadingRef = this.dialog.open(LoadingComponent, {
        disableClose: true
      });

      const creditLineType = this.getCreditLineType();

      this.disbursementService
        .deletePayment(desembolso.id, creditLineType)
        .pipe(
          finalize(() => {
            loadingRef.close();
          })
        )
        .subscribe({
          next: () => {
            this.desembolsos.splice(index, 1);
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'El pago ha sido eliminado de la base de datos',
              timer: 1500,
              showConfirmButton: false
            });
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar el pago',
              customClass: { confirmButton: 'btn btn-danger' }
            });
          }
        });
    });
  }


}