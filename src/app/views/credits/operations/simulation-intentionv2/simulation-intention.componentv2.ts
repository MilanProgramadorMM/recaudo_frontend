import { CdkStepper, CdkStepperModule } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageTitleComponent } from '@components/page-title.component';
import { CalculateCreditIntentionDto, CreditIntentionService, CreditProjectionDto } from '@core/services/creditIntention.service';
import { CreditLineDto, CreditLineService } from '@core/services/creditLine.service';
import { Glotypes} from '@core/services/glotypes.service';
import { PeriodDto, PeriodService } from '@core/services/perdiod.service';
import { OptionDTO} from '@core/services/ubicacion.service';
import { ZonaResponseDto} from '@core/services/zona.service';
import { LoadingComponent } from '@views/ui/loading/loading.component';
import { NgStepperComponent, NgStepperModule } from 'angular-ng-stepper';
import { debounceTime, merge, Subscription} from 'rxjs';
import { AuthenticationService } from '@core/services/auth.service';
import { NgSelectModule } from '@ng-select/ng-select';


@Component({
  selector: 'app-simulation-intention',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PageTitleComponent,
    NgStepperModule,
    CdkStepperModule,
    NgSelectModule
  ],
  templateUrl: './simulation-intention.componentv2.html',
  styleUrl: './simulation-intention.componentv2.scss'
})
export class SimulationIntentionComponentv2 implements OnInit {

  form!: FormGroup;
  submitted = false;
  errorMessage = '';
  isQuincenal = false;
  isFinalSubmit = false;
  numeroCoutasInForm: string | null = null;
  errorInicioQuincena: string | null = null;
  errorFinQuincena: string | null = null;
  errorValueToFinanciate: string = '';

  private updatingFromBackend = false;

  simulationCompleted: boolean = false;
  simulationResult: CreditProjectionDto | null = null;
  private formSubscription?: Subscription;
  currentUserRole: string | null = null;
  currentUserId: number | null = null;



  documentTypes: Glotypes[] = [];
  genderGlotypes: Glotypes[] = [];
  paises: OptionDTO[] = [];
  departamentos: OptionDTO[] = [];
  municipios: OptionDTO[] = [];
  barrios: OptionDTO[] = [];
  zonas: ZonaResponseDto[] = [];


  selectedCreditLine: CreditLineDto | null = null;


  creditLines: CreditLineDto[] = [];
  periods: PeriodDto[] = [];
  taxTypes: any[] = [];
  today: string = '';



  constructor(
    private fb: FormBuilder,
    private creditLineService: CreditLineService,
    private periodService: PeriodService,
    private dialog: MatDialog,
    private creditIntentionService: CreditIntentionService,
    private authService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    const now = new Date();
    this.today = now.toISOString().split('T')[0];
    this.form = this.fb.group({
      zone_id: [null, Validators.required],
      document_type: ['', Validators.required],
      document: ['', Validators.required],
      firstname: ['', Validators.required],
      middlename: [''],
      lastname: ['', Validators.required],
      maternal_lastname: [''],
      fullname: [{ value: '', disabled: true }],

      gender: ['', Validators.required],
      occupation: ['', Validators.required],
      description: [''],

      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', Validators.required],
      whatsapp_number: ['', Validators.required],

      quota_value: [''],
      value_to_financiate: [''],
      credit_line_id: [null, Validators.required],
      period_id: [null, Validators.required],
      period_code: [{ value: '', disabled: true }],
      period_quantity: ['', Validators.required],
      tax_type_id: ['', Validators.required],
      tax_value: [''],
      total_intention_value: [{ value: '', disabled: true }],
      item_value: [null, Validators.required],
      desembolso_value: [''],


      cargos: ['', Validators.required],
      initial_quota: [''],
      start_date: ['', Validators.required],
      inicio_quincena: [{ value: null, disabled: true }],
      fin_quincena: [{ value: null, disabled: true }],

      home_address: ['', Validators.required],
      country_id: ['', Validators.required],
      department_id: ['', Validators.required],
      municipality_id: ['', Validators.required],
      neighborhood_id: ['', Validators.required],
      tipo_calculo: [''],
      generar_amortizacion: [''],
    });

    //this.loadDocumentTypes();
    //this.loadGender();
    this.fetchLines();
    this.fetchPeriods();
    this.getUserDataFromToken();



    // this.ubicacionService.getPaises().subscribe(data => this.paises = data);
    // // Escuchar cambios
    // this.form.get('country_id')?.valueChanges.subscribe(paisId => {
    //   if (paisId) {
    //     this.ubicacionService.getDepartamentos(paisId).subscribe(data => {
    //       this.departamentos = data;
    //       this.municipios = [];
    //       this.barrios = [];
    //       this.form.patchValue({ departamento: '', ciudad: '', barrio: '' });
    //     });
    //   }
    // });

    // this.form.get('department_id')?.valueChanges.subscribe(depId => {
    //   if (depId) {
    //     this.ubicacionService.getMunicipios(depId).subscribe(data => {
    //       this.municipios = data;
    //       this.barrios = [];
    //       this.form.patchValue({ ciudad: '', barrio: '' });
    //     });
    //   }
    // });

    // this.form.get('municipality_id')?.valueChanges.subscribe(munId => {
    //   if (munId) {
    //     this.ubicacionService.getBarrios(munId).subscribe(data => {
    //       this.barrios = data;
    //       this.form.patchValue({ barrio: '' });
    //     });
    //   }
    // });

    // this.form.get('document')?.valueChanges.subscribe(() => {
    //   if (this.updatingFromBackend) return;

    //   this.resetPersonForm();
    // });

    // Escuchar cambios en Valor del Producto para controlar la Cuota Inicial
    this.form.get('item_value')?.valueChanges.subscribe(value => {
      const initialQuotaCtrl = this.form.get('initial_quota');

      // Convertimos a número para validar si es mayor a 0 o tiene contenido
      const numericValue = this.toNumber(value);

      if (numericValue > 0) {
        // Si hay valor, habilitamos la cuota inicial
        initialQuotaCtrl?.enable({ emitEvent: false });
      } else {
        // Si no hay valor, limpiamos y deshabilitamos
        initialQuotaCtrl?.setValue(null, { emitEvent: false });
        initialQuotaCtrl?.disable({ emitEvent: false });
      }
    });

    //ESCUCHAR CAMBIOS EN CAMPOS TASA O CUOTA PARA AJUSTAR DEMAS CAMPOS
    this.setupFormChangeDetection();
    this.interactionCamposParaCalculo();
    this.setupValueToFinanciateCalculation();
  }

  private setupFormChangeDetection(): void {
    // Campos que SÍ deben limpiar los calculados cuando cambian
    const triggerFields = ['credit_line_id', 'period_id', 'period_quantity', 'start_date'];

    triggerFields.forEach(fieldName => {
      this.form.get(fieldName)?.valueChanges.subscribe((newValue) => {
        if (this.updatingFromBackend) return;
        if (!this.simulationCompleted) return; // Solo actuar si ya se simuló

        console.warn(`Campo "${fieldName}" cambió. Limpiando campos calculados.`);
        this.simulationCompleted = false;
        this.simulationResult = null;
        this.errorMessage = 'Los datos han cambiado. Debe simular nuevamente antes de guardar.';

        this.clearCalculatedFields();

        setTimeout(() => {
          if (this.errorMessage === 'Los datos han cambiado. Debe simular nuevamente antes de guardar.') {
            this.errorMessage = '';
          }
        }, 5000);
      });
    });

    this.form.get('initial_quota')?.valueChanges.subscribe(() => {
      if (this.updatingFromBackend) return;
      if (!this.simulationCompleted) return;

      this.simulationCompleted = false;
      this.simulationResult = null;
      this.errorMessage = 'Los datos han cambiado. Debe simular nuevamente antes de guardar.';

      // ✅ Limpiar cuota cuando el usuario modifica cuota inicial post-simulación
      this.form.get('quota_value')?.setValue(null, { emitEvent: true });
      this.form.get('quota_value')?.enable({ emitEvent: false });

      this.interactionCamposParaCalculo();
      setTimeout(() => {
        if (this.errorMessage === 'Los datos han cambiado. Debe simular nuevamente antes de guardar.') {
          this.errorMessage = '';
        }
      }, 5000);
    });

    this.form.get('start_date')?.valueChanges.subscribe(() => {
      /*if (this.updatingFromBackend) return;
      if (!this.simulationCompleted) return;
      this.simulationCompleted = false;
      this.simulationResult = null;
      this.errorMessage = 'Los datos han cambiado. Debe simular nuevamente antes de guardar.';*/

      if (this.isQuincenal) {
        const initialDayQuincena = this.form.get('start_date')?.value.split('-')[2];
        this.form.get('inicio_quincena')?.setValue(initialDayQuincena);
      }

      this.interactionCamposParaCalculo();
      setTimeout(() => {
        if (this.errorMessage === 'Los datos han cambiado. Debe simular nuevamente antes de guardar.') {
          this.errorMessage = '';
        }
      }, 5000);
    });
  }


  getUserDataFromToken(): void {
    this.currentUserRole = this.authService.getUserRole();
    this.currentUserId = this.authService.getUserId();

    console.log('Usuario logueado:', {
      role: this.currentUserRole,
      userId: this.currentUserId
    });
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

  cancel() {
    console.log("Cancelado con estilo.");
  }

  formatCurrency(controlName: string) {
    const control = this.form.get(controlName);
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

  formatValueCurrency(rawValue: string) {
    if (rawValue === null || rawValue === '') return;
    const numericValue = rawValue.toString().replace(/\D/g, '');
    if (numericValue === '') {
      return '';;
    }
    return Number(numericValue).toLocaleString('es-CO');
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

  // Método genérico reutilizable para validar rangos numéricos
  validarRangoNumerico(
    controlName: string,
    min: number,
    max: number,
    errorProperty: string,
    nombreCampo: string = 'valor'
  ) {
    const control = this.form.get(controlName);

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
    if (controlName === 'period_quantity' && numValue < 1) {
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


  private validateStep3(): boolean {
    const raw = this.form.getRawValue();

    // Validaciones básicas de campos obligatorios
    if (!raw.credit_line_id || !raw.period_id || !raw.period_quantity || !raw.start_date) {
      this.errorMessage = 'Por favor complete todos los campos obligatorios del paso 3';
      return false;
    }

    const [year, month, day] = raw.start_date.split('-').map(Number);
    const selectedDate = new Date(year, month - 1, day);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      this.errorMessage = 'La fecha de inicio no puede ser anterior a hoy';
      return false;
    }

    const cuota = this.toNumber(raw.quota_value);
    const tasa = this.toDecimal(raw.tax_value);
    const itemValue = this.toNumber(raw.item_value);
    const desembolsoValue = this.toNumber(raw.desembolso_value);

    const hasCuota = cuota > 0;
    const hasTasa = tasa > 0;
    const hasItemValue = itemValue > 0;
    const hasDesembolsoValue = desembolsoValue > 0;

    // Determinar el grupo
    const isDesembolsoEnabled = !this.isFinanceCreditLine;

    let isValidCombination = false;

    if (isDesembolsoEnabled) {
      // GRUPO 2: validar combinaciones con desembolsoValue
      const validCombinations = [
        (hasCuota && hasTasa && !hasDesembolsoValue), // CALCULAR_CAPITAL
        (hasCuota && hasDesembolsoValue && !hasTasa), // CALCULAR_TASA
        (hasTasa && hasDesembolsoValue && !hasCuota)  // CALCULAR_CUOTA
      ];
      isValidCombination = validCombinations.some(combo => combo);

      if (!isValidCombination) {
        this.errorMessage = 'Debe ingresar exactamente 2 de los 3 valores:\n' +
          '• Cuota + Tasa (calcula Valor Desembolso)\n' +
          '• Cuota + Valor Desembolso (calcula Tasa)\n' +
          '• Tasa + Valor Desembolso (calcula Cuota)';
        return false;
      }
    } else {
      // GRUPO 1: validar combinaciones con itemValue
      const validCombinations = [
        (hasCuota && hasTasa && !hasItemValue), // CALCULAR_CAPITAL
        (hasCuota && hasItemValue && !hasTasa), // CALCULAR_TASA
        (hasTasa && hasItemValue && !hasCuota)  // CALCULAR_CUOTA
      ];
      isValidCombination = validCombinations.some(combo => combo);

      if (!isValidCombination) {
        this.errorMessage = 'Debe ingresar exactamente 2 de los 3 valores:\n' +
          '• Cuota + Tasa (calcula Valor Producto)\n' +
          '• Cuota + Valor Producto (calcula Tasa)\n' +
          '• Tasa + Valor Producto (calcula Cuota)';
        return false;
      }
    }

    // Validación específica para periodicidad quincenal
    const selectedPeriod = this.periods.find(
      p => p.id === this.ensureNumber(raw.period_id)
    );

    if (selectedPeriod?.cod === 'QU') {
      if (!raw.inicio_quincena || !raw.fin_quincena) {
        this.errorMessage = 'Para periodicidad quincenal debe seleccionar inicio y fin de quincena';
        return false;
      }
    }

    this.errorMessage = '';
    return true;
  }

  private interactionCamposParaCalculo(): void {
    const quotaControl = this.form.get('quota_value');
    const taxControl = this.form.get('tax_value');
    const itemControl = this.form.get('item_value');
    const desembolsoControl = this.form.get('desembolso_value');

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

    const raw = this.form.getRawValue();
    const cuota = this.toNumber(raw.quota_value);
    const tasa = this.toDecimal(raw.tax_value);
    const itemValue = this.toNumber(raw.item_value);
    const desembolsoValue = this.toNumber(raw.desembolso_value);

    const hasCuota = cuota > 0;
    const hasTasa = tasa > 0;
    const hasItemValue = itemValue > 0;
    const hasDesembolsoValue = desembolsoValue > 0;

    const isDesembolsoEnabled = !this.isFinanceCreditLine;

    if (isDesembolsoEnabled) {
      // ======== GRUPO 2: cuota, tasa, desembolsoValue ========
      if (hasCuota && hasTasa) {
        // Tiene cuota + tasa → deshabilitar desembolsoValue (se calculará)
        this.form.get('desembolso_value')?.disable({ emitEvent: false });
      } else if (hasCuota && hasDesembolsoValue) {
        // Tiene cuota + desembolso → deshabilitar tasa (se calculará)
        this.form.get('tax_value')?.disable({ emitEvent: false });
      } else if (hasTasa && hasDesembolsoValue) {
        // Tiene tasa + desembolso → deshabilitar cuota (se calculará)
        this.form.get('quota_value')?.disable({ emitEvent: false });
      } else {
        // Menos de 2 campos llenos → habilitar todos
        this.form.get('quota_value')?.enable({ emitEvent: false });
        this.form.get('tax_value')?.enable({ emitEvent: false });
        this.form.get('desembolso_value')?.enable({ emitEvent: false });
      }
    } else {
      // ======== GRUPO 1: cuota, tasa, itemValue ========
      if (hasCuota && hasTasa) {
        // Tiene cuota + tasa → deshabilitar itemValue (se calculará)
        this.form.get('item_value')?.disable({ emitEvent: false });
      } else if (hasCuota && hasItemValue) {
        // Tiene cuota + item → deshabilitar tasa (se calculará)
        this.form.get('tax_value')?.disable({ emitEvent: false });
      } else if (hasTasa && hasItemValue) {
        // Tiene tasa + item → deshabilitar cuota (se calculará)
        this.form.get('quota_value')?.disable({ emitEvent: false });
      } else {
        // Menos de 2 campos llenos → habilitar todos
        this.form.get('quota_value')?.enable({ emitEvent: false });
        this.form.get('tax_value')?.enable({ emitEvent: false });
        this.form.get('item_value')?.enable({ emitEvent: false });
      }
    }
  }


  simulate(): void {
    this.submitted = true;
    this.simulationCompleted = false;
    this.simulationResult = null;

    const step3Valid = this.validateStep3();

    if (!step3Valid) {
      this.errorMessage = 'Por favor complete todos los campos obligatorios';

      setTimeout(() => {
        document.querySelector('.is-invalid')
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);

      return;
    }

    // ==================== VALIDACIÓN DE CUOTA INICIAL ====================
    const raww = this.form.getRawValue();
    const itemVa0lue = this.toNumber(raww.item_value);
    const initialQuota = this.toNumber(raww.initial_quota);

    // Validar que la cuota inicial sea menor al valor del producto
    if (initialQuota > 0 && initialQuota >= itemVa0lue) {
      this.errorMessage = 'La cuota inicial debe ser menor al valor del producto';
      //this.stepper.selectedIndex = 2;

      setTimeout(() => {
        document.querySelector('input[formControlName="initial_quota"]')
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);

      return;
    }

    const raw = this.form.getRawValue();
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
      //this.stepper.selectedIndex = 2;
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
      inicio_quincena: this.form.get('inicio_quincena')?.value,
      fin_quincena: this.form.get('fin_quincena')?.value,
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

        const numeroCuotas = this.ensureNumber(this.form.get('period_quantity')?.value) ?? 0;
        const dcreCapital = data.dcreCapital ?? 0;


        // ==================== CALCULAR_CUOTA ====================
        if (tipo_calculo === 'CALCULAR_CUOTA') {
          const cuotaCalculada = data.dcreVlrcuota ?? 0;
          console.log('Cuota calculada:', cuotaCalculada);
          const valorSolicitud = cuotaCalculada * numeroCuotas;
          console.log('Valor soli:', valorSolicitud);


          if (grupo === 'GRUPO2') {
            this.form.patchValue({
              quota_value: cuotaCalculada,
              total_intention_value: valorSolicitud,
              item_value: null
            }, { emitEvent: false });

            this.formatCurrency('quota_value');
            this.formatCurrency('total_intention_value');

            // Asegurar estados correctos
            setTimeout(() => {
              this.form.get('quota_value')?.enable({ emitEvent: false });
              this.form.get('tax_value')?.enable({ emitEvent: false });
              this.form.get('desembolso_value')?.enable({ emitEvent: false });
              this.form.get('item_value')?.disable({ emitEvent: false });
            }, 50);

          } else {
            this.form.patchValue({
              quota_value: cuotaCalculada,
              total_intention_value: valorSolicitud,
              desembolso_value: null
            }, { emitEvent: false });

            this.formatCurrency('quota_value');
            this.formatCurrency('total_intention_value');

            // Asegurar estados correctos
            setTimeout(() => {
              this.form.get('quota_value')?.enable({ emitEvent: false });
              this.form.get('tax_value')?.enable({ emitEvent: false });
              this.form.get('item_value')?.enable({ emitEvent: false });
              this.form.get('desembolso_value')?.disable({ emitEvent: false });
            }, 50);
          }
        }

        // ==================== CALCULAR_TASA ====================
        else if (tipo_calculo === 'CALCULAR_TASA') {
          const tasaCalculada = data.dcreTasa ?? 0;
          const cuotaActual = data.dcreVlrcuota ?? 0;
          const valorSolicitud = cuotaActual * numeroCuotas;

          if (grupo === 'GRUPO2') {
            this.form.patchValue({
              tax_value: Number(tasaCalculada.toFixed(2)),
              total_intention_value: valorSolicitud,
              item_value: null
            }, { emitEvent: false });

            this.formatCurrency('total_intention_value');

            // Asegurar estados correctos
            setTimeout(() => {
              this.form.get('quota_value')?.enable({ emitEvent: false });
              this.form.get('tax_value')?.enable({ emitEvent: false });
              this.form.get('desembolso_value')?.enable({ emitEvent: false });
              this.form.get('item_value')?.disable({ emitEvent: false });
            }, 50);

          } else {
            this.form.patchValue({
              tax_value: Number(tasaCalculada.toFixed(2)),
              total_intention_value: valorSolicitud,
              desembolso_value: null
            }, { emitEvent: false });

            this.formatCurrency('total_intention_value');

            // Asegurar estados correctos
            setTimeout(() => {
              this.form.get('quota_value')?.enable({ emitEvent: false });
              this.form.get('tax_value')?.enable({ emitEvent: false });
              this.form.get('item_value')?.enable({ emitEvent: false });
              this.form.get('desembolso_value')?.disable({ emitEvent: false });
            }, 50);
          }
        }

        // ==================== CALCULAR_CAPITAL ====================
        else if (tipo_calculo === 'CALCULAR_CAPITAL') {
          const cuotaActual = data.dcreVlrcuota ?? 0;
          const valorSolicitud = cuotaActual * numeroCuotas;
          console.log('Valor solicitud:', cuotaActual, valorSolicitud);

          const valorBase = data.dcreVlrBase ?? data.dcreCapital ?? 0;
          const initialQuota = this.toNumber(this.form.get('initial_quota')?.value);

          if (grupo === 'GRUPO2') {
            this.form.patchValue({
              desembolso_value: valorBase,
              quota_value: data.dcreVlrcuota,
              total_intention_value: valorSolicitud,
              item_value: null
            }, { emitEvent: false });

            this.formatCurrency('desembolso_value');
            this.formatCurrency('quota_value');
            this.formatCurrency('total_intention_value');

            setTimeout(() => {
              // this.form.get('quota_value')?.enable({ emitEvent: false });
              this.form.get('tax_value')?.enable({ emitEvent: false });
              this.form.get('desembolso_value')?.enable({ emitEvent: false });
              this.form.get('item_value')?.disable({ emitEvent: false });
              this.form.get('quota_value')?.enable({ emitEvent: false });
            }, 50);

          } else {
            this.form.patchValue({
              total_intention_value: valorSolicitud,
              quota_value: data.dcreVlrcuota,
              desembolso_value: null
            }, { emitEvent: false });
            this.form.patchValue({
              item_value: valorBase,
            }, { emitEvent: true });

            this.formatCurrency('item_value');
            this.formatCurrency('quota_value');
            this.formatCurrency('total_intention_value');


            setTimeout(() => {
              this.form.get('quota_value')?.enable({ emitEvent: false });
              this.form.get('tax_value')?.enable({ emitEvent: false });
              this.form.get('item_value')?.enable({ emitEvent: false });
              this.form.get('desembolso_value')?.disable({ emitEvent: false });
              //this.form.get('item_value').
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

  onCreditLineChange(): void {
    const id = this.form.get('credit_line_id')?.value;
    const selected = this.creditLines.find(c => c.id === Number(id));

    if (!selected) {
      this.selectedCreditLine = null;
      return;
    }
    this.selectedCreditLine = selected;

    const desembolsoCtrl = this.form.get('desembolso_value');
    const itemCtrl = this.form.get('item_value');
    const financiateCtrl = this.form.get('value_to_financiate');
    const initialQuotaCtrl = this.form.get('initial_quota');
    const quotaCtrl = this.form.get('quota_value');
    const taxCtrl = this.form.get('tax_value');
    const totalCtrl = this.form.get('total_intention_value');

    //Limpiar TODOS los campos relacionados al cambiar de línea
    quotaCtrl?.setValue(null);
    taxCtrl?.setValue(null);
    totalCtrl?.setValue(null);
    desembolsoCtrl?.setValue(null);
    itemCtrl?.setValue(null);
    financiateCtrl?.setValue(null);
    initialQuotaCtrl?.setValue(null);
  }


  requiresDocumentation(): boolean {
    return this.selectedCreditLine?.requireDocumentation ?? false;
  }

  private ensureNumber(value: any): number | null {
    const n = Number(value);
    return isNaN(n) ? null : n;
  }

  private toNumber(value: any): number {
    if (value === null || value === undefined || value === '') return 0;
    return Number(value.toString().replace(/\D/g, ''));
  }

  private toDecimal(value: any): number {
    if (value === null || value === undefined || value === '') return 0;

    const normalized = value.toString().replace(',', '.');
    const num = Number(normalized);

    return isNaN(num) ? 0 : num;
  }


  //VALIDAR SI EL PERIODO ES QUINCENAL HABILIATR LOS CAMPOS DE DIA INICIAL Y FINAL DE LA QUINCENA
  onPeriodChange(): void {
    const periodId = this.form.get('period_id')?.value;

    if (!periodId) {
      this.isQuincenal = false;
      this.form.get('inicio_quincena')?.disable();
      this.form.get('fin_quincena')?.disable();
      this.form.get('inicio_quincena')?.setValue(null);
      this.form.get('fin_quincena')?.setValue(null);
      return;
    }

    const selectedPeriod = this.periods.find(p => p.id === Number(periodId));
    if (selectedPeriod && selectedPeriod.cod === 'QU') {
      this.isQuincenal = true;

      // Habilitar campos
      this.form.get('inicio_quincena')?.enable();
      this.form.get('fin_quincena')?.enable();

      // Agregar validadores
      this.form.get('inicio_quincena')?.setValidators([Validators.required, Validators.min(1), Validators.max(31)]);
      this.form.get('fin_quincena')?.setValidators([Validators.required, Validators.min(1), Validators.max(31)]);
    } else {
      this.isQuincenal = false;

      // Limpiar valores
      this.form.get('inicio_quincena')?.setValue(null);
      this.form.get('fin_quincena')?.setValue(null);

      // Deshabilitar campos
      this.form.get('inicio_quincena')?.disable();
      this.form.get('fin_quincena')?.disable();

      // Limpiar validadores
      this.form.get('inicio_quincena')?.setValidators(null);
      this.form.get('fin_quincena')?.setValidators(null);
    }

    this.form.get('inicio_quincena')?.updateValueAndValidity();
    this.form.get('fin_quincena')?.updateValueAndValidity();
  }

  private updateValidatorsByLoanDisbursement(loanDisbursement: boolean): void {
    const desembolso = this.form.get('desembolso_value');
    const item = this.form.get('item_value');
    const financiate = this.form.get('value_to_financiate');
    const initialQuota = this.form.get('initial_quota');
    const tasa = this.form.get('tax_value');
    const cuota = this.form.get('quota_value');
    const fecha = this.form.get('start_date');

    if (loanDisbursement) {
      // obligatorios desembolso
      desembolso?.setValidators([Validators.required]);
      tasa?.setValidators([Validators.required]);
      cuota?.setValidators([Validators.required]);
      fecha?.setValidators([Validators.required]);

      item?.clearValidators();
      financiate?.clearValidators();
      initialQuota?.clearValidators();
    } else {
      // obligatorios producto
      item?.setValidators([Validators.required]);
      financiate?.setValidators([Validators.required]);
      initialQuota?.setValidators([Validators.required]);
      fecha?.setValidators([Validators.required]);
      tasa?.setValidators([Validators.required]);
      cuota?.setValidators([Validators.required]);

      desembolso?.clearValidators();
    }

    desembolso?.updateValueAndValidity({ emitEvent: false });
    item?.updateValueAndValidity({ emitEvent: false });
    financiate?.updateValueAndValidity({ emitEvent: false });
    initialQuota?.updateValueAndValidity({ emitEvent: false });
    tasa?.updateValueAndValidity({ emitEvent: false });
    cuota?.updateValueAndValidity({ emitEvent: false });
    fecha?.updateValueAndValidity({ emitEvent: false });

  }

  setupValueToFinanciateCalculation(): void {
    this.form.get('item_value')?.valueChanges.subscribe(() => {
      this.calculateValueToFinanciate();
      const itemValue = this.toNumber(this.form.get('item_value')?.value);
      if (itemValue > 0) {
        this.form.get('initial_quota')?.enable({ emitEvent: false });
      } else {
        // this.form.get('initial_quota')?.setValue(null, { emitEvent: false });
        this.form.get('initial_quota')?.disable({ emitEvent: false });
      }
    });

    this.form.get('initial_quota')?.valueChanges.subscribe(() => {
      this.calculateValueToFinanciate();
    });
  }

  calculateValueToFinanciate(): void {
    const itemValue = this.toNumber(this.form.get('item_value')?.value);
    const initialQuota = this.toNumber(this.form.get('initial_quota')?.value);

    this.errorValueToFinanciate = '';

    if (itemValue === 0) {
      this.form.patchValue({
        value_to_financiate: null
      }, { emitEvent: false });
      return;
    }

    if (itemValue > 0 && initialQuota === 0) {
      this.form.patchValue({
        value_to_financiate: itemValue
      }, { emitEvent: false });
      this.formatCurrency('value_to_financiate');
      return;
    }

    if (initialQuota > 0) {
      if (initialQuota >= itemValue) {
        this.errorValueToFinanciate = 'La cuota inicial debe ser menor al valor del producto';
        this.form.patchValue({
          value_to_financiate: null
        }, { emitEvent: false });
        return;
      }

      const valueToFinanciate = itemValue - initialQuota;
      this.form.patchValue({
        value_to_financiate: valueToFinanciate
      }, { emitEvent: false });
      this.formatCurrency('value_to_financiate');
    }
  }

  private clearCalculatedFields(): void {
    this.updatingFromBackend = true;

    this.form.patchValue({
      quota_value: null,
      tax_value: null,
      item_value: null,
      desembolso_value: null,
      value_to_financiate: null,
      initial_quota: null,
      total_intention_value: null,
    }, { emitEvent: false });

    // Resetear estados de campos según el grupo activo
    const hasDisbursement = this.selectedCreditLine?.loanDisbursement ?? false;

    this.form.get('quota_value')?.enable({ emitEvent: false });
    this.form.get('tax_value')?.enable({ emitEvent: false });

    if (hasDisbursement) {
      this.form.get('desembolso_value')?.enable({ emitEvent: false });
      this.form.get('item_value')?.disable({ emitEvent: false });
      this.form.get('value_to_financiate')?.disable({ emitEvent: false });
      this.form.get('initial_quota')?.disable({ emitEvent: false });
    } else {
      this.form.get('item_value')?.enable({ emitEvent: false });
      this.form.get('value_to_financiate')?.enable({ emitEvent: false });
      this.form.get('initial_quota')?.enable({ emitEvent: false });
      this.form.get('desembolso_value')?.disable({ emitEvent: false });
    }

    this.isQuincenal = false;
    this.numeroCoutasInForm = null;
    this.errorInicioQuincena = null;
    this.errorFinQuincena = null;
    this.errorValueToFinanciate = '';

    setTimeout(() => {
      this.updatingFromBackend = false;
    }, 100);

  }

  get getPapeleria() {
    const creditLine = this.selectedCreditLine;
    let value;
    if (creditLine?.loanDisbursement) {
      value = this.form.get('desembolso_value')?.value;
    } else {
      value = this.form.get('value_to_financiate')?.value;
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