import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbPaginationModule, NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CreditIntentionResponseDto, CreditIntentionService } from '@core/services/creditIntention.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkStep, CdkStepper, CdkStepperModule } from '@angular/cdk/stepper';
import { StadyComponent } from './stady/stady.component';
import { NgStepperComponent, NgStepperModule } from 'angular-ng-stepper';
import { ApproveComponent } from './approve/approve.component';
import { ImprovementComponent } from './improvement/improvement.component';
import { DisbursementComponent } from './disbursement/disbursement.component';

@Component({
  selector: 'app-managment-credit-intention',
  imports: [
    NgbPaginationModule,
    NgbModalModule,
    CommonModule,
    FormsModule,
    CdkStepperModule,
    StadyComponent,
    ApproveComponent,
    ImprovementComponent,
    DisbursementComponent,
    NgStepperModule,
    NgbTooltipModule
  ],
  templateUrl: './managment-credit-intention.component.html',
  styleUrls: ['./managment-credit-intention.component.scss']
})
export class ManagmentCreditIntentionComponent implements OnInit, AfterViewInit {

  @ViewChild('stepper') stepper!: NgStepperComponent
  @ViewChild('cdkSteppers') cdkSteppers!: CdkStepper
  @ViewChildren(CdkStep) steps!: QueryList<CdkStep>;
  @ViewChild(StadyComponent) stadyComponent!: StadyComponent;
  @ViewChild(ApproveComponent) approveComponent!: ApproveComponent;
  @ViewChild(ImprovementComponent) improvementComponent!: ImprovementComponent;
  @ViewChild(DisbursementComponent) disbursementComponent!: DisbursementComponent;

  creditIntentionId!: number;
  creditIntention!: CreditIntentionResponseDto;
  loading = true;
  errorMessage = '';
  readyStudy: boolean = false;
  readyApprove: boolean = false;

  // Variables para controlar completitud de fases
  estudyPhaseCompleted = false;
  aprobacionPhaseCompleted = false;
  improvementComponentPhaseCompleted = false;
  disbursementComponentPhaseCompleted = false;


  // Variable para saber si ya se navegó al paso inicial
  private initialStepSet = false;

  constructor(
    private route: ActivatedRoute,
    private service: CreditIntentionService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private creditIntentionService: CreditIntentionService

  ) { }

  ngOnInit(): void {
    this.creditIntentionId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.loadCreditIntention();
  }

  ngAfterViewInit(): void {
    // Navegación inicial después de que la vista esté lista
    if (this.creditIntention && this.stepper && !this.initialStepSet) {
      this.navigateToInitialStep();
    }
  }

  loadCreditIntention() {
    this.service.getIntentionsById(this.creditIntentionId).subscribe({
      next: (resp) => {
        if (resp && resp.data) {
          this.creditIntention = resp.data[0];

          // Navegar al paso correcto después de cargar los datos
          setTimeout(() => {
            if (this.stepper && !this.initialStepSet) {
              this.navigateToInitialStep();
            }
          }, 200); // Incrementamos el delay para asegurar que el stepper esté completamente inicializado
        } else {
          this.errorMessage = 'No se encontró la intención de crédito';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar crédito:', err);
        this.errorMessage = 'Error al cargar la información del crédito';
        this.loading = false;
      }
    });
  }

  onFechaTentativaUpdated(nuevaFecha: string): void {
    // Actualiza el objeto creditIntention en memoria
    this.creditIntention.fechaInicio = nuevaFecha;
    this.cdr.detectChanges();
  }

  private reloadCreditIntention(): void {
    // Recarga el credit completo desde BD
    this.service.getIntentionsById(this.creditIntentionId).subscribe({
      next: (resp) => {
        if (resp && resp.data) {
          this.creditIntention = resp.data[0];

          // Navegar al paso correcto después de cargar los datos
          setTimeout(() => {
            if (this.stepper && !this.initialStepSet) {
              this.navigateToInitialStep();
            }
          }, 200); // Incrementamos el delay para asegurar que el stepper esté completamente inicializado
        } else {
          this.errorMessage = 'No se encontró la intención de crédito';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar crédito:', err);
        this.errorMessage = 'Error al cargar la información del crédito';
        this.loading = false;
      }
    });
  }

  /**
   * Navega al paso inicial del wizard según el estado actual del crédito
   */
  private navigateToInitialStep(): void {
    if (!this.creditIntention || !this.stepper || this.initialStepSet) {
      console.warn('No se puede navegar:', {
        creditIntention: !!this.creditIntention,
        stepper: !!this.stepper,
        initialStepSet: this.initialStepSet
      });
      return;
    }

    const estado = this.creditIntention.estadoActual?.toUpperCase() || 'STUDY';
    console.log('=== NAVEGACIÓN INICIAL ===');
    console.log('Estado:', estado);
    console.log('Steps disponibles:', this.steps?.length);

    let targetStep = 0;

    switch (estado) {
      case 'STUDY':
        targetStep = 0;
        break;

      case 'APPROVED':
        targetStep = 1;
        this.estudyPhaseCompleted = true;
        break;

      case 'IMPROVEMENT':
        targetStep = 2;
        this.estudyPhaseCompleted = true;
        this.aprobacionPhaseCompleted = true;
        break;

      case 'DISBURSEMENT':
        targetStep = 3;
        this.estudyPhaseCompleted = true;
        this.aprobacionPhaseCompleted = true;
        this.improvementComponentPhaseCompleted = true;
        break;

      default:
        targetStep = 0;
        if (this.creditIntention.estadoActual === null || this.creditIntention.estadoActual === undefined) {
          console.log('Estado no definido. Iniciando en fase de Estudio (nuevo crédito).');
        } else {
          console.warn(`Estado desconocido: ${this.creditIntention.estadoActual}. Iniciando en fase de Estudio.`);
        }
    }

    // Marcar steps previos como completados usando ViewChildren
    if (targetStep > 0 && this.steps && this.steps.length > 0) {
      const stepsArray = this.steps.toArray();
      console.log('Steps obtenidos con ViewChildren:', stepsArray.length);

      // Marcar como completados los pasos anteriores al target
      for (let i = 0; i < targetStep && i < stepsArray.length; i++) {
        stepsArray[i].completed = true;
        console.log(`✓ Paso ${i} marcado como completado`);
      }

      // Forzar detección de cambios
      this.cdr.detectChanges();

      // Navegar al paso target
      this.stepper.selectedIndex = targetStep;
      this.cdr.detectChanges();

      console.log('Índice después de navegación:', this.stepper.selectedIndex);
    }

    console.log('Paso final:', this.stepper.selectedIndex);
    console.log('======================');

    this.initialStepSet = true;
  }

  onEstudyPhaseCompleted(completed: boolean): void {
    this.estudyPhaseCompleted = completed;
    console.log('Fase de Estudio completada:', completed);

    if (completed) {
      this.reloadCreditIntention();
      setTimeout(() => {
        this.goToNextPhase();
      }, 500);
    }
  }

  onAprobacionPhaseCompleted(completed: boolean): void {
    this.aprobacionPhaseCompleted = completed;
    console.log('Fase de Aprobación completada:', completed);

    if (completed) {
      this.reloadCreditIntention();
      setTimeout(() => {
        if (this.stepper.selectedIndex < this.stepper.steps.length - 1) {
          this.stepper.next();
        }
      }, 500);
    }
  }


  onPerfeccionamientoPhaseCompleted(completed: boolean): void {
    this.improvementComponentPhaseCompleted = completed;
    console.log('Fase de Perfeccionamiento completada:', completed);

    if (completed) {
      this.reloadCreditIntention();
      setTimeout(() => {
        if (this.stepper.selectedIndex < this.stepper.steps.length - 1) {
          this.stepper.next();
        }
      }, 500);
    }
  }

  onDesembolsoPhaseCompleted(completed: boolean): void {
    this.disbursementComponentPhaseCompleted = completed;
    console.log('Fase de Desembolso completada:', completed);

    if (completed) {
      // Aquí podrías redirigir a otra página o mostrar mensaje de finalización
      console.log('¡Proceso de crédito completado!');
    }
  }

  goToNextPhase(): void {
    if (this.estudyPhaseCompleted) {
      this.stepper.next();
    } else {
      alert('Debe completar todas las actividades antes de continuar');
    }
  }

  finalizarProceso(): void {
    if (!this.disbursementComponentPhaseCompleted) {
      return;
    }

    // Resetear estados de fases
    this.estudyPhaseCompleted = false;
    this.aprobacionPhaseCompleted = false;
    this.improvementComponentPhaseCompleted = false;
    this.disbursementComponentPhaseCompleted = false;

    // Resetear componentes hijos (si existen)
    this.stadyComponent?.resetPhase();
    this.approveComponent?.resetPhase();
    this.improvementComponent?.resetPhase();
    this.disbursementComponent?.resetPhase();

    // Resetear stepper
    this.stepper?.reset();
    this.cdkSteppers?.reset();

    // Navegar y eliminar historial
    this.router.navigate(
      ['/operaciones/intencion'],
      { replaceUrl: true }
    );
  }

  // En tu componente .ts

  downloadCedula(): void {
    if (!this.creditIntentionId) {
      this.showErrorToast('No hay intención de crédito seleccionada');
      return;
    }

    this.creditIntentionService.getCedulaByIntention(this.creditIntentionId)
      .subscribe({
        next: (response) => {
          if (response.data) {
            const doc = response.data;
            const dataUrl = `data:${doc.contentType};base64,${doc.fileDataBase64}`;
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = doc.fileName;
            link.click();

            this.showSuccessToast('Cédula descargada correctamente');
          } else {
            this.showWarningToast('No se encontró documento de cédula');
          }
        },
        error: (err) => {
          console.error('Error descargando cédula:', err);
          this.showErrorToast(
            err.error?.message || 'Error al descargar la cédula'
          );
        }
      });
  }

  // Métodos auxiliares para toast (si los tienes)
  showSuccessToast(message: string): void {
    // Implementa según tu librería de toasts
    console.log('✅', message);
  }

  showWarningToast(message: string): void {
    console.warn('⚠️', message);
  }

  showErrorToast(message: string): void {
    console.error('❌', message);
  }


}