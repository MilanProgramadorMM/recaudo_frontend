import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NgStepperModule, NgStepperComponent } from 'angular-ng-stepper';
import { CdkStepperModule } from '@angular/cdk/stepper';
import Swal from 'sweetalert2';
import { PageTitleComponent } from '@components/page-title.component';
import { FileUploaderComponent, UploadedFile } from '@components/file-uploader.component';
import { ChangeClosingStatusDto, ClosingStatus, ClosingStatusService } from '@core/services/closingStatus.service';
import { AuthenticationService } from '@core/services/auth.service';
import { ApproveClosingDto, ClosingResponseDto, ClosingService } from '@core/services/closing.service';
import { ClosingSpendService } from '@core/services/closingSpend.service';
import { LoadingComponent } from '@views/ui/loading/loading.component';
import { Glotypes, GlotypesService } from '@core/services/glotypes.service';
import { CreditIntentionDetail, RecaudoDetail, RecaudoService } from '@core/services/recaudo.service';
import { CreditCausadoDetail, CreditService } from '@core/services/credit.service';

export enum UserRole {
  ASISTENTE = 'BACKOFFICE',
  ASESOR = 'Asesor',
  ADMIN = 'Administrador'
}

interface ClosingSpend {
  id?: number;
  spendTypeId: number;
  spendTypeName?: string;
  amount: number;
  description?: string;
  fileName?: string;
  status?: boolean;
}

@Component({
  selector: 'app-closing',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PageTitleComponent,
    NgStepperModule,
    CdkStepperModule,
    FileUploaderComponent
  ],
  templateUrl: './closing.component.html',
  styleUrl: './closing.component.scss'
})
export class ClosingComponent implements OnInit {
  @ViewChild('stepper') stepper!: NgStepperComponent;

  // Forms
  baseForm!: FormGroup;
  spendsForm!: FormGroup;
  ajustesForm!: FormGroup;
  approvalForm!: FormGroup;

  // State
  currentRole: string = '';
  closingId: number | null = null;
  personId: number | null = null;
  currentStatus: ClosingStatus = ClosingStatus.PRE_CIERRE;
  submitted = false;
  errorMessage = '';
  private loadingBase = false;

  isRefreshing = false;

  // Data
  spendGlotypes: Glotypes[] = [];
  recaudos: RecaudoDetail[] = [];
  spendsList: ClosingSpend[] = [];
  creditsCausados: CreditCausadoDetail[] = [];
  intentions: CreditIntentionDetail[] = [];

  baseSpendTypeId: number | null = null;
  previousBaseSpendTypeId: number | null = null;
  previousBaseValue: number = 0;
  currentZone?: number;
  hasBaseRegistered: boolean = false;


  // Files
  currentSpendFile: UploadedFile | null = null;

  // Computed
  isAsistente = false;
  isAsesor = false;
  isAdmin = false;

  // View control
  canEditBase = false;
  canAddSpends = false;
  canApprove = false;
  isReadOnly = false;
  canEditSpends = false;
  uploaderKey = 0;
  editingSpend: ClosingSpend | null = null;
  isEditMode = false;

  closingData: ClosingResponseDto | null = null;

  get availableSpendTypes(): Glotypes[] {
    if (!this.spendGlotypes || this.spendGlotypes.length === 0) {
      return [];
    }

    // Siempre filtrar BASE de las opciones disponibles
    return this.spendGlotypes.filter(type => type.description == 'DECREMENT');
  }

  get availableIncrementTypes(): Glotypes[] {
    if (!this.spendGlotypes || this.spendGlotypes.length === 0) {
      return [];
    }
    // Siempre filtrar BASE de las opciones disponibles
    return this.spendGlotypes.filter(type => type.description == 'INCREMENT' && type.code == 'AJUSTE BASE');
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private closingService: ClosingService,
    private closingSpendService: ClosingSpendService,
    private closingStatusService: ClosingStatusService,
    private recaudoService: RecaudoService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private glotypesService: GlotypesService,
    private creditService: CreditService
  ) { }

  ngOnInit(): void {
    this.initializeForms();
    this.loadUserRole();
    this.loadClosingId();

    if (this.closingId) {
      this.loadClosingData();
    } else {
      this.updatePermissions();
    }
  }

  initializeForms(): void {
    this.baseForm = this.fb.group({
      base: ['', [Validators.required, Validators.min(0)]],
      observation: ['']
    });

    this.spendsForm = this.fb.group({
      spendTypeId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      description: ['']
    });

    this.ajustesForm = this.fb.group({
      spendTypeId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      description: ['']
    });

    this.approvalForm = this.fb.group({
      deliveryType: ['', Validators.required],
      adminAmount: [''],
      asesorAmount: ['']
    });
  }

  loadUserRole(): void {
    this.currentRole = this.authService.getUserRole() || '';
    this.isAsistente = this.currentRole === UserRole.ASISTENTE;
    this.isAsesor = this.currentRole === UserRole.ASESOR;
    this.isAdmin = this.currentRole === UserRole.ADMIN;
  }

  loadClosingId(): void {
    this.route.params.subscribe(params => {
      this.closingId = params['id'] ? +params['id'] : null;
      this.loadRecaudosByUser();
    });
  }

  getTotalRecaudos(): number {
    return this.recaudos.reduce(
      (total, r) => total + Math.abs(r.valuePaid),
      0
    );
  }

  loadRecaudosByUser() {
    if (!this.currentZone) return;

    const date = this.closingData?.closingDate ?? new Date().toLocaleDateString('en-CA');
    this.recaudoService
      .getRecaudosByUserAndDate(this.closingId!, date, this.currentZone)
      .subscribe({
        next: data => this.recaudos = data,
        error: () => this.recaudos = []
      });

    this.recaudoService
      .getIntentionsByUserAndDate(this.closingId!, date, this.currentZone)
      .subscribe({
        next: data => this.intentions = data,
        error: () => this.intentions = []
      });
  }

  loadSpendTypes(): void {
    if (this.spendGlotypes.length > 0) {
      this.loadingBase = false;
      return;
    }

    this.glotypesService.getGlotypesByKey('TIPGAS').subscribe({
      next: (data) => {
        this.spendGlotypes = data;
        const baseType = this.spendGlotypes.find(g => g.name === 'BASE');
        if (baseType) {
          this.baseSpendTypeId = baseType.id;
        }
        const previousBaseSpendType = this.spendGlotypes.find(g => g.code === 'BASE ANTERIOR');
        if(previousBaseSpendType) {
          this.previousBaseSpendTypeId = previousBaseSpendType.id;
        }
        this.loadingBase = false;
      },
      error: (err) => {
        this.loadingBase = false;
      }
    });
  }

  loadClosingData(): void {
    if (!this.closingId) return;

    const dialogRef = this.dialog.open(LoadingComponent, {
      disableClose: true
    });

    this.closingService.getById(this.closingId).subscribe({
      next: (response) => {
        const closingData = response.data;
        this.closingData = response.data;
        this.personId = closingData.personId || null;

        if (this.isAsesor && this.spendGlotypes.length === 0) {
          this.glotypesService.getGlotypesByKey('TIPGAS').subscribe({
            next: (data) => {
              this.spendGlotypes = data;
              const baseType = this.spendGlotypes.find(g => g.name === 'BASE');
              if (baseType) {
                this.baseSpendTypeId = baseType.id;
              }
              const previousBaseSpendType = this.spendGlotypes.find(g => g.code === 'BASE ANTERIOR');
              if(previousBaseSpendType) {
                this.previousBaseSpendTypeId = previousBaseSpendType.id;
              }

              this.loadCurrentStatus();
              this.loadSpendsList();
              dialogRef.close();
            },
            error: (err) => {
              dialogRef.close();
              console.error('Error cargando tipos de gasto:', err);
            }
          });
        } else {
          // Para admin/asistente
          this.loadCurrentStatus();
          this.loadSpendsList();
          dialogRef.close();
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al cargar datos del cierre';
        dialogRef.close();
      }
    });
  }

  loadCurrentStatus(): void {
    if (!this.closingId) return;
    this.closingStatusService.getCurrentStatus(this.closingId).subscribe({
      next: (response) => {
        this.currentStatus = response.data?.code || ClosingStatus.PRE_CIERRE;
        this.currentZone = response.data?.zone;
        this.updatePermissions();
        this.updateStepperPosition();
        this.loadRecaudosByUser(); // Cargar recaudos después de tener la zona
        this.loadCreditsCausados();
      },
      error: (err) => {
        this.currentStatus = ClosingStatus.PRE_CIERRE;
        this.currentZone = undefined;
        this.updatePermissions();
        this.updateStepperPosition();
      }
    });
  }

  loadSpendsList(): void {
    if (!this.closingId) return;

    this.closingSpendService.getSpendsByClosingId(this.closingId).subscribe({
      next: (response) => {
        if (this.spendGlotypes.length === 0) {
          this.loadSpendTypesForDisplay(() => {
            this.processSpendsList(response.data);
          });
        } else {
          this.processSpendsList(response.data);
        }
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar la lista de gastos';
      }
    });
  }

  loadSpendTypesForDisplay(callback?: () => void): void {
    this.glotypesService.getGlotypesByKey('TIPGAS').subscribe({
      next: (data) => {
        this.spendGlotypes = data;
        const baseType = this.spendGlotypes.find(g => g.code === 'BASE');
        const previousBaseSpendType = this.spendGlotypes.find(g => g.code === 'BASE ANTERIOR');
        if (baseType) {
          this.baseSpendTypeId = baseType.id;
        }
        if(previousBaseSpendType) {
          this.previousBaseSpendTypeId = previousBaseSpendType.id;
        }
        if (callback) callback();
      },
      error: (err) => {
        if (callback) callback();
      }
    });
  }

  processSpendsList(data: any[]): void {
    const baseSpend = data.find(
      s => s.spendTypeId === this.baseSpendTypeId && s.status !== false
    );

    this.hasBaseRegistered = !!baseSpend;    

    this.spendsList = data
      .map(spend => ({
        id: spend.id,
        spendTypeId: spend.spendTypeId,
        spendTypeName: this.getSpendTypeName(spend.spendTypeId),
        amount: spend.amount,
        description: spend.description || '',
        fileName: spend.fileName,
        status: spend.status
      }))
      .filter(spend => spend.spendTypeId !== this.baseSpendTypeId && spend.spendTypeId !== this.previousBaseSpendTypeId);

    this.previousBaseValue = data.find(spend => spend.spendTypeId == this.previousBaseSpendTypeId)?.amount || 0;

    if (baseSpend) {
      this.canEditBase = false;
      this.baseForm.patchValue({
        base: baseSpend.amount,
        observation: baseSpend.description
      }, { emitEvent: false });
      this.baseForm.get('base')?.disable({ emitEvent: false });

      if (this.isAsesor && this.currentStatus === ClosingStatus.PRE_CIERRE) {
        this.canAddSpends = true;

        if (this.spendGlotypes.length === 0) {
          this.loadingBase = true;
          this.loadSpendTypes();
        }

        setTimeout(() => {
          this.spendsForm.enable();
        }, 100);
      }
    } else {
      this.canEditBase = true;
      this.canAddSpends = false;
      this.baseForm.get('base')?.enable({ emitEvent: false });
    }

    this.updatePermissions();
  }

  get visibleSpendsList() {    
    return this.spendsList.filter(
      s => s.amount < 0
    );
  }

  get visibleAjustesList() {
    return this.spendsList.filter(
      s => s.amount >= 0
    );
  }

  getSpendTypeName(spendTypeId: number): string {
    const type = this.spendGlotypes.find(t => t.id === spendTypeId);
    return type ? type.name : 'Desconocido';
  }

  updatePermissions(): void {
    this.canEditBase = false;
    this.canAddSpends = false;
    this.canApprove = false;
    this.canEditSpends = false;
    this.isReadOnly = false;

    const estado = this.currentStatus || ClosingStatus.PRE_CIERRE;

    switch (estado) {
      case ClosingStatus.PRE_CIERRE:
        // Admin/Asistente puede editar la base si aún no existe
        this.canEditBase = (this.isAsistente || this.isAdmin) && !this.hasBase();

        if (this.isAsesor) {
          if (this.hasBase()) {
            this.canAddSpends = true;

            // Cargar tipos de gasto si no están cargados
            if (this.spendGlotypes.length === 0 && !this.loadingBase) {
              this.loadingBase = true;
              this.loadSpendTypes();
            }

            this.spendsForm.enable();
          } else {
            this.canAddSpends = false;
            this.spendsForm.disable();
          }
        }

        this.isReadOnly = false;
        break;

      case ClosingStatus.STUDY:
        this.isReadOnly = true;
        this.canApprove = this.isAsistente || this.isAdmin;
        this.canEditBase = false;
        this.canAddSpends = false;
        this.spendsForm.disable();
        break;

      case ClosingStatus.PRE_APPROVED:
        this.isReadOnly = false;
        this.canApprove = this.isAdmin;
        this.canEditBase = false;
        this.canAddSpends = false;
        this.canEditSpends = this.isAdmin;

        if (this.isAdmin && this.canEditSpends) {
          this.spendsForm.enable();
        } else {
          this.spendsForm.disable();
        }
        break;

      case ClosingStatus.APPROVED:
        this.isReadOnly = true;
        this.canApprove = false;
        this.canEditBase = false;
        this.canAddSpends = false;
        this.spendsForm.disable();
        break;

      case ClosingStatus.REJECTED:
        this.isReadOnly = true;
        this.canApprove = false;
        this.canEditBase = false;
        this.canAddSpends = false;
        this.spendsForm.disable();
        break;
    }

    //MANEJO FINAL DEL ESTADO DE LOS FORMULARIOS
    if (this.isReadOnly || !this.canEditBase) {
      this.baseForm.disable();
    } else {
      this.baseForm.enable();
    }
  }

  hasFinishedSpends(): boolean {
    return this.currentStatus !== ClosingStatus.PRE_CIERRE;
  }

  updateStepperPosition(): void {
    setTimeout(() => {
      if (!this.stepper) return;

      // Para ASESOR en PRE_CIERRE con BASE: ir directamente al paso de gastos 
      // El paso 0 es la BASE (solo para admin/asistente)
      if (this.currentStatus === ClosingStatus.PRE_CIERRE && this.hasBase()) {
        this.stepper.selectedIndex = 1;
        return;
      }

      switch (this.currentStatus) {
        case ClosingStatus.PRE_CIERRE:
          if (this.isAsesor && !this.hasBase()) {
            // Asesor sin base: mostrar mensaje de espera
            this.stepper.selectedIndex = 0;
          } else if (this.isAsesor && this.hasBase()) {
            // Asesor con base: ir a gastos
            this.stepper.selectedIndex = 1;
          }
          break;
        case ClosingStatus.STUDY:
          if (!this.isAsesor) {
            this.stepper.selectedIndex = 1;
          }
          break;
        case ClosingStatus.PRE_APPROVED:
        case ClosingStatus.APPROVED:
        case ClosingStatus.REJECTED:
          // Todos los roles → Paso de revisión (índice 2)
          this.stepper.selectedIndex = 2;
          console.log(`Estado ${this.currentStatus} → Revisión (índice 2)`);
          break;
      }
    }, 1400);
  }

  // ================ CONSULTA MANUAL DE ESTADO (MEJORADA) ================
  consultarEstado(): void {
    if (!this.closingId) return;

    this.isRefreshing = true;

    // Cargar estado actual
    this.closingStatusService.getCurrentStatus(this.closingId).subscribe({
      next: (response) => {
        const newStatus = response.data?.code || ClosingStatus.PRE_CIERRE;
        const statusChanged = newStatus !== this.currentStatus;
        this.currentStatus = newStatus;

        this.closingSpendService.getSpendsByClosingId(this.closingId!).subscribe({
          next: (gastos) => {
            this.processSpendsList(gastos.data);
            this.updatePermissions();
            this.updateStepperPosition();
            this.isRefreshing = false;

            // Mostrar notificación apropiada
            if (statusChanged) {
              this.showStatusChangeNotification(newStatus);
            } else {
              if (this.isAsesor && this.hasBase() && this.canAddSpends) {
                Swal.fire({
                  toast: true,
                  position: 'top-end',
                  icon: 'success',
                  title: '¡BASE registrada! Ya puedes agregar gastos',
                  showConfirmButton: false,
                  timer: 3000,
                  timerProgressBar: true
                });
              } else {
                this.showNoChangeNotification(newStatus);
              }
            }
          },
          error: () => {
            this.isRefreshing = false;
            this.showErrorNotification();
          }
        });
      },
      error: () => {
        this.isRefreshing = false;
        this.showErrorNotification();
      }
    });
  }

  showStatusChangeNotification(newStatus: ClosingStatus): void {
    let icon: 'success' | 'info' | 'warning' | 'error' = 'info';
    let title = '';
    let text = '';

    switch (newStatus) {
      case ClosingStatus.STUDY:
        icon = 'info';
        title = '¡Estado Actualizado!';
        text = 'Tu cierre ha pasado a revisión inicial';
        break;

      case ClosingStatus.PRE_APPROVED:
        icon = 'info';
        title = '¡Avance en tu Cierre!';
        text = 'Tu cierre pasó la revisión inicial y está en aprobación final';
        break;

      case ClosingStatus.APPROVED:
        icon = 'success';
        title = '¡Felicidades!';
        text = 'Tu cierre ha sido aprobado definitivamente';
        break;

      case ClosingStatus.REJECTED:
        icon = 'error';
        title = 'Cierre Rechazado';
        text = 'Tu cierre ha sido rechazado. Por favor revisa los detalles';
        break;

      default:
        icon = 'info';
        title = 'Estado Actualizado';
        text = `Tu cierre ahora está en: ${this.getStatusText()}`;
    }

    Swal.fire({
      icon,
      title,
      text,
      confirmButtonText: 'Entendido',
      customClass: { confirmButton: 'btn btn-primary' }
    });
  }

  showNoChangeNotification(status: ClosingStatus): void {
    let message = '';

    switch (status) {
      case ClosingStatus.STUDY:
        message = 'Tu cierre sigue en revisión inicial';
        break;
      case ClosingStatus.PRE_APPROVED:
        message = 'Tu cierre sigue en aprobación final';
        break;
      case ClosingStatus.APPROVED:
        message = 'Tu cierre ya está aprobado';
        break;
      case ClosingStatus.REJECTED:
        message = 'Tu cierre fue rechazado';
        break;
      default:
        message = 'No hay cambios en el estado';
    }

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
  }

  showErrorNotification(): void {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'Error al consultar estado',
      showConfirmButton: false,
      timer: 3000
    });
  }

  hasBase(): boolean {
    return this.hasBaseRegistered;
  }

  canFinishSpends(): boolean {
    const nonBaseSpends = this.spendsList.filter(s =>
      s.spendTypeId !== this.baseSpendTypeId &&
      s.status !== false  // ← verifica que esto llegue bien del backend
    );
    return nonBaseSpends.length >= 1;
  }
  // ================ PASO 1: BASE ================
  saveBase(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.baseForm.invalid) {
      this.errorMessage = 'Complete el valor de la base';
      return;
    }

    if (!this.closingId) {
      this.errorMessage = 'No se ha iniciado el cierre correctamente';
      return;
    }

    if (!this.baseSpendTypeId) {
      this.glotypesService.getGlotypesByKey('TIPGAS').subscribe({
        next: (data) => {
          this.spendGlotypes = data;
          const baseType = this.spendGlotypes.find(g => g.name === 'BASE');
          if (baseType) {
            this.baseSpendTypeId = baseType.id;
            this.executeSaveBase();
          } else {
            this.errorMessage = 'No se encontró el registro BASE';
          }
        },
        error: () => {
          this.errorMessage = 'Error al cargar tipos de gasto';
        }
      });
    } else {
      this.executeSaveBase();
    }
  }

  private executeSaveBase(): void {
    const baseValue = this.toNumber(this.baseForm.get('base')?.value);
    const observation = this.baseForm.get('observation')?.value || '';

    const dialogRef = this.dialog.open(LoadingComponent, {
      disableClose: true
    });

    this.closingSpendService.registerSpend(
      this.closingId!,
      this.baseSpendTypeId!,
      this.closingData?.zonaId!,
      baseValue,
      null,
      observation,
      true
    ).subscribe({
      next: () => {
        dialogRef.close();

        Swal.fire({
          icon: 'success',
          title: 'Base guardada',
          text: 'La base se ha registrado correctamente. El asesor ya puede registrar gastos.',
          confirmButtonText: 'Continuar',
          customClass: { confirmButton: 'btn btn-success' }
        }).then(() => {
          this.loadSpendsList();
          this.updatePermissions();
        });
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al guardar la base';
        dialogRef.close();

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: this.errorMessage
        });
      }
    });
  }

  addAjuste(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.ajustesForm.invalid) {
      this.errorMessage = 'Complete todos los campos obligatorios';
      return;
    }

    const spendTypeId = +this.ajustesForm.get('spendTypeId')?.value;
    const amount = this.toNumber(this.ajustesForm.get('amount')?.value);
    const description = this.ajustesForm.get('description')?.value || '';

    if (!this.closingId) {
      this.errorMessage = 'No se ha iniciado el cierre';
      return;
    }

    const dialogRef = this.dialog.open(LoadingComponent, {
      disableClose: true
    });

    this.closingSpendService.registerSpend(
      this.closingId,
      spendTypeId,
      this.closingData?.zonaId!,
      amount,
      this.currentSpendFile,
      description,
      true
    ).subscribe({
      next: () => {
        this.loadSpendsList();
        this.resetSpendsForm();
        dialogRef.close();

        Swal.fire({
          icon: 'success',
          title: 'Registro agregado',
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al guardar';
        dialogRef.close();

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: this.errorMessage
        });
      }
    });
  }

  // ================ PASO 2: GASTOS ================
  addSpend(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.spendsForm.invalid) {
      this.errorMessage = 'Complete todos los campos obligatorios';
      return;
    }

    const spendTypeId = +this.spendsForm.get('spendTypeId')?.value;
    const amount = this.toNumber(this.spendsForm.get('amount')?.value);
    const description = this.spendsForm.get('description')?.value || '';

    if (spendTypeId === this.baseSpendTypeId) {
      this.errorMessage = 'No puede agregar BASE como gasto. Use el paso anterior.';
      return;
    }

    if (!this.currentSpendFile) {
      this.errorMessage = 'La evidencia es obligatoria para este tipo de gasto';
      return;
    }

    if (!this.closingId) {
      this.errorMessage = 'No se ha iniciado el cierre';
      return;
    }

    const dialogRef = this.dialog.open(LoadingComponent, {
      disableClose: true
    });

    this.closingSpendService.registerSpend(
      this.closingId,
      spendTypeId,
      this.closingData?.zonaId!,
      amount,
      this.currentSpendFile,
      description,
      false
    ).subscribe({
      next: () => {
        this.loadSpendsList();
        this.resetSpendsForm();
        dialogRef.close();

        Swal.fire({
          icon: 'success',
          title: 'Registro agregado',
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al guardar';
        dialogRef.close();

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: this.errorMessage
        });
      }
    });
  }

  removeSpend(spend: ClosingSpend): void {
    if (spend.spendTypeId === this.baseSpendTypeId) {
      Swal.fire({
        icon: 'warning',
        title: 'No permitido',
        text: 'No puede eliminar la base desde aquí'
      });
      return;
    }

    Swal.fire({
      title: '¿Eliminar registro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-secondary'
      }
    }).then((result) => {
      if (result.isConfirmed && spend.id) {
        const dialogRef = this.dialog.open(LoadingComponent, {
          disableClose: true
        });

        this.closingSpendService.deactivateSpend(spend.id).subscribe({
          next: () => {
            this.loadSpendsList();
            dialogRef.close();

            Swal.fire({
              icon: 'success',
              title: 'Registro eliminado',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: () => {
            dialogRef.close();
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar el registro'
            });
          }
        });
      }
    });
  }

  finishSpends(): void {
    const nonBaseSpends = this.spendsList.filter(s =>
      s.spendTypeId !== this.baseSpendTypeId && s.status !== false
    );

    // if (nonBaseSpends.length < 1) {
    //   Swal.fire({
    //     icon: 'warning',
    //     title: 'Gastos insuficientes',
    //     text: 'Debe registrar al menos 1 gasto antes de finalizar el cierre',
    //     confirmButtonText: 'Entendido',
    //     customClass: { confirmButton: 'btn btn-warning' }
    //   });
    //   return;
    // }

    Swal.fire({
      title: '¿Finalizar registro de gastos?',
      html: `
        <p>Se han registrado <strong>${nonBaseSpends.length} gastos</strong></p>
        <p>El cierre pasará a fase de <strong class="text-info">ESTUDIO</strong></p>
        <p class="text-muted small">El asistente revisará los gastos registrados.</p>
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
        this.changeClosingStatus(ClosingStatus.STUDY);
      }
    });
  }

  approveClosing(): void {
    if (!this.canApprove) return;

    if (this.isSubtotalNegative()) {
      Swal.fire({
        icon: 'error',
        title: 'Saldo Negativo',
        html: `
        <p>No es posible aprobar un cierre con saldo negativo.</p>
        <p class="mb-0">Subtotal actual: <strong class="text-danger">$${this.formatCurrency(this.getSubtotal())}</strong></p>
      `,
        confirmButtonText: 'Entendido',
        customClass: { confirmButton: 'btn btn-danger' }
      });
      return;
    }

    let nextStatus: ClosingStatus;
    let title: string;
    let message: string;

    if (this.currentStatus === ClosingStatus.STUDY) {
      nextStatus = ClosingStatus.PRE_APPROVED;
      title = '¿Enviar a Aprobación?';
      message = 'El cierre pasará a fase de APROBACIÓN donde el administrador hará la revisión final.';
      this.confirmAndChangeStatus(nextStatus, title, message);

    } else if (this.currentStatus === ClosingStatus.PRE_APPROVED && this.isAdmin) {
      if (!this.validateApprovalForm()) {
        return;
      }

      const deliveryType = this.approvalForm.get('deliveryType')?.value;

      const adminAmount = this.toNumber(this.approvalForm.get('adminAmount')?.value);
      const asesorAmount = this.toNumber(this.approvalForm.get('asesorAmount')?.value);

      const approvalDto: ApproveClosingDto = {
        closingId: this.closingId!,
        deliveryType: deliveryType,
        amountAdmin: deliveryType === 'admin' || deliveryType === 'parcial' ? adminAmount : 0,
        amountAsesor: deliveryType === 'asesor' || deliveryType === 'parcial' ? asesorAmount : 0
      };

      title = '¿Aprobar Definitivamente?';
      message = this.buildApprovalMessage(deliveryType, adminAmount, asesorAmount);

      this.confirmAndApproveWithDelivery(approvalDto, title, message);

    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Acción no permitida',
        text: 'No tiene permisos para aprobar en este estado'
      });
    }
  }
  confirmAndApproveWithDelivery(dto: ApproveClosingDto, title: string, message: string): void {
    Swal.fire({
      title,
      html: `<p>${message}</p>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aprobar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-secondary'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.executeApprovalWithDelivery(dto);
      }
    });
  }

  executeApprovalWithDelivery(dto: ApproveClosingDto): void {
    const dialogRef = this.dialog.open(LoadingComponent, {
      disableClose: true
    });

    this.closingService.approveClosing(dto).subscribe({
      next: (response) => {
        this.closingData = response.data;
        dialogRef.close();

        Swal.fire({
          icon: 'success',
          title: '¡Cierre Aprobado!',
          html: `
          <p>El cierre ha sido aprobado definitivamente.</p>
          <div class="text-start mt-3">
            <strong>Distribución registrada:</strong><br>
            ${dto.deliveryType === 'admin' ?
              `• Admin: $${this.formatCurrency(dto.amountAdmin)}` :
              dto.deliveryType === 'asesor' ?
                `• Asesor: $${this.formatCurrency(dto.amountAsesor)}` :
                `• Admin: $${this.formatCurrency(dto.amountAdmin)}<br>• Asesor: $${this.formatCurrency(dto.amountAsesor)}`
            }
          </div>
        `,
          timer: 3000,
          showConfirmButton: true
        }).then(() => {
          this.cleanupAndRedirect();
        });
      },
      error: (err) => {
        dialogRef.close();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error?.message || 'Error al aprobar el cierre'
        });
      }
    });
  }

  buildApprovalMessage(deliveryType: string, adminAmount: number, asesorAmount: number): string {
    let message = 'Esta es la aprobación FINAL del cierre.<br><br>';
    message += '<strong>Distribución del subtotal:</strong><br>';

    if (deliveryType === 'admin') {
      message += `• Todo al Admin: $${this.formatCurrency(adminAmount)}`;
    } else if (deliveryType === 'asesor') {
      message += `• Todo al Asesor: $${this.formatCurrency(asesorAmount)}`;
    } else if (deliveryType === 'parcial') {
      message += `• Admin: $${this.formatCurrency(adminAmount)}<br>`;
      message += `• Asesor: $${this.formatCurrency(asesorAmount)}`;
    }

    return message;
  }

  validateApprovalForm(): boolean {
    const deliveryType = this.approvalForm.get('deliveryType')?.value;

    if (!deliveryType) {
      Swal.fire({
        icon: 'warning',
        title: 'Tipo de entrega requerido',
        text: 'Debe seleccionar cómo se entregará el subtotal'
      });
      return false;
    }

    // Para admin y asesor el valor ya se asignó automáticamente, solo validar parcial
    if (deliveryType === 'parcial') {
      const subtotal = this.getSubtotal();
      const adminAmount = this.toNumber(this.approvalForm.get('adminAmount')?.value);
      const asesorAmount = this.toNumber(this.approvalForm.get('asesorAmount')?.value);

      if ((adminAmount + asesorAmount) !== subtotal) {
        Swal.fire({
          icon: 'error',
          title: 'Suma incorrecta',
          html: `
          <p>La suma de Admin + Asesor debe ser igual al subtotal</p>
          <p><strong>Total a entregar:</strong> $${this.formatCurrency(subtotal)}</p>
        `
        });
        return false;
      }
    }

    return true;
  }

  getSumaParcial(): number {
    const admin = this.toNumber(this.approvalForm.get('adminAmount')?.value);
    const asesor = this.toNumber(this.approvalForm.get('asesorAmount')?.value);
    return admin + asesor;
  }

  get faltante(): number {
    return this.getSubtotal() - this.getSumaParcial();
  }

  get faltanteCorrecto(): boolean {
    return this.getSubtotal() === this.getSumaParcial();
  }

  confirmAndChangeStatus(newStatus: ClosingStatus, title: string, message: string): void {
    Swal.fire({
      title,
      html: `<p>${message}</p>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aprobar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-secondary'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.changeClosingStatus(newStatus);
      }
    });
  }

  rejectClosing(): void {
    Swal.fire({
      title: '¿Rechazar cierre?',
      input: 'textarea',
      inputLabel: 'Motivo del rechazo (obligatorio)',
      inputPlaceholder: 'Ingrese el motivo del rechazo...',
      showCancelButton: true,
      confirmButtonText: 'Rechazar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-secondary'
      },
      inputValidator: (value) => {
        if (!value) {
          return 'Debe ingresar un motivo de rechazo';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.changeClosingStatus(ClosingStatus.REJECTED);
      }
    });
  }

  changeClosingStatus(newStatus: ClosingStatus): void {
    if (!this.closingId) return;

    const dialogRef = this.dialog.open(LoadingComponent, {
      disableClose: true
    });

    const payload: ChangeClosingStatusDto = {
      closingId: this.closingId,
      newStatus,
    };

    this.closingStatusService.updateStatus(payload).subscribe({
      next: () => {
        this.currentStatus = newStatus;
        dialogRef.close();

        this.showStatusMessage(newStatus);

        if (newStatus === ClosingStatus.APPROVED || newStatus === ClosingStatus.REJECTED) {
          this.cleanupAndRedirect();
        } else {
          this.updatePermissions();
          this.updateStepperPosition();
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al actualizar estado';
        dialogRef.close();

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: this.errorMessage
        });
      }
    });
  }

  cleanupAndRedirect(): void {
    this.baseForm.reset();
    this.spendsForm.reset();
    this.approvalForm.reset();
    this.spendsList = [];
    this.recaudos = [];
    this.currentSpendFile = null;
    this.submitted = false;
    this.errorMessage = '';
    this.canEditBase = false;
    this.canAddSpends = false;
    this.canApprove = false;
    this.canEditSpends = false;
    this.isReadOnly = true;

    setTimeout(() => {
      this.router.navigate(['/master/asesores']);
    }, 2000);
  }

  showStatusMessage(status: ClosingStatus): void {
    let title = '';
    let text = '';
    let icon: 'success' | 'info' | 'error' = 'info';

    switch (status) {
      case ClosingStatus.STUDY:
        title = 'Enviado a Estudio';
        text = 'El cierre está pendiente de revisión inicial por el asistente';
        icon = 'info';
        break;

      case ClosingStatus.PRE_APPROVED:
        title = 'Enviado a Aprobación';
        text = 'El cierre ha pasado la revisión inicial y está pendiente de aprobación final del administrador';
        icon = 'info';
        break;

      case ClosingStatus.APPROVED:
        title = '¡Cierre Aprobado Definitivamente!';
        text = 'El cierre ha sido aprobado y finalizado exitosamente. Redirigiendo...';
        icon = 'success';
        break;

      case ClosingStatus.REJECTED:
        title = 'Cierre Rechazado';
        text = 'El cierre ha sido rechazado. Redirigiendo...';
        icon = 'error';
        break;
    }

    Swal.fire({
      icon,
      title,
      text,
      timer: status === ClosingStatus.APPROVED || status === ClosingStatus.REJECTED ? 2000 : undefined,
      showConfirmButton: status === ClosingStatus.APPROVED || status === ClosingStatus.REJECTED ? false : true,
      confirmButtonText: 'Entendido',
      customClass: { confirmButton: 'btn btn-primary' }
    });
  }

  // ================ UTILIDADES ================
  resetSpendsForm(): void {
    this.spendsForm.reset();
    this.currentSpendFile = null;
    this.submitted = false;
    this.uploaderKey++;
    this.isEditMode = false;
    this.editingSpend = null;
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.editingSpend = null;
    this.resetSpendsForm();
  }

  onSpendFileChange(files: any[]): void {
    this.currentSpendFile = files && files.length > 0 ? files[0] : null;
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }

  formatCurrencyString(form: FormGroup, controlName: string) {
    const control = form.get(controlName);
    if (!control) return;

    const rawValue = control.value;
    if (rawValue === null || rawValue === '') return;

    const numericValue = rawValue.toString().replace(/\D/g, '');

    if (numericValue === '') {
      control.setValue('', { emitEvent: false });
      return;
    }

    const formatted = Number(numericValue).toLocaleString('es-CO');
    control.setValue(formatted, { emitEvent: false });
  }

  toNumber(value: any): number {
    if (value === null || value === undefined || value === '') return 0;

    const numStr = value
      .toString()
      .replace(/\./g, '')
      .replace(/,/g, '')
      .replace(/[^\d-]/g, '');

    return Number(numStr) || 0;
  }

  getTotalSpends(): number {
    return this.spendsList
      .filter(s => s.amount < 0)
      .reduce((sum, spend) => sum + spend.amount, 0);
  }

  getTotalAjustes(): number {
    return this.spendsList
      .filter(s => s.amount >= 0)
      .reduce((sum, spend) => sum + spend.amount, 0);
  }

  calculateSubtotal(): number {
    return this.spendsList
      .filter(s => s.status !== false)
      .reduce((sum, spend) => sum + spend.amount, 0);
  }

  getDiferencia(): number {
    const base = this.toNumber(this.baseForm.get('base')?.value);
    const total = this.getTotalSpends();
    return base - total;
  }

  getStatusBadgeClass(): string {
    switch (this.currentStatus) {
      case ClosingStatus.PRE_CIERRE:
        return 'badge bg-warning';
      case ClosingStatus.STUDY:
        return 'badge bg-info';
      case ClosingStatus.PRE_APPROVED:
        return 'badge bg-primary';
      case ClosingStatus.APPROVED:
        return 'badge bg-success';
      case ClosingStatus.REJECTED:
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  getStatusText(): string {
    switch (this.currentStatus) {
      case ClosingStatus.PRE_CIERRE:
        return 'Pre-Cierre';
      case ClosingStatus.STUDY:
        return 'En Estudio';
      case ClosingStatus.PRE_APPROVED:
        return 'Pre-Aprobado';
      case ClosingStatus.APPROVED:
        return 'Aprobado';
      case ClosingStatus.REJECTED:
        return 'Rechazado';
      default:
        return '';
    }
  }

  cancel(): void {
    if (this.isAsesor) {
      this.router.navigate(['/operaciones/cierre']);
    } else {
      this.router.navigate(['/master/asesores']);
    }
  }

  getAbsValue(value: number): number {
    return Math.abs(value);
  }

  getSubtotal(): number {
    const base = this.toNumber(this.baseForm.get('base')?.value) + this.previousBaseValue;
    const recaudos = this.getTotalRecaudos();
    const gastos = this.getTotalSpends();
    const ajustes = this.getTotalAjustes();
    const creditos = this.getTotalCreditsCausados();
    return (base + recaudos + ajustes) + gastos - creditos;
  }

  addSpendInPreApproval(): void {
    debugger;
    this.submitted = true;
    this.errorMessage = '';

    if (this.spendsForm.invalid) {
      this.errorMessage = 'Complete todos los campos obligatorios';
      return;
    }

    const spendTypeId = +this.spendsForm.get('spendTypeId')?.value;
    const amount = this.toNumber(this.spendsForm.get('amount')?.value);
    const description = this.spendsForm.get('description')?.value || '';

    if (spendTypeId === this.baseSpendTypeId) {
      this.errorMessage = 'No puede agregar BASE como gasto';
      return;
    }

    if (!this.closingId) {
      this.errorMessage = 'No se ha iniciado el cierre';
      return;
    }

    if (!this.isEditMode) {
      if (!this.currentSpendFile) {
        this.errorMessage = 'La evidencia es obligatoria';
        return;
      }
    }

    const dialogRef = this.dialog.open(LoadingComponent, {
      disableClose: true
    });

    if (this.isEditMode && this.editingSpend?.id) {
      this.closingSpendService.updateSpend(
        this.editingSpend.id,
        spendTypeId,
        amount,
        this.currentSpendFile,
        description
      ).subscribe({
        next: () => {
          this.loadSpendsList();
          this.cancelEdit();
          dialogRef.close();

          Swal.fire({
            icon: 'success',
            title: 'Registro actualizado',
            text: 'El registro se ha actualizado correctamente',
            timer: 2000,
            showConfirmButton: false
          });
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Error al actualizar el registro';
          dialogRef.close();

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: this.errorMessage
          });
        }
      });
    } else {
      this.closingSpendService.registerSpend(
        this.closingId,
        spendTypeId,
        this.closingData?.zonaId!,
        amount,
        this.currentSpendFile!,
        description,
        false
      ).subscribe({
        next: () => {
          this.loadSpendsList();
          this.resetSpendsForm();
          dialogRef.close();

          Swal.fire({
            icon: 'success',
            title: 'Registro agregado',
            text: 'El subtotal se actualizará automáticamente',
            timer: 2000,
            showConfirmButton: false
          });
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Error al guardar';
          dialogRef.close();

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: this.errorMessage
          });
        }
      });
    }
  }

  editSpend(spend: ClosingSpend): void {
    if (spend.spendTypeId === this.baseSpendTypeId) {
      Swal.fire({
        icon: 'warning',
        title: 'No permitido',
        text: 'No puede editar la base desde aquí'
      });
      return;
    }

    this.isEditMode = true;
    this.editingSpend = spend;

    this.spendsForm.patchValue({
      spendTypeId: spend.spendTypeId,
      amount: spend.amount,
      description: spend.description || ''
    });

    this.currentSpendFile = null;

    setTimeout(() => {
      const formElement = document.querySelector('fieldset legend');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  getDeliveryTypeLabel(type: string | null | undefined): string {
    switch (type) {
      case 'admin': return 'Todo al Admin';
      case 'asesor': return 'Todo al Asesor';
      case 'parcial': return 'Entrega Parcial';
      default: return 'No definido';
    }
  }

  isSubtotalValid(): boolean {
    return this.getSubtotal() >= 0;
  }

  isSubtotalNegative(): boolean {
    return this.getSubtotal() < 0;
  }

  getTotalIntentions(): number {
    return this.intentions.reduce(
      (total, i) => total + i.totalIntentionValue,
      0
    );
  }

  downloadEvidence(spend: ClosingSpend): void {
    if (!spend.id) return;

    this.closingSpendService.downloadEvidence(spend.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = spend.fileName || 'evidencia';
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo descargar la evidencia'
        });
      }
    });
  }

  loadCreditsCausados(): void {
    if (!this.closingId) return;

    this.creditService.getCreditsCausadosByClosing(this.closingId).subscribe({
      next: (response) => {
        this.creditsCausados = response.data ?? [];
      },
      error: () => {
        this.creditsCausados = [];
      }
    });
  }

  getTotalCreditsCausados(): number {
    return this.creditsCausados.reduce((sum, c) => sum + c.totalCapitalValue, 0);
  }

  formatDateTime(dateStr: string): string {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  deliveryTotal(): void {
    const deliveryType = this.approvalForm.get('deliveryType')?.value;
    const subtotal = this.getSubtotal();

    if (deliveryType === 'admin') {
      this.approvalForm.patchValue({
        adminAmount: subtotal,
        asesorAmount: 0
      }, { emitEvent: false });
    } else if (deliveryType === 'asesor') {
      this.approvalForm.patchValue({
        adminAmount: 0,
        asesorAmount: subtotal
      }, { emitEvent: false });
    } else if (deliveryType === 'parcial') {
      // Limpiar para que el usuario ingrese manualmente
      this.approvalForm.patchValue({
        adminAmount: '',
        asesorAmount: ''
      }, { emitEvent: false });
    }
  }
}