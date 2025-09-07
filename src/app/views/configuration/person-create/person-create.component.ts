import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PersonRegisterDto, PersonService } from '@core/services/person.service';
import { FileUploaderComponent } from '@components/file-uploader.component';
import { NgIf, NgClass, NgForOf, NgFor, CommonModule, LowerCasePipe } from '@angular/common';
import { Glotypes, GlotypesService } from '@core/services/glotypes.service';

@Component({
  selector: 'app-person-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    FileUploaderComponent,
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

  constructor(
    public activeModal: NgbActiveModal,
    private personService: PersonService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private glotypesService: GlotypesService

  ) { }

  ngOnInit(): void {

    this.loadDocumentTypes();
    this.loadGender();

    this.form = this.fb.group({
      firstName: ['', Validators.required],
      secondName: [''],
      firstSurname: ['', Validators.required],
      secondSurname: [''],
      identification: ['', Validators.required],
      documentType: [null, Validators.required],
      gender: [null, Validators.required],
      occupation: ['', Validators.required],
      description: [''],
      fullName: [{ value: '', disabled: true }],
    });

    if (this.personData) {
      this.loadPersonData(this.personData);
    }

    this.form.valueChanges.subscribe(() => {
      this.updateFullName();
    });
  }

  loadPersonData(data: any) {
    this.form.patchValue({
      firstName: data.first_name,
      secondName: data.middlename,
      firstSurname: data.last_name,
      secondSurname: data.maternal_lastname,
      identification: data.document,
      documentType: Number(data.document_type),
      gender: Number(data.gender),
      occupation: data.occupation,
      description: data.description

    });

    this.updateFullName();
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

    if (this.form.invalid) {
      this.errorMessage = 'Por favor completa los campos obligatorios.';
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
      type_person: this.personType

    };

    const action = this.personData?.id
      ? this.personService.updatePerson(person)
      : this.personService.registerPerson(person);

    action.subscribe({
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
        // 👇 aquí validamos si viene INACTIVE desde el backend
        if (err?.status === 'INACTIVE' || err?.error?.status === 'INACTIVE') {
          const personId = err.personId || err?.error?.personId;
          // Guardamos en memoria para usarlo al confirmar
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
}
