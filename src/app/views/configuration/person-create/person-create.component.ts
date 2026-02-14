import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PersonRegisterDto, PersonService } from '@core/services/person.service';
import { NgIf, NgClass, NgForOf, NgFor, CommonModule, LowerCasePipe } from '@angular/common';
import { Glotypes, GlotypesService } from '@core/services/glotypes.service';
import { OptionDTO, UbicacionService } from '@core/services/ubicacion.service';
import { ZonaResponseDto, ZonaService } from '@core/services/zona.service';
import { LoadingComponent } from '@views/ui/loading/loading.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-person-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    NgForOf,
    NgFor,
    NgClass,
    CommonModule,
    LowerCasePipe
  ],
  templateUrl: './person-create.component.html',
  styleUrl: './person-create.component.scss'
})
export class PersonCreateComponent implements OnInit {
  @Input() personData: PersonRegisterDto | null = null;
  @Input() personType!: string; // ASESOR | CLIENTE

  modalTitle = '';


  @ViewChild('successalert', { static: true }) successAlertTpl!: TemplateRef<any>;
  @ViewChild('erroralert', { static: true }) errorAlertTpl!: TemplateRef<any>;
  @ViewChild('confirmReactivate', { static: true }) confirmReactivateTpl!: TemplateRef<any>;



  form!: FormGroup;
  submitted = false;
  errorMessage = '';
  lastErrorMessage = '';
  successDetails: string = '';



  genderGlotypes: Glotypes[] = [];
  documentTypes: Glotypes[] = [];
  paises: OptionDTO[] = [];
  departamentos: OptionDTO[] = [];
  municipios: OptionDTO[] = [];
  barrios: OptionDTO[] = [];
  zonas: ZonaResponseDto[] = [];
  selectedZonas: number[] = [];


  constructor(
    public activeModal: NgbActiveModal,
    private personService: PersonService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private glotypesService: GlotypesService,
    private ubicacionService: UbicacionService,
    private zonaService: ZonaService
  ) { }

  ngOnInit(): void {

    this.loadDocumentTypes();
    this.loadGender();

    this.form = this.fb.group({
      firstName: [''],
      secondName: [''],
      firstSurname: [''],
      secondSurname: [''],
      identification: [''],
      documentType: [null],
      gender: [null],
      occupation: [''],
      description: [''],
      fullName: [{ value: '', disabled: true }],
      direccion: [''],
      pais: [],
      zona: [null],
      departamento: [''],
      ciudad: [],
      barrio: [],
      telefono: [''],
      celular: [''],
      orden: [''],
      correo: [''],
      descripcion: ['']
    });

    this.setValidatorsByType();

    if (this.personData) {
      this.loadPersonData(this.personData);
    }

    this.form.valueChanges.subscribe(() => {
      this.updateFullName();
    });

    this.zonaService.getByStatus().subscribe({
      next: (res) => {
        this.zonas = res.data;
      }, error: (err) => {
        console.error('Error cargando zonas:', err);
      }
    });

    this.ubicacionService.getPaises().subscribe(data => this.paises = data);
    // Escuchar cambios
    this.form.get('pais')?.valueChanges.subscribe(paisId => {
      if (paisId) {
        this.ubicacionService.getDepartamentos(paisId).subscribe(data => {
          this.departamentos = data;
          this.municipios = [];
          this.barrios = [];
          this.form.patchValue({ departamento: '', ciudad: '', barrio: '' });
        });
      }
    });

    this.form.get('departamento')?.valueChanges.subscribe(depId => {
      if (depId) {
        this.ubicacionService.getMunicipios(depId).subscribe(data => {
          this.municipios = data;
          this.barrios = [];
          this.form.patchValue({ ciudad: '', barrio: '' });
        });
      }
    });

    this.form.get('ciudad')?.valueChanges.subscribe(munId => {
      if (munId) {
        this.ubicacionService.getBarrios(munId).subscribe(data => {
          this.barrios = data;
          this.form.patchValue({ barrio: '' });
        });
      }
    });
  }

  loadPersonData(data: any) {
    this.form.patchValue({
      firstName: data.firstName,
      secondName: data.middleName,
      firstSurname: data.lastName,
      secondSurname: data.maternalLastname,
      identification: data.document,
      documentType: Number(data.documentType),
      gender: Number(data.gender),
      occupation: data.occupation,
      description: data.description,

      // contacto
      pais: data.countryId,
      departamento: data.departentId,
      ciudad: data.cityId,
      barrio: data.neighborhoodId,
      direccion: data.adress,
      descripcion: data.descriptionD,
      telefono: data.telefono,
      celular: data.celular,
      correo: data.correo,

      // zona
      zona: data.zid ? Number(data.zid) : null,
      orden: data.orden

    });

    // ===== CARGAR ZONA PARA CLIENTE =====
    if (this.personType === 'CLIENTE' && data.zid) {
      this.form.patchValue({
        zona: Number(data.zid)  // ← AGREGAR: Establecer zona para CLIENTE
      });
    }
    // ===== CARGAR ZONAS PARA ASESOR =====
    if (this.personType === 'ASESOR' && data.zid) {
      this.selectedZonas = String(data.zid)
        .split('-')
        .map((id: string) => Number(id.trim()));
    }


    this.updateFullName();

    if (data.countryId) {
      this.ubicacionService.getDepartamentos(data.countryId).subscribe(deps => {
        this.departamentos = deps;
        if (data.departentId) {
          this.ubicacionService.getMunicipios(data.departentId).subscribe(muns => {
            this.municipios = muns;
            if (data.cityId) {
              this.ubicacionService.getBarrios(data.cityId).subscribe(barrs => {
                this.barrios = barrs;
              });
            }
          });
        }
      });
    }
  }

  // Método para manejar el cambio en los checkboxes
  onZonaCheckboxChange(event: any, zonaId: number): void {
    if (event.target.checked) {
      if (!this.selectedZonas.includes(zonaId)) {
        this.selectedZonas.push(zonaId);
      }
    } else {
      this.selectedZonas = this.selectedZonas.filter(id => id !== zonaId);
    }
  }

  // Método para remover una zona seleccionada
  removeZona(zonaId: number): void {
    this.selectedZonas = this.selectedZonas.filter(id => id !== zonaId);
  }

  // Método para obtener el nombre de la zona
  getZonaName(zonaId: number): string {
    const zona = this.zonas.find(z => z.id === zonaId);
    return zona ? zona.value : '';
  }

  updateFullName() {
    const { firstName, secondName, firstSurname, secondSurname } = this.form.value;

    // Construir con los campos que no estén vacíos
    const parts = [firstName, secondName, firstSurname, secondSurname]
      .filter((v: string | null | undefined) => v && v.trim() !== '');

    // Unir y convertir a MAYÚSCULAS
    const value = parts.join(' ').toUpperCase();

    this.form.get('fullName')?.setValue(value, { emitEvent: false });
  }

  savePerson() {
    this.submitted = true;

    // Validación especial para ASESORES
    if (this.personType === 'ASESOR' && this.selectedZonas.length === 0) {
      this.errorMessage = 'Debe seleccionar al menos una zona para el asesor.';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }

    if (this.form.invalid) {
      this.errorMessage = 'Por favor completa los campos obligatorios.(*)';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }

    const formValues = this.form.getRawValue();
    Object.keys(formValues).forEach(key => {
      if (typeof formValues[key] === 'string') {
        formValues[key] = formValues[key].toUpperCase();
      }
    });

    const person: PersonRegisterDto = {
      id: this.personData?.id,
      document_type: formValues.documentType,
      document: formValues.identification,
      first_name: formValues.firstName,
      middlename: formValues.secondName,
      last_name: formValues.firstSurname,
      maternal_lastname: formValues.secondSurname,
      full_name: formValues.fullName,
      gender: formValues.gender,
      occupation: formValues.occupation,
      description: formValues.description,
      type_person: this.personType,
      countryId: formValues.pais,
      departentId: formValues.departamento,
      cityId: formValues.ciudad,
      neighborhoodId: formValues.barrio,
      adress: formValues.direccion,
      details: formValues.descripcion,
      correo: formValues.correo,
      celular: formValues.celular,
      telefono: formValues.telefono
    };

    // Asignar zona según el tipo de persona (SOLO UNA VEZ)
    if (this.personType === 'CLIENTE') {
      person.zona = formValues.zona;
    } else if (this.personType === 'ASESOR') {
      person.zonas = this.selectedZonas;
    }

    const loadingRef = this.modalService.open(LoadingComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
      size: 'sm',
      modalDialogClass: 'modal-loading'
    });

    const action = this.personData?.id
      ? this.personService.updatePerson(person)
      : this.personService.registerPerson(person);

    action.subscribe({
      next: (response) => {
        loadingRef.close();
        this.successDetails = response.details;
        const modalRef = this.modalService.open(this.successAlertTpl, {
          centered: true,
          size: 'sm',
          backdrop: 'static'
        });
        modalRef.result.then(
          () => this.activeModal.close(response.data),
          () => this.activeModal.close(response.data)
        );
      },
      error: (err) => {
        loadingRef.close();
        if (err?.status === 'INACTIVE' || err?.error?.status === 'INACTIVE') {
          const personId = err.personId || err?.error?.personId;
          this.pendingReactivateId = personId;
          this.modalService.open(this.confirmReactivateTpl, {
            centered: true,
            size: 'sm',
            backdrop: 'static'
          });
        } else {
          this.errorMessage = 'Error al guardar la persona.';
          this.lastErrorMessage = err?.error?.details || err?.message || null;
          this.modalService.open(this.errorAlertTpl, {
            centered: true,
            size: 'sm'
          });
        }
      }
    });
  }

  pendingReactivateId: number | null = null;

  onConfirmReactivate(modal: any) {
    modal.close();
    if (!this.pendingReactivateId) return;

    this.personService.reactivatePerson(this.pendingReactivateId).subscribe({
      next: (response) => {
        this.successDetails = response.details;
        const modalRef = this.modalService.open(this.successAlertTpl, {
          centered: true,
          size: 'sm',
          backdrop: 'static'
        });
        modalRef.result.then(
          () => this.activeModal.close(response.data),
          () => this.activeModal.close(response.data)
        );
      },
      error: (err) => {
        this.errorMessage = 'No se pudo reactivar la persona.';
        this.lastErrorMessage = err?.error?.details || err?.message || null;
        this.modalService.open(this.errorAlertTpl, {
          centered: true,
          size: 'sm'
        });
      }
    });
  }

  onSuccessContinue(alertModalRef: any) {
    // cerramos el modal de alerta y luego el modal principal en el flow next
    alertModalRef.close();
    // NOTA: el cierre definitivo del modal principal lo maneja modalRef.result.then en savePerson()
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

  cancel() {
    this.activeModal.dismiss();
  }

  soloNumeros(event: KeyboardEvent) {
    const char = event.key;

    // Permitir solo números y teclas de control como Backspace
    if (!/^[0-9]$/.test(char) && event.key !== 'Backspace' && event.key !== 'Tab') {
      event.preventDefault();
    }
  }

  private setValidatorsByType(): void {
    // Limpia validadores antes de aplicar los nuevos
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.clearValidators();
      this.form.get(key)?.updateValueAndValidity({ emitEvent: false });
    });

    // Validadores comunes a ambos tipos
    const comunes = ['firstName', 'firstSurname', 'documentType', 'identification', 'gender', 'occupation',
      'pais', 'departamento', 'ciudad', 'barrio', 'direccion', 'celular', 'correo'];

    comunes.forEach(field => {
      if (field === 'correo') {
        this.form.get(field)?.setValidators([Validators.required, Validators.email]);
      } else {
        this.form.get(field)?.setValidators([Validators.required]);
      }
      this.form.get(field)?.updateValueAndValidity({ emitEvent: false });
    });

    // Si es CLIENTE → zona y orden también obligatorios
    if (this.personType === 'CLIENTE') {
      this.form.get('zona')?.setValidators([Validators.required]);
      //this.form.get('orden')?.setValidators([Validators.required]);
      this.form.get('zona')?.updateValueAndValidity({ emitEvent: false });
      //this.form.get('orden')?.updateValueAndValidity({ emitEvent: false });
    }
  }

}
