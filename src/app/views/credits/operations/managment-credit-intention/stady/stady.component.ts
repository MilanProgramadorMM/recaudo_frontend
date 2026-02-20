import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreditIntentionResponseDto, CreditIntentionService, UpdateFechaTentativaCreditIntentionUpdateDto } from '@core/services/creditIntention.service';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { Glotypes, GlotypesService } from '@core/services/glotypes.service';
import { OptionDTO, UbicacionService } from '@core/services/ubicacion.service';
import { ZonaResponseDto, ZonaService } from '@core/services/zona.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoadingComponent } from '@views/ui/loading/loading.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import Swal from 'sweetalert2';
import { CreditIntentionStatusService } from '@core/services/creditIntentionStatus.service';
import { finalize, switchMap } from 'rxjs';
import { PersonRegisterDto, PersonService } from '@core/services/person.service';

@Component({
  selector: 'app-stady',
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
  templateUrl: './stady.component.html',
  styleUrl: './stady.component.scss'
})
export class StadyComponent implements OnInit {
  private _credit!: CreditIntentionResponseDto;
  loading: boolean = false;

  //Output para notificar al padre
  @Output() allActivitiesCompleted = new EventEmitter<boolean>();

  //Variable para trackear el estado
  isPhaseCompleted = false;


  @Input()
  set credit(value: CreditIntentionResponseDto) {
    if (!value) return;

    this._credit = value;

    if (this.form1) {
      this.patchFormWithCredit();
    }
  }

  get credit(): CreditIntentionResponseDto {
    return this._credit;
  }

  @ViewChild(MatStepper) stepper!: MatStepper;

  form1!: FormGroup;
  form2!: FormGroup;
  form3!: FormGroup;
  form4!: FormGroup;
  form5!: FormGroup;

  isLinear = true;
  submitted = false;
  errorMessage = '';
  isSaving = false;
  fechaTentativaOriginal!: string;

  documentTypes: Glotypes[] = [];
  genderGlotypes: Glotypes[] = [];
  paises: OptionDTO[] = [];
  departamentos: OptionDTO[] = [];
  municipios: OptionDTO[] = [];
  barrios: OptionDTO[] = [];
  zonas: ZonaResponseDto[] = [];

  creditosCliente: any[] = [];
  observacionesSeguimiento: any[] = [];

  constructor(
    private fb: FormBuilder,
    private glotypesService: GlotypesService,
    private ubicacionService: UbicacionService,
    private zonaService: ZonaService,
    private dialog: MatDialog,
    private router: Router,
    private creditIntencionService: CreditIntentionService,
    private creditIntencionStatusService: CreditIntentionStatusService,
    private personService: PersonService

  ) { }

  ngOnInit(): void {
    this.initializeForms();
    this.loadCatalogs();

    this.ubicacionService.getPaises().subscribe(data => {
      this.paises = data;

      if (this.credit) {
        this.patchFormWithCredit();
      }
    });

    this.setupLocationListeners();
  }

  private initializeForms(): void {
    this.form1 = this.fb.group({
      document_type: ['', Validators.required],
      document: ['', Validators.required],
      gender: ['', Validators.required],
      zone_id: ['', Validators.required],
      firstname: ['', Validators.required],
      middlename: [''],
      lastname: ['', Validators.required],
      maternal_lastname: [''],
      fullname: [{ value: '', disabled: true }],
      occupation: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', Validators.required],
      whatsapp_number: ['', Validators.required],
      country_id: ['', Validators.required],
      department_id: ['', Validators.required],
      municipality_id: ['', Validators.required],
      neighborhood_id: ['', Validators.required],
      home_address: ['', Validators.required],
      description: [''],
      referido: [false],
      es_cliente_nuevo: [{ value: false, disabled: true }],
      call_success: [false, Validators.required]

    });

    const fechaFormateada = this.formatDateForInput(this.credit.fechaInicio);
    this.fechaTentativaOriginal = fechaFormateada;
    this.form2 = this.fb.group({
      observacion_actividad2: [''],
      fecha_inicio_tentativa: ['', Validators.required]
    });

    this.form3 = this.fb.group({
      observacion_actividad3: ['', Validators.required],
    });

    this.form4 = this.fb.group({
      observacion_actividad4: ['', Validators.required],
    });

    this.form5 = this.fb.group({
      observacion_actividad5: ['', Validators.required],
      decision: ['', Validators.required]
    });
  }

  patchFormWithCredit() {

    const esClienteNuevo = this.credit.clientExists === 0;

    this.form1.patchValue({
      // ACTIVIDAD 1
      document_type: Number(this.credit.documentType),
      document: this.credit.document,
      gender: Number(this.credit.gender),
      zone_id: Number(this.credit.zoneId),
      firstname: this.credit.firstname,
      middlename: this.credit.middlename,
      lastname: this.credit.lastname,
      maternal_lastname: this.credit.maternalLastname,
      fullname: this.credit.fullname,
      occupation: this.credit.occupation,
      email: this.credit.email,
      phone_number: this.credit.phoneNumber,
      whatsapp_number: this.credit.whatsappNumber,
      country_id: Number(this.credit.countryId),
      department_id: Number(this.credit.departmentId),
      municipality_id: Number(this.credit.municipalityId),
      neighborhood_id: Number(this.credit.neighborhoodId),
      home_address: this.credit.homeAddress,
      description: this.credit.description,
      es_cliente_nuevo: esClienteNuevo,

    });
    //ACTIVIDAD 2
    this.form2.patchValue({
      fecha_inicio_tentativa: this.formatDateForInput(this.credit.fechaInicio),

    });

    if (this.credit.countryId) {
      this.ubicacionService.getDepartamentos(this.credit.countryId).subscribe(deps => {
        this.departamentos = deps;

        if (this.credit.departmentId) {
          this.ubicacionService.getMunicipios(this.credit.departmentId).subscribe(muns => {
            this.municipios = muns;

            if (this.credit.municipalityId) {
              this.ubicacionService.getBarrios(this.credit.municipalityId).subscribe(barrs => {
                this.barrios = barrs;
              });
            }
          });
        }
      });
    }

    console.log('Formulario parchado con éxito');
  }

  private setupLocationListeners() {

    this.form1.get('country_id')?.valueChanges.subscribe(paisId => {
      if (paisId) {
        this.ubicacionService.getDepartamentos(paisId).subscribe(data => {
          this.departamentos = data;
          this.municipios = [];
          this.barrios = [];
          this.form1.patchValue({ departamento: '', ciudad: '', barrio: '' });
        });
      }
    });

    this.form1.get('department_id')?.valueChanges.subscribe(depId => {
      if (depId) {
        this.ubicacionService.getMunicipios(depId).subscribe(data => {
          this.municipios = data;
          this.barrios = [];
          this.form1.patchValue({ ciudad: '', barrio: '' });
        });
      }
    });

    this.form1.get('municipality_id')?.valueChanges.subscribe(munId => {
      if (munId) {
        this.ubicacionService.getBarrios(munId).subscribe(data => {
          this.barrios = data;
          this.form1.patchValue({ barrio: '' });
        });
      }
    });
  }

  loadCatalogs(): void {
    this.glotypesService.getGlotypesByKey('TIPDOC').subscribe({
      next: (data) => {
        this.documentTypes = data;
      },
      error: (err) => {
        console.error('Error cargando tipos de documento:', err);
      }
    });

    this.glotypesService.getGlotypesByKey('TIPGEN').subscribe({
      next: (data) => {
        this.genderGlotypes = data;
      },
      error: (err) => {
        console.error('Error cargando géneros:', err);
      }
    });

    this.zonaService.getByStatus().subscribe({
      next: (res) => {
        this.zonas = res.data;
      },
      error: (err) => {
        console.error('Error cargando zonas:', err);
      }
    });

    this.ubicacionService.getPaises().subscribe(data => this.paises = data);
    // Escuchar cambios
    this.form1.get('country_id')?.valueChanges.subscribe(paisId => {
      if (paisId) {
        this.ubicacionService.getDepartamentos(paisId).subscribe(data => {
          this.departamentos = data;
          this.municipios = [];
          this.barrios = [];
          this.form1.patchValue({ departamento: '', ciudad: '', barrio: '' });
        });
      }
    });

    this.form1.get('department_id')?.valueChanges.subscribe(depId => {
      if (depId) {
        this.ubicacionService.getMunicipios(depId).subscribe(data => {
          this.municipios = data;
          this.barrios = [];
          this.form1.patchValue({ ciudad: '', barrio: '' });
        });
      }
    });

    this.form1.get('municipality_id')?.valueChanges.subscribe(munId => {
      if (munId) {
        this.ubicacionService.getBarrios(munId).subscribe(data => {
          this.barrios = data;
          this.form1.patchValue({ barrio: '' });
        });
      }
    });

  }

  updateFullName(): void {
    const { firstname, middlename, lastname, maternal_lastname } = this.form1.value;
    const fullname = [firstname, middlename, lastname, maternal_lastname]
      .filter(Boolean)
      .join(' ')
      .toUpperCase();

    this.form1.patchValue({ fullname }, { emitEvent: false });
  }

  onSubmitActividad1(): void {
    if (this.isSaving) return;

    this.submitted = true;

    if (this.form1.invalid) return;

    this.isSaving = true;

    const dialogRef = this.dialog.open(LoadingComponent, {
      disableClose: true,
    });

    // Verificar si el cliente es nuevo
    const isNewClient = this.credit.clientExists === 0;

    if (isNewClient) {
      // Cliente nuevo: crear persona primero -- actualizar datos solo en intencion de credito
      //this.createPersonAndUpdateCredit(dialogRef);
      this.updateCreditIntention(dialogRef)
    } else {
      // Cliente existente: actualizar directamente
      this.updateCreditIntention(dialogRef);
    }
  }

  // private createPersonAndUpdateCredit(dialogRef: any): void {
  //   const formData = this.form1.value;

  //   // Preparar datos para crear la persona
  //   const personPayload: PersonRegisterDto = {
  //     document_type: Number(formData.document_type),
  //     document: formData.document,
  //     first_name: formData.firstname,
  //     middlename: formData.middlename || '',
  //     last_name: formData.lastname,
  //     maternal_lastname: formData.maternal_lastname || '',
  //     full_name: formData.fullname,
  //     gender: Number(formData.gender),
  //     occupation: formData.occupation || '',
  //     type_person: 'CLIENTE',
  //     zona: formData.zone_id ? Number(formData.zone_id) : undefined,
  //     countryId: formData.country_id ? Number(formData.country_id) : undefined,
  //     departentId: formData.department_id ? Number(formData.department_id) : undefined,
  //     cityId: formData.municipality_id ? Number(formData.municipality_id) : undefined,
  //     neighborhoodId: formData.neighborhood_id ? Number(formData.neighborhood_id) : undefined,
  //     adress: formData.home_address || '',
  //     correo: formData.email || '',
  //     celular: formData.whatsapp_number || '',
  //     telefono: formData.phone_number || ''
  //   };

  //   this.personService.registerPerson(personPayload).pipe(
  //     finalize(() => {
  //       this.isSaving = false;
  //       dialogRef.close();
  //     })
  //   ).subscribe({
  //     next: (personResponse) => {
  //       console.log('Persona creada:', personResponse);

  //       Swal.fire({
  //         title: '¡Éxito!',
  //         text: 'Cliente registrado correctamente en el sistema.',
  //         icon: 'success',
  //         buttonsStyling: false,
  //         confirmButtonText: 'Aceptar',
  //         customClass: {
  //           confirmButton: 'btn btn-success'
  //         }
  //       }).then(() => {
  //         this.stepper.next();
  //         window.scrollTo({ top: 0, behavior: 'smooth' });
  //       });
  //     },
  //     error: (error) => {
  //       console.error('Error al crear persona:', error);

  //       let errorMessage = 'Ocurrió un error al registrar el cliente.';

  //       if (error?.message) {
  //         errorMessage = error.message;
  //       } else if (error?.details) {
  //         errorMessage = error.details;
  //       } else if (typeof error === 'string') {
  //         errorMessage = error;
  //       }

  //       Swal.fire({
  //         title: 'Error',
  //         text: errorMessage,
  //         icon: 'error',
  //         buttonsStyling: false,
  //         confirmButtonText: 'Aceptar',
  //         customClass: {
  //           confirmButton: 'btn btn-danger'
  //         }
  //       });

  //       this.isSaving = false;
  //     }
  //   });
  // }

  private updateCreditIntention(dialogRef: any): void {
    const payload = {
      ...this.form1.value,
      fullname: this.form1.get('fullname')?.value,
      referido: this.form1.get('referido')?.value ? 1 : 0,
      call_success: this.form1.get('call_success')?.value ? 1 : 0
    };

    this.creditIntencionService
      .updateClientData(this.credit.id, payload)
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
            text: 'Datos del cliente actualizados correctamente.',
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
        error: (error) => {
          console.error('Error:', error);

          Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al actualizar los datos.',
            icon: 'error',
            buttonsStyling: false,
            confirmButtonText: 'Aceptar',
            customClass: {
              confirmButton: 'btn btn-danger'
            }
          });

          this.isSaving = false;
        }
      });
  }

  onSubmitActividad2(): void {
    this.submitted = true;

    if (this.form2.invalid) return;

    const fechaActual = this.form2.getRawValue().fecha_inicio_tentativa;

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

  onSubmitActividad3(): void {
    this.submitted = true;

    if (this.form3.invalid) return;
    console.log('Actividad 3 enviada', this.form3.value);
    //Guardar avances de la fase de credito en BD

    this.stepper.next();
  }

  onSubmitActividad4(): void {
    this.submitted = true;

    if (this.form4.invalid) return;
    console.log('Actividad 4 enviada', this.form4.value);
    //Guardar avances de la fase de credito en BD

    this.stepper.next();
  }

  onSubmitActividad5(): void {
    this.submitted = true;

    if (this.form5.invalid) return;

    const decision = this.form5.value.decision;
    console.log('Actividad 5 enviada', this.form5.value);

    const dialogRef = this.dialog.open(LoadingComponent, {
      disableClose: true,
    });
    if (decision === 'rechazar') {
      dialogRef.close();

      this.creditIntencionStatusService.updateStatus({
        credit_id: this.credit.id,
        new_status: 'RECHAZED'
      }).subscribe({
        next: () => {
          Swal.fire({
            title: 'Solicitud rechazada',
            text: 'La solicitud fue rechazada en la fase de estudio.',
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
      new_status: 'APPROVED'
    })
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
            text: 'Fase de estudio completada correctamente.',
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

      case 4:
        currentForm = this.form4;
        isValid = this.validateActividad4();
        break;

      case 5:
        currentForm = this.form5;
        isValid = this.validateActividad5()
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
    const camposActividad1 = [
      'document_type',
      'document',
      'firstname',
      'lastname',
      'gender',
      'occupation',
      'email',
      'phone_number',
      'whatsapp_number',
      'zone_id',
      'country_id',
      'department_id',
      'municipality_id',
      'neighborhood_id',
      'home_address',
      'es_cliente_nuevo',
      'referido',
      'call_success'
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
    const camposActividad2 = [
      'fecha_inicio_tentativa',
    ];

    let isValid = true;

    camposActividad2.forEach(field => {
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

  private validateActividad3(): boolean {
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

  private validateActividad4(): boolean {
    const camposActividad4 = [
      'observacion_actividad4',
    ];

    let isValid = true;

    camposActividad4.forEach(field => {
      const control = this.form4.get(field);
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

  private validateActividad5(): boolean {
    const camposActividad5 = [
      'decision',
      'observacion_actividad5',
    ];

    let isValid = true;

    camposActividad5.forEach(field => {
      const control = this.form5.get(field);
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

  //Método para verificar si está completo el wizard hijo
  isCompleted(): boolean {
    return this.isPhaseCompleted;
  }

  // Método para resetear cuando cambia de fase
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

  // Función de utilidad para convertir fecha a formato "YYYY-MM-DD"
  formatDateForInput(dateStr: string): string {
    if (!dateStr) return '';
    return dateStr.split(' ')[0];
  }

}