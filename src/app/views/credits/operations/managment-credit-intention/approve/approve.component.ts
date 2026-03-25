import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalculateCreditIntentionDto, CreditIntentionResponseDto, CreditIntentionService, CreditIntentionUpdateDto, CreditProjectionDto } from '@core/services/creditIntention.service';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CreditLineDto, CreditLineService } from '@core/services/creditLine.service';
import { PeriodDto, PeriodService } from '@core/services/perdiod.service';
import { debounceTime, finalize, forkJoin, merge, Subscription } from 'rxjs';
import { LoadingComponent } from '@views/ui/loading/loading.component';
import Swal from 'sweetalert2';
import { CreditIntentionStatusService } from '@core/services/creditIntentionStatus.service';

const CREDIT_STATUS = {
  APPROVED: 'APPROVED',
  IMPROVEMENT: 'IMPROVEMENT',
  RECHAZED: 'RECHAZED'
} as const;

const IMPROVEMENT_ACTIVITIES = {
  ACT_2_DECISION_FINAL: 'ACTIVIDAD 2: DECISION FINAL'
} as const;


@Component({
  selector: 'app-approve',
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
  templateUrl: './approve.component.html',
  styleUrl: './approve.component.scss'
})
export class ApproveComponent implements OnInit {
  private _credit!: CreditIntentionResponseDto;
  today: string = new Date().toLocaleDateString('en-CA');
  minDate: string = this.today;

  @Input()
  set credit(value: CreditIntentionResponseDto) {
    if (!value) return;

    this._credit = value;

    if (this.form1 && this.dataLoaded) {
      this.patchFormWithCredit();
    }
  }

  get credit(): CreditIntentionResponseDto {
    return this._credit;
  }

  //Output para notificar al padre
  @Output() allActivitiesCompleted = new EventEmitter<boolean>();
  //Variable para trackear el estado
  isPhaseCompleted = false;

  @ViewChild(MatStepper) stepper!: MatStepper;

  form1!: FormGroup;
  form2!: FormGroup;
  isLinear = true;
  submitted = false;
  errorMessage = '';
  isQuincenal = false;
  isFinalSubmit = false;
  errorValueToFinanciate: string = '';


  numeroCoutasInForm: string | null = null;
  errorInicioQuincena: string | null = null;
  errorFinQuincena: string | null = null;
  private updatingFromBackend = false;

  simulationCompleted: boolean = false;
  simulationResult: CreditProjectionDto | null = null;
  private formSubscription?: Subscription;
  private initialFormValues: any = null; // Para comparar cambios
  intentionSaved: boolean = false; // Para controlar el botón Siguiente



  selectedCreditLine: CreditLineDto | null = null;
  creditLines: CreditLineDto[] = [];
  periods: PeriodDto[] = [];
  private dataLoaded = false;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private periodService: PeriodService,
    private creditLineService: CreditLineService,
    private creditIntentionService: CreditIntentionService,
    private creditIntencionStatusService: CreditIntentionStatusService


  ) { }

  ngOnInit(): void {
    this.initializeForms();

    forkJoin({
      lines: this.creditLineService.getAll(),
      periods: this.periodService.getAllPeriods()
    }).subscribe({
      next: (result) => {
        this.creditLines = result.lines.data;
        this.periods = result.periods;
        this.dataLoaded = true;

        // Ahora que los datos están cargados, parchear si existe el crédito
        if (this.credit) {
          this.patchFormWithCredit();
        }
      },
      error: (err) => {
        console.error('Error al cargar datos iniciales', err);
      }
    });

    this.fetchLines();
    this.fetchPeriods();
    this.setupFormChangeDetection();
    this.interactionCamposParaCalculo();
    this.setupValueToFinanciateCalculation();

  }

  patchFormWithCredit() {

    const fechaInicio = this.formatDateForInput(this.credit.fechaInicio);
    this.minDate = fechaInicio || this.today;

    this.form1.patchValue({
      credit_line_id: this.credit.creditLineId,
      period_id: this.credit.periodId,
      period_quantity: this.credit.periodQuantity,
      quota_value: this.formatNumberToCurrency(this.credit.quotaValue),
      tax_value: this.credit.taxValue,
      inicio_quincena: this.credit.initialQuincena,
      fin_quincena: this.credit.endQuincena,
      item_value: this.formatNumberToCurrency(this.credit.itemValue),
      total_intention_value: this.formatNumberToCurrency(this.credit.totalIntentionValue),
      start_date: fechaInicio,
      desembolso_value: this.formatNumberToCurrency(this.credit.totalCapitalValue),
      value_to_financiate: this.formatNumberToCurrency(this.credit.totalCapitalValue),
      initial_quota: this.formatNumberToCurrency(this.credit.initialValuePayment),
    });
    this.onCreditLineChange();
    this.onPeriodChange();

    setTimeout(() => {
      this.initialFormValues = this.form1.getRawValue();
      // Como ya cargamos datos válidos, habilitar el botón guardar
      this.simulationCompleted = true;
      // Como ya hay datos válidos, marcar como guardado
      this.intentionSaved = true;
      this.updatingFromBackend = false;
    }, 100);
    console.log('Formulario parchado con éxito');
  }


  fetchLines(): void {
    this.creditLineService.getAll().subscribe({
      next: (response) => {
        this.creditLines = response.data;
      },
      error: (err) => {
        console.error('Error al obtener líneas de crédito', err);
      }
    });
  }

  fetchPeriods(): void {
    this.periodService.getAllPeriods().subscribe({
      next: (response) => {
        this.periods = response;
      },
      error: (err) => {
        console.error('Error al obtener periodos', err);
      }
    });
  }

  private initializeForms(): void {
    this.form1 = this.fb.group({
      credit_line_id: [null, Validators.required],
      period_id: [null, Validators.required],
      period_quantity: [null, Validators.required],
      start_date: [null, Validators.required],

      inicio_quincena: [null],
      fin_quincena: [null],

      desembolso_value: [null],
      quota_value: [null],
      tax_value: [null],
      value_to_financiate: [null],
      initial_quota: [null],
      item_value: [null],
      total_intention_value: [{ value: null, disabled: true }]
    });

    this.form2 = this.fb.group({
      observacion_actividad2: [null, Validators.required],
      decision: [null, Validators.required]
    });
  }

  onCreditLineChange(): void {
    const id = this.form1.get('credit_line_id')?.value;
    const selected = this.creditLines.find(c => c.id === Number(id));

    if (!selected) {
      this.selectedCreditLine = null;
      return;
    }

    this.selectedCreditLine = selected;
    const hasDisbursement = selected.loanDisbursement; // true = variable, false = a financiar

    // Actualizar validadores primero
    this.updateValidatorsByLoanDisbursement(hasDisbursement);

    const desembolsoCtrl = this.form1.get('desembolso_value');
    const itemCtrl = this.form1.get('item_value');
    const financiateCtrl = this.form1.get('value_to_financiate');
    const initialQuotaCtrl = this.form1.get('initial_quota');
    const quotaCtrl = this.form1.get('quota_value');
    const taxCtrl = this.form1.get('tax_value');

    if (hasDisbursement) {
      // ============ LÍNEA VARIABLE (loanDisbursement = true) ============
      // Solo habilitados: tasa, cuota, desembolso_value
      // Deshabilitados: item_value, value_to_financiate, initial_quota

      // Limpiar campos que se deshabilitan
      itemCtrl?.setValue(null, { emitEvent: false });
      financiateCtrl?.setValue(null, { emitEvent: false });
      initialQuotaCtrl?.setValue(null, { emitEvent: false });

      // Habilitar campos permitidos
      taxCtrl?.enable({ emitEvent: false });
      quotaCtrl?.enable({ emitEvent: false });
      desembolsoCtrl?.enable({ emitEvent: false });

      // Deshabilitar campos no permitidos
      itemCtrl?.disable({ emitEvent: false });
      financiateCtrl?.disable({ emitEvent: false });
      initialQuotaCtrl?.disable({ emitEvent: false });

    } else {
      // ============ LÍNEA A FINANCIAR (loanDisbursement = false) ============
      // Solo habilitados: tasa, cuota, item_value, value_to_financiate, initial_quota
      // Deshabilitado: desembolso_value

      // Limpiar campo que se deshabilita
      desembolsoCtrl?.setValue(null, { emitEvent: false });

      // Habilitar campos permitidos
      taxCtrl?.enable({ emitEvent: false });
      quotaCtrl?.enable({ emitEvent: false });
      itemCtrl?.enable({ emitEvent: false });
      financiateCtrl?.enable({ emitEvent: false });
      initialQuotaCtrl?.enable({ emitEvent: false });

      // Deshabilitar campo no permitido
      desembolsoCtrl?.disable({ emitEvent: false });
    }

    // Actualizar validaciones de todos los campos afectados
    desembolsoCtrl?.updateValueAndValidity({ emitEvent: false });
    itemCtrl?.updateValueAndValidity({ emitEvent: false });
    financiateCtrl?.updateValueAndValidity({ emitEvent: false });
    initialQuotaCtrl?.updateValueAndValidity({ emitEvent: false });
    quotaCtrl?.updateValueAndValidity({ emitEvent: false });
    taxCtrl?.updateValueAndValidity({ emitEvent: false });

    // Resetear simulación solo si no estamos cargando datos
    if (!this.updatingFromBackend) {
      this.simulationCompleted = false;
      this.simulationResult = null;
      this.errorMessage = '';
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

  onPeriodChange(): void {
    const periodId = this.form1.get('period_id')?.value;

    if (!periodId) {
      this.isQuincenal = false;
      this.form1.get('inicio_quincena')?.disable();
      this.form1.get('fin_quincena')?.disable();
      this.form1.get('inicio_quincena')?.setValue(null);
      this.form1.get('fin_quincena')?.setValue(null);
      return;
    }

    const selectedPeriod = this.periods.find(p => p.id === Number(periodId));
    if (selectedPeriod && selectedPeriod.cod === 'QU') {
      this.isQuincenal = true;

      // Habilitar campos
      this.form1.get('inicio_quincena')?.enable();
      this.form1.get('fin_quincena')?.enable();

      // Agregar validadores
      this.form1.get('inicio_quincena')?.setValidators([Validators.required, Validators.min(1), Validators.max(31)]);
      this.form1.get('fin_quincena')?.setValidators([Validators.required, Validators.min(1), Validators.max(31)]);
    } else {
      this.isQuincenal = false;

      // Limpiar valores
      this.form1.get('inicio_quincena')?.setValue(null);
      this.form1.get('fin_quincena')?.setValue(null);

      // Deshabilitar campos
      this.form1.get('inicio_quincena')?.disable();
      this.form1.get('fin_quincena')?.disable();

      // Limpiar validadores
      this.form1.get('inicio_quincena')?.setValidators(null);
      this.form1.get('fin_quincena')?.setValidators(null);
    }

    this.form1.get('inicio_quincena')?.updateValueAndValidity();
    this.form1.get('fin_quincena')?.updateValueAndValidity();
  }

  private setupFormChangeDetection(): void {
    const triggerFields = ['credit_line_id', 'period_id', 'period_quantity', 'start_date'];

    triggerFields.forEach(fieldName => {
      this.form1.get(fieldName)?.valueChanges.subscribe(() => {
        if (this.updatingFromBackend) return;
        if (!this.simulationCompleted) return;

        this.simulationCompleted = false;
        this.simulationResult = null;
        this.intentionSaved = false;
        this.errorMessage = 'Los datos han cambiado. Debe simular nuevamente antes de guardar.';
        this.clearCalculatedFields();

        setTimeout(() => {
          if (this.errorMessage === 'Los datos han cambiado. Debe simular nuevamente antes de guardar.') {
            this.errorMessage = '';
          }
        }, 5000);
      });
    });

    // initial_quota: solo invalida simulación, NO limpia campos
    this.form1.get('initial_quota')?.valueChanges.subscribe(() => {
      if (this.updatingFromBackend) return;
      if (!this.simulationCompleted) return;

      this.simulationCompleted = false;
      this.simulationResult = null;
      this.intentionSaved = false;
      this.errorMessage = 'Los datos han cambiado. Debe simular nuevamente antes de guardar.';

      // ✅ Limpiar cuota cuando el usuario modifica cuota inicial post-simulación
      this.form1.get('quota_value')?.setValue(null, { emitEvent: true });
      this.form1.get('quota_value')?.enable({ emitEvent: false });

      this.interactionCamposParaCalculo();
      setTimeout(() => {
        if (this.errorMessage === 'Los datos han cambiado. Debe simular nuevamente antes de guardar.') {
          this.errorMessage = '';
        }
      }, 5000);
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
    }

    console.log(`Validando paso ${step}:`, isValid);

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

  private validateActividad1(): boolean {
    const camposActividad1 = [
      'credit_line_id',
      'period_id',
      'period_quantity',
      'quota_value',
      'tax_value',
      'inicio_quincena',
      'fin_quincena',
      'total_intention_value',
      'start_date',
    ];

    let isValid = true;

    camposActividad1.forEach(field => {
      const control = this.form1.get(field);
      if (control) {
        control.markAsTouched();
        if (control.invalid) {
          isValid = false;
        }
      }
    });

    if (!isValid) {
      this.errorMessage = 'Por favor complete todos los campos obligatorios del paso 1';
    } else {
      this.errorMessage = '';
    }

    return isValid;
  }

  private validateActividad2(): boolean {
    const camposActividad5 = [
      'decision',
      'observacion_actividad2',
    ];

    let isValid = true;

    camposActividad5.forEach(field => {
      const control = this.form2.get(field);
      if (control) {
        control.markAsTouched();
        if (control.invalid) {
          isValid = false;
          console.log(`Campo ${field} inválido:`, control.errors);

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

  onSubmitActividad1(): void {
    this.submitted = true;

    if (this.form1.invalid) return;
    this.stepper.next();

  }


  onSubmitActividad2(): void {
    this.submitted = true;

    if (this.form2.invalid) return;

    const decision = this.form2.value.decision;
    console.log('Actividad 2 fase aprobacion enviada', this.form2.value);
    const dialogRef = this.dialog.open(LoadingComponent, {
      disableClose: true,
    });
    if (decision === 'rechazar') {
      dialogRef.close();

      this.creditIntencionStatusService.updateStatus({
        credit_id: this.credit.id,
        current_status: CREDIT_STATUS.APPROVED,
        new_status: CREDIT_STATUS.RECHAZED,
        activity: IMPROVEMENT_ACTIVITIES.ACT_2_DECISION_FINAL,
        observation: this.form2.value.observacion_actividad2
      }).subscribe({
        next: () => {
          Swal.fire({
            title: 'Solicitud rechazada',
            text: 'La solicitud fue rechazada en la fase de aprobacion.',
            icon: 'error',
            buttonsStyling: false,
            confirmButtonText: 'Entendido',
            customClass: {
              confirmButton: 'btn btn-danger'
            }
          }).then(() => {
            this.router.navigate(
              ['/operaciones/intencion'],
              { replaceUrl: true }
            );
          });
        },
        error: (err) => {
          Swal.fire({
            title: 'Error',
            text: err?.error?.message || 'No se pudo actualizar el estado del crédito',
            icon: 'error',
            confirmButtonText: 'Cerrar',
            customClass: {
              confirmButton: 'btn btn-danger'
            }
          });
        }
      });

      return;
    }

    this.creditIntencionStatusService.updateStatus({
      credit_id: this.credit.id,
      current_status: CREDIT_STATUS.APPROVED,
      new_status: CREDIT_STATUS.IMPROVEMENT,
      activity: IMPROVEMENT_ACTIVITIES.ACT_2_DECISION_FINAL,
      observation: this.form2.value.observacion_actividad2

    })
      .pipe(
        finalize(() => {
          dialogRef.close();
        })
      )
      .subscribe({
        next: () => {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Fase de aprobacion completada correctamente.',
            icon: 'success',
            buttonsStyling: false,
            confirmButtonText: 'Aceptar',
            customClass: {
              confirmButton: 'btn btn-success'
            }
          }).then(() => {
            this.isPhaseCompleted = true;
            this.allActivitiesCompleted.emit(this.isPhaseCompleted);
            // this.stepper.next();
          });
        },
        error: (err) => {
          Swal.fire({
            title: 'Error',
            text: err?.error?.message || 'No se pudo actualizar el estado',
            icon: 'error',
            confirmButtonText: 'Cerrar',
            customClass: {
              confirmButton: 'btn btn-danger'
            }
          });
        },
        complete: () => {
          dialogRef.close();
        }
      });
  }

  private interactionCamposParaCalculo(): void {
    const quotaControl = this.form1.get('quota_value');
    const taxControl = this.form1.get('tax_value');
    const itemControl = this.form1.get('item_value');
    const desembolsoControl = this.form1.get('desembolso_value');

    merge(
      quotaControl!.valueChanges,
      taxControl!.valueChanges,
      itemControl!.valueChanges,
      desembolsoControl!.valueChanges
    ).pipe(
      debounceTime(300)
    ).subscribe(() => {
      this.updateFieldStates();
    });
  }

  private updateFieldStates(): void {
    if (this.updatingFromBackend) {
      return;
    }

    const raw = this.form1.getRawValue();
    const cuota = this.toNumber(raw.quota_value);
    const tasa = this.toDecimal(raw.tax_value);
    const itemValue = this.toNumber(raw.item_value);
    const desembolsoValue = this.toNumber(raw.desembolso_value);

    const hasCuota = cuota > 0;
    const hasTasa = tasa > 0;
    const hasItemValue = itemValue > 0;
    const hasDesembolsoValue = desembolsoValue > 0;

    // Determinar si estamos en modo variable o a financiar
    const isDesembolsoEnabled = this.form1.get('desembolso_value')?.enabled ?? false;

    if (isDesembolsoEnabled) {
      // ======== LÍNEA VARIABLE: cuota, tasa, desembolsoValue ========
      // Solo estos 3 campos pueden interactuar entre sí

      if (hasCuota && hasTasa) {
        // Tiene cuota + tasa → deshabilitar desembolso (se calculará)
        this.form1.get('desembolso_value')?.disable({ emitEvent: false });
      } else if (hasCuota && hasDesembolsoValue) {
        // Tiene cuota + desembolso → deshabilitar tasa (se calculará)
        this.form1.get('tax_value')?.disable({ emitEvent: false });
      } else if (hasTasa && hasDesembolsoValue) {
        // Tiene tasa + desembolso → deshabilitar cuota (se calculará)
        this.form1.get('quota_value')?.disable({ emitEvent: false });
      } else {
        // Menos de 2 campos llenos → habilitar todos (dentro del grupo permitido)
        this.form1.get('quota_value')?.enable({ emitEvent: false });
        this.form1.get('tax_value')?.enable({ emitEvent: false });
        this.form1.get('desembolso_value')?.enable({ emitEvent: false });
      }

    } else {
      // ======== LÍNEA A FINANCIAR: cuota, tasa, itemValue ========
      // Solo estos 3 campos pueden interactuar entre sí para cálculos

      if (hasCuota && hasTasa) {
        // Tiene cuota + tasa → deshabilitar itemValue (se calculará)
        this.form1.get('item_value')?.disable({ emitEvent: false });
      } else if (hasCuota && hasItemValue) {
        // Tiene cuota + item → deshabilitar tasa (se calculará)
        this.form1.get('tax_value')?.disable({ emitEvent: false });
      } else if (hasTasa && hasItemValue) {
        // Tiene tasa + item → deshabilitar cuota (se calculará)
        this.form1.get('quota_value')?.disable({ emitEvent: false });
      } else {
        // Menos de 2 campos llenos → habilitar todos (dentro del grupo permitido)
        this.form1.get('quota_value')?.enable({ emitEvent: false });
        this.form1.get('tax_value')?.enable({ emitEvent: false });
        this.form1.get('item_value')?.enable({ emitEvent: false });
      }
    }
  }


  //Método para verificar si está completo el wizard hijo
  isCompleted(): boolean {
    return this.isPhaseCompleted;
  }

  // Método para resetear cuando cambia de fase
  resetPhase(): void {
    this.isPhaseCompleted = false;
    this.stepper.reset();
  }

  soloNumeros(event: KeyboardEvent) {
    const char = event.key;
    // Permitir solo números y teclas de control como Backspace, Tab, Delete, flechas
    if (!/^[0-9]$/.test(char) &&
      event.key !== 'Backspace' &&
      event.key !== 'Tab' &&
      event.key !== 'Delete' &&
      event.key !== 'ArrowLeft' &&
      event.key !== 'ArrowRight') {
      event.preventDefault();
    }
  }

  validarRangoNumerico(
    controlName: string,
    min: number,
    max: number,
    errorProperty: string,
    nombreCampo: string = 'valor'
  ) {
    const control = this.form1.get(controlName);

    if (!control) {
      return;
    }

    const value = control.value;

    // Si el campo está vacío
    if (value === null || value === undefined || value === '') {
      (this as any)[errorProperty] = null;
      return;
    }

    const numValue = Number(value);

    // Validar que sea un número válido
    if (isNaN(numValue)) {
      control.setValue(null);
      (this as any)[errorProperty] = 'Debe ingresar un número válido';
      return;
    }

    // No puede ser 0 o negativo
    if (numValue <= 0) {
      control.setValue(null);
      (this as any)[errorProperty] = `El ${nombreCampo} debe ser mayor a 0`;
      return;
    }

    // Validación especial para cuotas (no permite 1)
    if (controlName === 'period_quantity' && numValue === 1) {
      control.setValue(null);
      (this as any)[errorProperty] = `El número mínimo de ${nombreCampo} es ${min}`;
      return;
    }

    // No puede ser menor al mínimo
    if (numValue < min) {
      control.setValue(null);
      (this as any)[errorProperty] = `El ${nombreCampo} mínimo es ${min}`;
      return;
    }

    // No puede ser mayor al máximo
    if (numValue > max) {
      control.setValue(null);
      (this as any)[errorProperty] = `El ${nombreCampo} máximo es ${max}`;
      return;
    }

    // Si todo está bien
    (this as any)[errorProperty] = null;
  }
  // Métodos wrapper para cada campo (opcional pero recomendado para legibilidad)
  limitarCuotas(event: Event) {
    this.validarRangoNumerico('period_quantity', 1, 700, 'numeroCoutasInForm', 'número de cuotas');
  }

  limitarDiaInicioQuincena(event: Event) {
    this.validarRangoNumerico('inicio_quincena', 1, 31, 'errorInicioQuincena', 'día');
  }

  limitarDiaFinQuincena(event: Event) {
    this.validarRangoNumerico('fin_quincena', 1, 31, 'errorFinQuincena', 'día');
  }

  formatCurrency(controlName: string) {
    const control = this.form1.get(controlName);
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

  formatNumberToCurrency(value: number): string {
    if (!value) return '';
    return value.toLocaleString('es-CO');
  }

  // Función de utilidad para convertir fecha a formato "YYYY-MM-DD"
  formatDateForInput(dateStr: string): string {
    if (!dateStr) return '';
    return dateStr.split(' ')[0];
  }

  private toNumber(value: any): number {
    if (value === null || value === undefined || value === '') return 0;
    return Number(value.toString().replace(/\D/g, ''));
  }

  private ensureNumber(value: any): number | null {
    const n = Number(value);
    return isNaN(n) ? null : n;
  }

  private toDecimal(value: any): number {
    if (value === null || value === undefined || value === '') return 0;

    const normalized = value.toString().replace(',', '.');
    const num = Number(normalized);

    return isNaN(num) ? 0 : num;
  }

  private updateValidatorsByLoanDisbursement(loanDisbursement: boolean): void {
    const desembolso = this.form1.get('desembolso_value');
    const item = this.form1.get('item_value');
    const financiate = this.form1.get('value_to_financiate');
    const initialQuota = this.form1.get('initial_quota');
    const tasa = this.form1.get('tax_value');
    const cuota = this.form1.get('quota_value');
    const fecha = this.form1.get('start_date');

    if (loanDisbursement) {
      // ============ LÍNEA VARIABLE ============
      // Obligatorios: desembolso, tasa, cuota, fecha
      desembolso?.setValidators([Validators.required]);
      tasa?.setValidators([Validators.required]);
      cuota?.setValidators([Validators.required]);
      fecha?.setValidators([Validators.required]);

      // NO obligatorios (deshabilitados)
      item?.clearValidators();
      financiate?.clearValidators();
      initialQuota?.clearValidators();

    } else {
      // ============ LÍNEA A FINANCIAR ============
      // Obligatorios: item, financiate, initialQuota, fecha, tasa, cuota
      item?.setValidators([Validators.required]);
      financiate?.setValidators([Validators.required]);
      initialQuota?.setValidators([Validators.required]);
      fecha?.setValidators([Validators.required]);
      tasa?.setValidators([Validators.required]);
      cuota?.setValidators([Validators.required]);

      // NO obligatorio (deshabilitado)
      desembolso?.clearValidators();
    }

    // Actualizar todas las validaciones
    desembolso?.updateValueAndValidity({ emitEvent: false });
    item?.updateValueAndValidity({ emitEvent: false });
    financiate?.updateValueAndValidity({ emitEvent: false });
    initialQuota?.updateValueAndValidity({ emitEvent: false });
    tasa?.updateValueAndValidity({ emitEvent: false });
    cuota?.updateValueAndValidity({ emitEvent: false });
    fecha?.updateValueAndValidity({ emitEvent: false });
  }

  simulate(): void {
    this.submitted = true;
    this.simulationCompleted = false;
    this.simulationResult = null;

    if (
      this.isFinalSubmit
    ) {
      setTimeout(() => {
        document.querySelector('fieldset legend')
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return;
    }

    // ==================== VALIDACIÓN DE CUOTA INICIAL ====================
    const raww = this.form1.getRawValue();
    const itemVa0lue = this.toNumber(raww.item_value);
    const initialQuota = this.toNumber(raww.initial_quota);

    // Validar que la cuota inicial sea menor al valor del producto
    if (initialQuota > 0 && initialQuota >= itemVa0lue) {
      this.errorMessage = 'La cuota inicial debe ser menor al valor del producto';
      this.stepper.selectedIndex = 2;

      setTimeout(() => {
        document.querySelector('input[formControlName="initial_quota"]')
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);

      return;
    }

    const raw = this.form1.getRawValue();
    const periodId = this.ensureNumber(raw.period_id);
    const selectedPeriod = this.periods.find(p => p.id === periodId);

    if (!selectedPeriod) {
      this.errorMessage = 'Periodicidad inválida';
      return;
    }

    // Determinar grupo y tipo de cálculo
    const grupo: 'GRUPO1' | 'GRUPO2' =
      this.selectedCreditLine?.loanDisbursement ? 'GRUPO2' : 'GRUPO1';


    const cuota = this.toNumber(raw.quota_value);
    const tasa = this.toDecimal(raw.tax_value);
    const itemValue = this.toNumber(raw.item_value);
    const totalFinanciar = this.toNumber(raw.value_to_financiate);
    const desembolsoValue = this.toNumber(raw.desembolso_value);

    const hasCuota = cuota > 0;
    const hasTasa = tasa > 0;
    const hasItemValue = itemValue > 0;
    const hasDesembolsoValue = desembolsoValue > 0;
    const hastotalFinanciar = totalFinanciar > 0;


    // Determinar tipo de cálculo según el grupo
    let tipo_calculo: 'CALCULAR_TASA' | 'CALCULAR_CUOTA' | 'CALCULAR_CAPITAL';

    if (grupo === 'GRUPO2') {
      if (hasCuota && hasTasa && !hasDesembolsoValue) {
        tipo_calculo = 'CALCULAR_CAPITAL';
      } else if (hasCuota && hasDesembolsoValue && !hasTasa) {
        tipo_calculo = 'CALCULAR_TASA';
      } else {
        tipo_calculo = 'CALCULAR_CUOTA';
      }
    } else {
      if (hasCuota && hasTasa && !hasItemValue) {
        tipo_calculo = 'CALCULAR_CAPITAL';
      } else if (hasCuota && hasItemValue && !hasTasa) {
        tipo_calculo = 'CALCULAR_TASA';
      } else {
        tipo_calculo = 'CALCULAR_CUOTA';
      }
    }

    // Normalización segura 
    const creditLineId = this.ensureNumber(raw.credit_line_id);
    const periodoId = this.ensureNumber(raw.period_id);
    const periodQty = this.ensureNumber(raw.period_quantity);

    if (creditLineId === null || periodoId === null || periodQty === null) {
      this.errorMessage = 'Datos del crédito incompletos o inválidos';
      this.stepper.selectedIndex = 2;
      return;
    }

    // PAYLOAD – Calcular crédito
    const payloadCalculo: CalculateCreditIntentionDto = {
      credit_line_id: creditLineId,
      period_id: periodoId!,
      period_code: selectedPeriod.cod,
      period_quantity: periodQty,
      start_date: raw.start_date,
      item_value: this.selectedCreditLine?.loanDisbursement
        ? desembolsoValue
        : totalFinanciar,
      quota_value: cuota,
      tax_value: tasa,
      inicio_quincena: this.form1.get('inicio_quincena')?.value,
      fin_quincena: this.form1.get('fin_quincena')?.value,
      tipo_calculo,
      generar_amortizacion: 'NO'
    };

    this.errorMessage = '';

    console.log('Tipo de cálculo:', tipo_calculo);
    console.log('Grupo activo:', grupo);
    console.log('Payload Cálculo:', payloadCalculo);

    const dialogRef = this.dialog.open(LoadingComponent, {
      disableClose: true,
    });

    this.creditIntentionService.calculateCreditIntention(payloadCalculo).subscribe({
      next: (response) => {
        this.updatingFromBackend = true;

        const data = response.data?.[0];
        if (!data) {
          this.updatingFromBackend = false;
          dialogRef.close();
          return;
        }

        const numeroCuotas = this.ensureNumber(this.form1.get('period_quantity')?.value) ?? 0;
        const dcreCapital = data.dcreCapital ?? 0;


        // ==================== CALCULAR_CUOTA ====================
        if (tipo_calculo === 'CALCULAR_CUOTA') {
          const cuotaCalculada = data.dcreVlrcuota ?? 0;
          const valorSolicitud = cuotaCalculada * numeroCuotas;

          if (grupo === 'GRUPO2') {
            this.form1.patchValue({
              quota_value: cuotaCalculada,
              total_intention_value: valorSolicitud,
              item_value: null
            }, { emitEvent: false });

            this.formatCurrency('quota_value');
            this.formatCurrency('total_intention_value');

            // Asegurar estados correctos
            setTimeout(() => {
              this.form1.get('quota_value')?.enable({ emitEvent: false });
              this.form1.get('tax_value')?.enable({ emitEvent: false });
              this.form1.get('desembolso_value')?.enable({ emitEvent: false });
              this.form1.get('item_value')?.disable({ emitEvent: false });
            }, 50);

          } else {
            this.form1.patchValue({
              quota_value: cuotaCalculada,
              total_intention_value: valorSolicitud,
              desembolso_value: null
            }, { emitEvent: false });

            this.formatCurrency('quota_value');
            this.formatCurrency('total_intention_value');

            // Asegurar estados correctos
            setTimeout(() => {
              this.form1.get('quota_value')?.enable({ emitEvent: false });
              this.form1.get('tax_value')?.enable({ emitEvent: false });
              this.form1.get('item_value')?.enable({ emitEvent: false });
              this.form1.get('desembolso_value')?.disable({ emitEvent: false });
            }, 50);
          }
        }

        // ==================== CALCULAR_TASA ====================
        else if (tipo_calculo === 'CALCULAR_TASA') {
          const tasaCalculada = data.dcreTasa ?? 0;
          const cuotaActual = this.toNumber(this.form1.get('quota_value')?.value);
          const valorSolicitud = cuotaActual * numeroCuotas;

          if (grupo === 'GRUPO2') {
            this.form1.patchValue({
              tax_value: Number(tasaCalculada.toFixed(9)),
              total_intention_value: valorSolicitud,
              item_value: null
            }, { emitEvent: false });

            this.formatCurrency('total_intention_value');

            // Asegurar estados correctos
            setTimeout(() => {
              this.form1.get('quota_value')?.enable({ emitEvent: false });
              this.form1.get('tax_value')?.enable({ emitEvent: false });
              this.form1.get('desembolso_value')?.enable({ emitEvent: false });
              this.form1.get('item_value')?.disable({ emitEvent: false });
            }, 50);

          } else {
            this.form1.patchValue({
              tax_value: Number(tasaCalculada.toFixed(9)),
              total_intention_value: valorSolicitud,
              desembolso_value: null
            }, { emitEvent: false });

            this.formatCurrency('total_intention_value');

            // Asegurar estados correctos
            setTimeout(() => {
              this.form1.get('quota_value')?.enable({ emitEvent: false });
              this.form1.get('tax_value')?.enable({ emitEvent: false });
              this.form1.get('item_value')?.enable({ emitEvent: false });
              this.form1.get('desembolso_value')?.disable({ emitEvent: false });
            }, 50);
          }
        }

        // ==================== CALCULAR_CAPITAL ====================
        else if (tipo_calculo === 'CALCULAR_CAPITAL') {
          const cuotaActual = this.toNumber(this.form1.get('quota_value')?.value);
          const valorSolicitud = cuotaActual * numeroCuotas;
          const valorBase = data.dcreVlrBase ?? data.dcreCapital ?? 0;
          const initialQuota = this.toNumber(this.form1.get('initial_quota')?.value);

          if (grupo === 'GRUPO2') {
            this.form1.patchValue({
              desembolso_value: valorBase,
              quota_value: data.dcreVlrcuota,
              total_intention_value: valorSolicitud,
              item_value: null
            }, { emitEvent: false });

            this.formatCurrency('desembolso_value');
            this.formatCurrency('quota_value');
            this.formatCurrency('total_intention_value');

            setTimeout(() => {
              this.form1.get('quota_value')?.enable({ emitEvent: false });
              this.form1.get('tax_value')?.enable({ emitEvent: false });
              this.form1.get('desembolso_value')?.enable({ emitEvent: false });
              this.form1.get('item_value')?.disable({ emitEvent: false });
            }, 50);

          } else {
            const itemValueFinal = initialQuota > 0 ? valorBase + initialQuota : valorBase;

            this.form1.patchValue({
              item_value: itemValueFinal,
              value_to_financiate: valorBase,
              quota_value: data.dcreVlrcuota,
              total_intention_value: valorSolicitud,
              desembolso_value: null
            }, { emitEvent: false });


            this.formatCurrency('item_value');
            this.formatCurrency('value_to_financiate');
            this.formatCurrency('quota_value');
            this.formatCurrency('total_intention_value');


            setTimeout(() => {
              this.form1.get('quota_value')?.enable({ emitEvent: false });
              this.form1.get('tax_value')?.enable({ emitEvent: false });
              this.form1.get('item_value')?.enable({ emitEvent: false });
              this.form1.get('desembolso_value')?.disable({ emitEvent: false });
            }, 50);
          }
        }

        setTimeout(() => {
          this.updatingFromBackend = false;
          this.simulationCompleted = true;
          this.simulationResult = data;

        }, 150);
      },
      error: (err) => {
        console.error('Error al calcular el crédito:', err);
        this.errorMessage = err.error?.details || err.error?.message || 'Error desconocido al calcular el crédito.';
        this.simulationCompleted = false;
        this.simulationResult = null;
        this.updatingFromBackend = false;
        dialogRef.close();
      },
      complete: () => {
        dialogRef.close();
      }
    });
  }

  setupValueToFinanciateCalculation(): void {
    this.form1.get('item_value')?.valueChanges.subscribe(() => {
      this.calculateValueToFinanciate();
    });

    this.form1.get('initial_quota')?.valueChanges.subscribe(() => {
      this.calculateValueToFinanciate();
    });
  }

  calculateValueToFinanciate(): void {
    const itemValue = this.toNumber(this.form1.get('item_value')?.value);
    const initialQuota = this.toNumber(this.form1.get('initial_quota')?.value);

    this.errorValueToFinanciate = '';

    if (itemValue === 0) {
      this.form1.patchValue({
        value_to_financiate: null
      }, { emitEvent: false });
      return;
    }

    if (itemValue > 0 && initialQuota === 0) {
      this.form1.patchValue({
        value_to_financiate: itemValue
      }, { emitEvent: false });
      this.formatCurrency('value_to_financiate');
      return;
    }

    if (initialQuota > 0) {
      if (initialQuota >= itemValue) {
        this.errorValueToFinanciate = 'La cuota inicial debe ser menor al valor del producto';
        this.form1.patchValue({
          value_to_financiate: null
        }, { emitEvent: false });
        return;
      }

      const valueToFinanciate = itemValue - initialQuota;
      this.form1.patchValue({
        value_to_financiate: valueToFinanciate
      }, { emitEvent: false });
      this.formatCurrency('value_to_financiate');
    }
  }

  onSave(): void {
    const raw = this.form1.getRawValue();
    const capitalValue = this.selectedCreditLine?.loanDisbursement
      ? this.toNumber(raw.desembolso_value)
      : this.toNumber(raw.item_value);
    const numeroCuotas = raw.period_quantity;
    const cuotaValue = raw.quota_value;
    const tasa = raw.tax_value;

    Swal.fire({
      title: '¿Finalizar registro de intención?',
      html: `
        <table style="margin:auto; text-align:left;">
          <tr>
            <td><b>Valor:</b></td>
            <td style="padding-left:20px;"><strong>$${this.formatValueCurrency(capitalValue.toString())}</strong></td>
          </tr>
          <tr>
            <td><b>N. Cuotas:</b></td>
            <td style="padding-left:20px;"><strong>${numeroCuotas}</strong></td>
          </tr>
          <tr>
            <td><b>Tasa:</b></td>
            <td style="padding-left:20px;"><strong>${tasa}%</strong></td>
          </tr>
          <tr>
            <td><b>Cuota:</b></td>
            <td style="padding-left:20px;"><strong>$${cuotaValue}</strong></td>
          </tr>
        </table>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Finalizar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-secondary'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.saveIntention();
      }
    });
  }

  saveIntention(): void {
    if (!this.simulationCompleted) {
      this.errorMessage = 'Debe realizar la simulación antes de guardar';
      return;
    }

    const raw = this.form1.getRawValue();
    const tasa = this.toDecimal(raw.tax_value);

    const capitalValue = this.selectedCreditLine?.loanDisbursement
      ? this.toNumber(raw.desembolso_value)
      : this.toNumber(raw.item_value);


    const payloadIntencion: CreditIntentionUpdateDto = {
      credit_line_id: this.ensureNumber(raw.credit_line_id)!,
      quota_value: this.toNumber(raw.quota_value),

      period_id: this.ensureNumber(raw.period_id)!,
      period_quantity: this.ensureNumber(raw.period_quantity)!,

      tax_type_id: this.ensureNumber(this.selectedCreditLine?.taxType)!,
      tax_value: tasa,

      item_value: capitalValue,
      initial_value_payment: this.toNumber(raw.initial_quota),
      total_financed_value: this.toNumber(raw.value_to_financiate),
      total_intention_value: this.toNumber(raw.total_intention_value),

      inicio_quincena: this.toNumber(raw.inicio_quincena),
      fin_quincena: this.toNumber(raw.fin_quincena),

      tipo_calculo:
        this.selectedCreditLine?.taxType === 3
          ? 'CALCULAR_TASA'
          : 'CALCULAR_CUOTA',

      start_date: raw.start_date
    };


    const dialogRef = this.dialog.open(LoadingComponent, {
      disableClose: true,
    });

    this.creditIntentionService
      .updateCreditData(this.credit.id, payloadIntencion)
      .pipe(
        finalize(() => {
          dialogRef.close();
        })
      )
      .subscribe({
        next: (response) => {
          console.log('Intención actualizada exitosamente:', response);
          this.intentionSaved = true;
          dialogRef.close();

          Swal.fire({
            title: '¡Éxito!',
            text: 'La intención de crédito se ha actualizado correctamente.',
            icon: 'success',
            buttonsStyling: false,
            confirmButtonText: 'Aceptar',
            customClass: {
              confirmButton: 'btn btn-success'
            }
          }).then(() => {
            this.simulationCompleted = false;
            this.simulationResult = null;
            this.errorMessage = '';
            this.submitted = false;

            window.scrollTo({ top: 0, behavior: 'smooth' });

          });
        },
        error: (err) => {
          dialogRef.close();
          Swal.fire({
            title: 'Error',
            text: err.error?.detail || err.error?.message || 'No se pudo guardar la intención de crédito. Por favor, intente nuevamente.',
            icon: 'error',
            buttonsStyling: false,
            confirmButtonText: 'Entendido',
            customClass: {
              confirmButton: 'btn btn-danger'
            }
          });
        }
      });
  }

  private clearCalculatedFields(): void {
    this.updatingFromBackend = true;

    this.form1.patchValue({
      quota_value: null,
      tax_value: null,
      item_value: null,
      desembolso_value: null,
      value_to_financiate: null,
      initial_quota: null,
      total_intention_value: null,
    }, { emitEvent: false });

    const hasDisbursement = this.selectedCreditLine?.loanDisbursement ?? false;

    this.form1.get('quota_value')?.enable({ emitEvent: false });
    this.form1.get('tax_value')?.enable({ emitEvent: false });

    if (hasDisbursement) {
      this.form1.get('desembolso_value')?.enable({ emitEvent: false });
      this.form1.get('item_value')?.disable({ emitEvent: false });
      this.form1.get('value_to_financiate')?.disable({ emitEvent: false });
      this.form1.get('initial_quota')?.disable({ emitEvent: false });
    } else {
      this.form1.get('item_value')?.enable({ emitEvent: false });
      this.form1.get('value_to_financiate')?.enable({ emitEvent: false });
      this.form1.get('initial_quota')?.enable({ emitEvent: false });
      this.form1.get('desembolso_value')?.disable({ emitEvent: false });
    }

    this.numeroCoutasInForm = null;
    this.errorInicioQuincena = null;
    this.errorFinQuincena = null;
    this.errorValueToFinanciate = '';

    setTimeout(() => {
      this.updatingFromBackend = false;
    }, 100);
  }

  formatValueCurrency(rawValue: string) {
    if (rawValue === null || rawValue === '') return;
    const numericValue = rawValue.toString().replace(/\D/g, '');
    if (numericValue === '') {
      return '';;
    }
    return Number(numericValue).toLocaleString('es-CO');
  }

  get getPapeleria() {
    const creditLine = this.selectedCreditLine;
    let value;
    if (creditLine?.loanDisbursement) {
      value = this.form1.get('desembolso_value')?.value;
    } else {
      value = this.form1.get('value_to_financiate')?.value;
    }
    if (value) {
      const formattedValue = Number(value.replaceAll('.', '')) * 0.01;
      return this.formatValueCurrency(formattedValue.toString())
    }
    return '0';
  }

  get isFinanceCreditLine() {
    const creditLine = this.selectedCreditLine;
    return !creditLine?.loanDisbursement;
  }

}
