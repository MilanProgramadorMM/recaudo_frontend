import { CdkStepper, CdkStepperModule } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FileUploaderComponent } from '@components/file-uploader.component';
import { PageTitleComponent } from '@components/page-title.component';
import { CalculateCreditIntentionDto, CreditIntentionService, CreditProjectionDto, DocumentMetadata } from '@core/services/creditIntention.service';
import { CreditLineDto, CreditLineService } from '@core/services/creditLine.service';
import { Glotypes, GlotypesService } from '@core/services/glotypes.service';
import { PeriodDto, PeriodService } from '@core/services/perdiod.service';
import { PersonService } from '@core/services/person.service';
import { OptionDTO, UbicacionService } from '@core/services/ubicacion.service';
import { ZonaResponseDto, ZonaService } from '@core/services/zona.service';
import { LoadingComponent } from '@views/ui/loading/loading.component';
import { NgStepperComponent, NgStepperModule } from 'angular-ng-stepper';
import { debounceTime, firstValueFrom, merge, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-simulation-intention',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PageTitleComponent,
    NgStepperModule,
    CdkStepperModule,
    FileUploaderComponent
  ],
  templateUrl: './simulation-intention.component.html',
  styleUrl: './simulation-intention.component.scss'
})
export class SimulationIntentionComponent implements OnInit {

  @ViewChild('stepper') stepper!: NgStepperComponent
  @ViewChild('cdkSteppers') cdkSteppers!: CdkStepper

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



  documentTypes: Glotypes[] = [];
  genderGlotypes: Glotypes[] = [];
  paises: OptionDTO[] = [];
  departamentos: OptionDTO[] = [];
  municipios: OptionDTO[] = [];
  barrios: OptionDTO[] = [];
  zonas: ZonaResponseDto[] = [];


  selectedCreditLine: CreditLineDto | null = null;
  documentFiles: Map<string, { front?: any[], back?: any[], single?: any[] }> = new Map();


  creditLines: CreditLineDto[] = [];
  periods: PeriodDto[] = [];
  taxTypes: any[] = [];
  today: string = '';

  private fieldMapping: Record<string, string> = {
    documentType: 'document_type',
    document: 'document',
    firstName: 'firstname',
    middleName: 'middlename',
    lastName: 'lastname',
    maternalLastname: 'maternal_lastname',
    fullName: 'fullname',
    gender: 'gender',
    occupation: 'occupation',
    descriptionD: 'description',
    correo: 'email',
    celular: 'phone_number',
    telefono: 'whatsapp_number',
    adress: 'home_address',
    countryId: 'country_id',
    departentId: 'department_id',
    cityId: 'municipality_id',
    neighborhoodId: 'neighborhood_id',
    zonaId: 'zone_id'
  };


  constructor(
    private fb: FormBuilder,
    private glotypesService: GlotypesService,
    private ubicacionService: UbicacionService,
    private zonaService: ZonaService,
    private creditLineService: CreditLineService,
    private periodService: PeriodService,
    private personService: PersonService,
    private dialog: MatDialog,
    private creditIntentionService: CreditIntentionService,
    private snackBar: MatSnackBar
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

    this.form.valueChanges.subscribe(() =>
      this.updateFullName());
    this.loadDocumentTypes();
    this.loadGender();
    this.fetchLines();
    this.fetchPeriods();
    this.loadZonas();



    this.ubicacionService.getPaises().subscribe(data => this.paises = data);
    // Escuchar cambios
    this.form.get('country_id')?.valueChanges.subscribe(paisId => {
      if (paisId) {
        this.ubicacionService.getDepartamentos(paisId).subscribe(data => {
          this.departamentos = data;
          this.municipios = [];
          this.barrios = [];
          this.form.patchValue({ departamento: '', ciudad: '', barrio: '' });
        });
      }
    });

    this.form.get('department_id')?.valueChanges.subscribe(depId => {
      if (depId) {
        this.ubicacionService.getMunicipios(depId).subscribe(data => {
          this.municipios = data;
          this.barrios = [];
          this.form.patchValue({ ciudad: '', barrio: '' });
        });
      }
    });

    this.form.get('municipality_id')?.valueChanges.subscribe(munId => {
      if (munId) {
        this.ubicacionService.getBarrios(munId).subscribe(data => {
          this.barrios = data;
          this.form.patchValue({ barrio: '' });
        });
      }
    });

    this.form.get('document')?.valueChanges.subscribe(() => {
      if (this.updatingFromBackend) return;

      this.resetPersonForm();
    });

    //ESCUCHAR CAMBIOS EN CAMPOS TASA O CUOTA PARA AJUSTAR DEMAS CAMPOS
    this.setupFormChangeDetection();
    this.interactionCamposParaCalculo();
    this.setupValueToFinanciateCalculation();
  }

  private setupFormChangeDetection(): void {
    this.formSubscription = this.form.valueChanges.subscribe(() => {
      // Si hay una simulación completada y el usuario cambia algo
      if (this.simulationCompleted) {
        console.warn('Formulario modificado después de la simulación. Desactivando botón guardar.');
        this.simulationCompleted = false;
        this.simulationResult = null;

        // Opcional: Mostrar mensaje al usuario
        this.errorMessage = 'Los datos han cambiado. Debe simular nuevamente antes de guardar.';

        // Limpiar mensaje después de unos segundos
        setTimeout(() => {
          if (this.errorMessage === 'Los datos han cambiado. Debe simular nuevamente antes de guardar.') {
            this.errorMessage = '';
          }
        }, 5000);
      }
    });
  }

  updateFullName() {
    if (this.updatingFromBackend) return;

    const firstname = this.form.get('firstname')?.value;
    const middlename = this.form.get('middlename')?.value;
    const lastname = this.form.get('lastname')?.value;
    const maternal = this.form.get('maternal_lastname')?.value;

    const full = [firstname, middlename, lastname, maternal]
      .filter(v => v && v.trim())
      .join(' ');

    this.form.get('fullname')?.setValue(full.toUpperCase(), { emitEvent: false });
  }

  loadGender() {
    this.glotypesService.getGlotypesByKey('TIPGEN').subscribe({
      next: (data) => {
        this.genderGlotypes = data;
      },
      error: (err) => {
        console.error('Error cargando opciones:', err);
      }
    });
  }

  loadZonas() {
    this.zonaService.getByStatus().subscribe({
      next: (res) => {
        this.zonas = res.data;
      }, error: (err) => {
        console.error('Error cargando zonas:', err);
      }
    });
  }

  loadDocumentTypes() {
    this.glotypesService.getGlotypesByKey('TIPDOC').subscribe({
      next: (data) => {
        this.documentTypes = data;
      },
      error: (err) => {
        console.error('Error cargando tipos de documento:', err);
      }
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
    this.validarRangoNumerico('period_quantity', 2, 100, 'numeroCoutasInForm', 'número de cuotas');
  }

  limitarDiaInicioQuincena(event: Event) {
    this.validarRangoNumerico('inicio_quincena', 1, 31, 'errorInicioQuincena', 'día');
  }

  limitarDiaFinQuincena(event: Event) {
    this.validarRangoNumerico('fin_quincena', 1, 31, 'errorFinQuincena', 'día');
  }

  getClient() {
    const documentNumber = this.form.get('document')?.value;

    if (!documentNumber) {
      this.errorMessage = 'Debes ingresar un número de documento antes de buscar.';
      return;
    }

    this.errorMessage = '';

    this.form.get('document_type')?.enable({ emitEvent: false });
    this.form.get('document')?.enable({ emitEvent: false });

    const dialogRef = this.dialog.open(LoadingComponent, {
      disableClose: true,
    });

    this.personService.getPersonByDocument(documentNumber).subscribe({
      next: (response) => {
        this.updatingFromBackend = true;

        const person = response.data;

        if (!person) {
          this.resetPersonForm();
          this.errorMessage = 'No se encontró ninguna persona con el documento ingresado.';
          this.updatingFromBackend = false;
          return;
        }

        this.errorMessage = '';

        this.form.patchValue({
          document_type: person.documentType,
          document: person.document,
          firstname: person.firstName,
          middlename: person.middleName,
          lastname: person.lastName,
          maternal_lastname: person.maternalLastname,
          fullname: person.fullName,
          gender: person.gender,
          occupation: person.occupation,
          description: person.description,
          email: person.correo,
          phone_number: person.celular,
          whatsapp_number: person.celular,
          home_address: person.adress,
          zone_id: person.zid ? parseInt(person.zid) : null,
          country_id: person.countryId
        });

        setTimeout(() => {
          this.form.patchValue({
            department_id: person.departentId
          });

          setTimeout(() => {
            this.form.patchValue({
              municipality_id: person.cityId,
              neighborhood_id: person.neighborhoodId
            });

            this.updatingFromBackend = false;
            this.disableFieldsByBackend(person);
          }, 300);
        }, 300);
      },
      error: () => {
        this.errorMessage = 'Error consultando el documento.';
        this.updatingFromBackend = false;
      },
      complete: () => dialogRef.close()
    });
  }

  private resetPersonForm(): void {
    this.selectedCreditLine = null;
    this.isQuincenal = false;

    this.form.patchValue({
      firstname: '',
      middlename: '',
      lastname: '',
      maternal_lastname: '',
      fullname: '',
      gender: '',
      occupation: '',
      description: '',
      email: '',
      phone_number: '',
      whatsapp_number: '',
      home_address: '',
      zone_id: '',
      country_id: '',
      department_id: '',
      municipality_id: '',
      neighborhood_id: ''
    });

    [
      'firstname',
      'middlename',
      'lastname',
      'maternal_lastname',
      'gender',
      'occupation',
      'description',
      'email',
      'phone_number',
      'whatsapp_number',
      'home_address',
      'zone_id',
      'country_id',
      'department_id',
      'municipality_id',
      'neighborhood_id'
    ].forEach(field => {
      this.form.get(field)?.enable({ emitEvent: false });
    });

    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  disableFieldsByBackend(person: any) {
    Object.entries(this.fieldMapping).forEach(([backendField, formField]) => {
      // Excluir document_type y document de la deshabilitación automática
      if (formField === 'document_type' || formField === 'document') {
        return; // Saltar estos campos, mantenerlos siempre habilitados
      }

      const value = person[backendField];
      if (value !== null && value !== undefined && value !== '' && value !== 0) {
        this.form.get(formField)?.disable({ emitEvent: false });
      } else {
        this.form.get(formField)?.enable({ emitEvent: false });
      }
    });

    if (person.zid) {
      this.form.get('zone_id')?.disable({ emitEvent: false });
    }
  }

  nextStep(step: number): void {
    this.submitted = true;

    let isValid = false;

    switch (step) {
      case 1:
        // Validar campos del paso 1 (Datos Personales)
        isValid = this.validateStep1();
        break;
      case 2:
        // Validar campos del paso 2 (Datos de Contacto)
        isValid = this.validateStep2();
        break;
      case 3:
        // Validar campos del paso 3 (Datos del Crédito)
        isValid = this.validateStep3();
        break;
    }

    if (isValid) {
      this.submitted = false;
      this.stepper.next();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Scroll al primer campo con error
      setTimeout(() => {
        const firstInvalid = document.querySelector('.is-invalid');
        if (firstInvalid) {
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }

  private validateStep1(): boolean {
    const step1Fields = [
      'document_type',
      'document',
      'firstname',
      'lastname',
      'gender',
      'occupation'
    ];

    let isValid = true;

    step1Fields.forEach(field => {
      const control = this.form.get(field);
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

  private validateStep2(): boolean {
    const step2Fields = [
      'email',
      'phone_number',
      'zone_id',
      'country_id',
      'department_id',
      'municipality_id',
      'neighborhood_id',
      'home_address'
    ];

    let isValid = true;

    step2Fields.forEach(field => {
      const control = this.form.get(field);
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

  private validateStep3(): boolean {
    const raw = this.form.getRawValue();

    // Validaciones básicas de campos obligatorios
    if (!raw.credit_line_id || !raw.period_id || !raw.period_quantity || !raw.start_date) {
      this.errorMessage = 'Por favor complete todos los campos obligatorios del paso 3';
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(raw.start_date);

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
    const isDesembolsoEnabled = this.form.get('desembolso_value')?.enabled ?? false;

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

    const isDesembolsoEnabled = this.form.get('desembolso_value')?.enabled ?? false;

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

    const step1Valid = this.validateStep1();
    const step2Valid = this.validateStep2();
    const step3Valid = this.validateStep3();

    if (!step1Valid || !step2Valid || !step3Valid) {
      this.errorMessage = 'Por favor complete todos los campos obligatorios';

      if (!step1Valid) this.stepper.selectedIndex = 0;
      else if (!step2Valid) this.stepper.selectedIndex = 1;
      else this.stepper.selectedIndex = 2;

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
      this.stepper.selectedIndex = 2;

      setTimeout(() => {
        document.querySelector('input[formControlName="initial_quota"]')
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);

      return;
    }

    if (
      this.isFinalSubmit &&
      this.requiresDocumentation() &&
      !this.validateCedulaOnly()
    ) {
      setTimeout(() => {
        document.querySelector('fieldset legend')
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
          const valorSolicitud = cuotaCalculada * numeroCuotas;

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
          const cuotaActual = this.toNumber(this.form.get('quota_value')?.value);
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
          const cuotaActual = this.toNumber(this.form.get('quota_value')?.value);
          const valorSolicitud = cuotaActual * numeroCuotas;

          if (grupo === 'GRUPO2') {
            this.form.patchValue({
              desembolso_value: dcreCapital,
              total_intention_value: valorSolicitud,
              item_value: null
            }, { emitEvent: false });

            this.formatCurrency('desembolso_value');
            this.formatCurrency('total_intention_value');

            setTimeout(() => {
              this.form.get('quota_value')?.enable({ emitEvent: false });
              this.form.get('tax_value')?.enable({ emitEvent: false });
              this.form.get('desembolso_value')?.enable({ emitEvent: false });
              this.form.get('item_value')?.disable({ emitEvent: false });
            }, 50);

          } else {
            this.form.patchValue({
              item_value: dcreCapital,
              total_intention_value: valorSolicitud,
              desembolso_value: null
            }, { emitEvent: false });

            this.formatCurrency('item_value');
            this.formatCurrency('total_intention_value');


            setTimeout(() => {
              this.form.get('quota_value')?.enable({ emitEvent: false });
              this.form.get('tax_value')?.enable({ emitEvent: false });
              this.form.get('item_value')?.enable({ emitEvent: false });
              this.form.get('desembolso_value')?.disable({ emitEvent: false });
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

  async saveIntention(): Promise<void> {
    if (!this.simulationCompleted) {
      this.errorMessage = 'Debe realizar la simulación antes de guardar';
      return;
    }

    if (this.requiresDocumentation() && !this.validateCedulaOnly()) {
      setTimeout(() => {
        document.querySelector('fieldset legend')
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return;
    }

    const raw = this.form.getRawValue();
    const tasa = this.toDecimal(raw.tax_value);

    const capitalValue = this.selectedCreditLine?.loanDisbursement
      ? this.toNumber(raw.desembolso_value)
      : this.toNumber(raw.item_value);


    // PAYLOAD 1 – Registrar intención de crédito
    const payloadIntencion = {
      // Datos personales
      zone_id: this.ensureNumber(raw.zone_id),
      document_type: this.ensureNumber(raw.document_type),
      document: raw.document,
      firstname: raw.firstname.toUpperCase(),
      middlename: raw.middlename.toUpperCase() || null,
      lastname: raw.lastname.toUpperCase(),
      maternal_lastname: raw.maternal_lastname.toUpperCase() || null,
      fullname: raw.fullname,
      gender: this.ensureNumber(raw.gender),
      occupation: raw.occupation || null,
      description: raw.description || null,

      // Contacto
      email: raw.email || null,
      phone_number: raw.phone_number || null,
      whatsapp_number: raw.whatsapp_number || null,

      // Ubicación
      home_address: raw.home_address || null,
      country_id: this.ensureNumber(raw.country_id),
      department_id: this.ensureNumber(raw.department_id),
      municipality_id: this.ensureNumber(raw.municipality_id),
      neighborhood_id: this.ensureNumber(raw.neighborhood_id),

      // Crédito
      credit_line_id: this.ensureNumber(raw.credit_line_id),
      quota_value: this.toNumber(raw.quota_value),
      period_id: this.ensureNumber(raw.period_id),
      period_quantity: this.ensureNumber(raw.period_quantity),
      tax_type_id: this.ensureNumber(this.selectedCreditLine?.taxType),
      tax_value: tasa,
      total_intention_value: this.toNumber(raw.total_intention_value),
      item_value: capitalValue,
      start_date: raw.start_date,
      initial_value_payment: this.toNumber(raw.initial_quota),
      total_financed_value: this.toNumber(raw.value_to_financiate),


      inicio_quincena: this.form.get('inicio_quincena')?.value,
      fin_quincena: this.form.get('fin_quincena')?.value,
      tipo_calculo: this.selectedCreditLine?.taxType === 3
        ? 'CALCULAR_TASA'
        : 'CALCULAR_CUOTA',

      //desembolso_value: this.toNumber(raw.desembolso_value),
      //cargos: this.toNumber(raw.cargos)
    };

    let files: File[] | undefined;
    let metadata: DocumentMetadata[] | undefined;

    if (this.requiresDocumentation()) {
      const cedulaData = this.getCedulaFilesForUpload();
      files = cedulaData.files;
      metadata = cedulaData.metadata;
    }
    const dialogRef = this.dialog.open(LoadingComponent, {
      disableClose: true,
    });


    try {
      const response = await firstValueFrom(
        this.creditIntentionService.createCreditIntentionWithDocuments(
          payloadIntencion,
          files,
          metadata
        )
      );

      dialogRef.close();

      console.log('Intención creada:', response);

      Swal.fire({
        title: '¡Éxito!',
        text: this.requiresDocumentation()
          ? 'La intención de crédito y los documentos se han guardado correctamente.'
          : 'La intención de crédito se ha guardado correctamente.',
        icon: 'success',
        buttonsStyling: false,
        confirmButtonText: 'Aceptar',
        customClass: {
          confirmButton: 'btn btn-success'
        }
      }).then(() => {
        this.resetForm();
      });

    } catch (err: any) {
      dialogRef.close();

      Swal.fire({
        title: 'Error',
        text: err.error?.detail || err.error?.message || 'No se pudo guardar la intención de crédito.',
        icon: 'error',
        buttonsStyling: false,
        confirmButtonText: 'Entendido',
        customClass: {
          confirmButton: 'btn btn-danger'
        }
      });
    }
  }

  private resetForm(): void {
    this.simulationCompleted = false;
    this.simulationResult = null;
    this.errorMessage = '';
    this.submitted = false;
    this.documentFiles.clear();

    this.form.reset();
    this.stepper.reset();

    this.departamentos = [];
    this.municipios = [];
    this.barrios = [];

    this.selectedCreditLine = null;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }


  onCreditLineChange(): void {
    const id = this.form.get('credit_line_id')?.value;
    const selected = this.creditLines.find(c => c.id === Number(id));

    if (!selected) {
      this.selectedCreditLine = null;
      return;
    }

    this.selectedCreditLine = selected;
    const hasDisbursement = selected.loanDisbursement;
    this.updateValidatorsByLoanDisbursement(hasDisbursement);


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

    if (hasDisbursement) {
      // Habilitar campos del GRUPO 2
      desembolsoCtrl?.enable({ emitEvent: false });
      quotaCtrl?.enable({ emitEvent: false });
      taxCtrl?.enable({ emitEvent: false });

      financiateCtrl?.setValidators([Validators.required]);
      financiateCtrl?.updateValueAndValidity({ emitEvent: false });

      initialQuotaCtrl?.setValidators([Validators.required]);
      initialQuotaCtrl?.updateValueAndValidity({ emitEvent: false });

      // Deshabilitar campos del GRUPO 1
      itemCtrl?.disable({ emitEvent: false });
      financiateCtrl?.disable({ emitEvent: false });
      initialQuotaCtrl?.disable({ emitEvent: false });

    } else {
      // Habilitar campos del GRUPO 1
      itemCtrl?.enable({ emitEvent: false });
      financiateCtrl?.enable({ emitEvent: false });
      initialQuotaCtrl?.enable({ emitEvent: false });
      quotaCtrl?.enable({ emitEvent: false });
      taxCtrl?.enable({ emitEvent: false });

      financiateCtrl?.clearValidators();
      financiateCtrl?.updateValueAndValidity({ emitEvent: false });

      initialQuotaCtrl?.clearValidators();
      initialQuotaCtrl?.updateValueAndValidity({ emitEvent: false });

      // Deshabilitar campos del GRUPO 2
      desembolsoCtrl?.disable({ emitEvent: false });
    }

    // Actualizar validaciones
    desembolsoCtrl?.updateValueAndValidity();
    itemCtrl?.updateValueAndValidity();
    financiateCtrl?.updateValueAndValidity();
    initialQuotaCtrl?.updateValueAndValidity();
    quotaCtrl?.updateValueAndValidity();
    taxCtrl?.updateValueAndValidity();

    // Limpiar documentos y resetear simulación
    this.documentFiles.clear();
    this.simulationCompleted = false;
    this.simulationResult = null;
    this.errorMessage = '';
  }


  requiresDocumentation(): boolean {
    return this.selectedCreditLine?.requireDocumentation ?? false;
  }



  getOnlyCedulaDocuments(): any[] {
    const docs = this.selectedCreditLine?.requiredDocuments ?? [];

    return docs.filter(doc => this.requiresTwoSides(doc.name));
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


  /**
  * Verificar si un documento requiere dos lados (frontal y trasero)
  */
  requiresTwoSides(documentName: string): boolean {
    const twoSidedDocuments = [
      'CÉDULA',
      'CEDULA',
      'CÉDULA DE CIUDADANÍA',
      'CEDULA DE CIUDADANIA',
      'DNI',
      'IDENTIFICACIÓN',
      'IDENTIFICACION'
    ];

    return twoSidedDocuments.some(doc =>
      documentName.toUpperCase().includes(doc)
    );
  }

  /**
   * Manejar cambios en los archivos de documentos
   */
  onDocumentFileChange(files: any[], documentId: number, side: string | null) {
    const key = `doc_${documentId}`;

    if (!this.documentFiles.has(key)) {
      this.documentFiles.set(key, {});
    }

    const docFiles = this.documentFiles.get(key)!;

    if (side === 'front') {
      docFiles.front = files;
    } else if (side === 'back') {
      docFiles.back = files;
    } else {
      docFiles.single = files;
    }

    console.log('Archivos de documentos actualizados:', this.documentFiles);
  }


  /**
   * Obtener todos los archivos para enviar al backend
   */
  // Método mejorado para preparar archivos
  // getDocumentFilesForUpload(): { files: File[], metadata: any[] } {
  //   const files: File[] = [];
  //   const metadata: any[] = [];
  //   let fileIndex = 0;

  //   this.documentFiles.forEach((docFiles, key) => {
  //     const documentId = parseInt(key.replace('doc_', ''));

  //     // Procesar lado frontal
  //     if (docFiles.front?.length) {
  //       files.push(docFiles.front[0]);
  //       metadata.push({
  //         documentationTypeId: documentId,
  //         documentSide: 'FRONT',
  //         fileIndex: fileIndex++
  //       });
  //     }

  //     // Procesar lado trasero
  //     if (docFiles.back?.length) {
  //       files.push(docFiles.back[0]);
  //       metadata.push({
  //         documentationTypeId: documentId,
  //         documentSide: 'BACK',
  //         fileIndex: fileIndex++
  //       });
  //     }

  //     // Procesar archivo único
  //     if (docFiles.single?.length) {
  //       files.push(docFiles.single[0]);
  //       metadata.push({
  //         documentationTypeId: documentId,
  //         documentSide: 'SINGLE',
  //         fileIndex: fileIndex++
  //       });
  //     }
  //   });

  //   return { files, metadata };
  // }

  validateCedulaOnly(): boolean {
    const cedulaDocs = this.getOnlyCedulaDocuments();

    for (const doc of cedulaDocs) {
      const key = `doc_${doc.id}`;
      const files = this.documentFiles.get(key);

      if (!files?.front?.length || !files?.back?.length) {
        this.errorMessage = `Debe cargar ambos lados de la ${doc.name}`;

        this.snackBar.open(
          `Debe cargar ambos lados de la ${doc.name}`,
          'Cerrar',
          {
            duration: 4000,
            panelClass: ['snackbar-error'],
          }
        );
        return false;
      }
    }

    return true;
  }


  getCedulaFilesForUpload(): { files: File[], metadata: DocumentMetadata[] } {
    const files: File[] = [];
    const metadata: DocumentMetadata[] = [];
    let fileIndex = 0;

    this.getOnlyCedulaDocuments().forEach(doc => {
      const key = `doc_${doc.id}`;
      const docFiles = this.documentFiles.get(key);

      if (docFiles?.front?.length) {
        files.push(docFiles.front[0]);
        metadata.push({
          documentationTypeId: doc.id,
          documentSide: 'FRONT',
          fileIndex: fileIndex++
        });
      }

      if (docFiles?.back?.length) {
        files.push(docFiles.back[0]);
        metadata.push({
          documentationTypeId: doc.id,
          documentSide: 'BACK',
          fileIndex: fileIndex++
        });
      }
    });

    return { files, metadata };
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


}