import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PersonRegisterDto, PersonService } from '@core/services/person.service';
import { FileUploaderComponent } from '@components/file-uploader.component';
import { NgIf, NgClass, NgForOf, NgFor } from '@angular/common';

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
    NgClass
  ],
  templateUrl: './person-create.component.html',
  styleUrl: './person-create.component.scss'
})
export class PersonCreateComponent implements OnInit {
  @Input() personData: PersonRegisterDto | null = null;

  form!: FormGroup;
  submitted = false;
  errorMessage = '';

  documentTypeOpt = [
    { value: 1, label: 'Cédula de Ciudadanía' },
    { value: 2, label: 'Tarjeta de Identidad' },
    { value: 3, label: 'Pasaporte' }
  ];
  genderOpt = [
    { value: 1, label: 'Masculino' },
    { value: 2, label: 'Femenino' },
    { value: 3, label: 'Otro' }
  ];

  constructor(
    public activeModal: NgbActiveModal,
    private personService: PersonService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      secondName: ['', Validators.required],
      firstSurname: ['', Validators.required],
      secondSurname: ['', Validators.required],
      identification: ['', Validators.required],
      documentType: [null, Validators.required],
      gender: [null, Validators.required],
      occupation: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
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
      description: data.description,
    });

    this.updateFullName();
  }

  updateFullName() {
    const value = `${this.form.value.firstName} ${this.form.value.secondName} ${this.form.value.firstSurname} ${this.form.value.secondSurname}`.trim();
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
      user_create: this.personData ? undefined : 'admin_user',
      user_edit: this.personData ? 'admin_user' : undefined,
    };

    const action = this.personData?.id
      ? this.personService.updatePerson(person)
      : this.personService.registerPerson(person);

    action.subscribe({
      next: (response) => this.activeModal.close(response.data),
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error al guardar la persona.';
      }
    });
  }

  cancel() {
    this.activeModal.dismiss();
  }
}
