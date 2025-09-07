import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactInfoService } from '@core/services/contactInfo.service';
import { Glotypes, GlotypesService } from '@core/services/glotypes.service';
import { PersonRegisterDto } from '@core/services/person.service';
import { OptionDTO, UbicacionService } from '@core/services/ubicacion.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { treatmentData } from '@views/hospital/patient-details/data';

@Component({
  selector: 'app-person-info',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './person-info.component.html',
  styleUrls: ['./person-info.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PersonInfoComponent implements OnInit {
  @Input() person!: PersonRegisterDto;
  @Output() saved = new EventEmitter<void>();

  @ViewChild('successalert', { static: true }) successAlertTpl!: TemplateRef<any>;
  @ViewChild('erroralert', { static: true }) errorAlertTpl!: TemplateRef<any>;

  form!: FormGroup;
  submitted = false;
  errorMessage = '';
  lastErrorMessage = '';

  parametersGlotypes: Glotypes[] = [];
  contactInfoList: any[] = [];


  paises: OptionDTO[] = [];
  departamentos: OptionDTO[] = [];
  municipios: OptionDTO[] = [];
  barrios: OptionDTO[] = [];



  constructor(
    private fb: FormBuilder,
    private glotypesService: GlotypesService,
    private contactInfoService: ContactInfoService,
    private ubicacionService: UbicacionService,
    private modalService: NgbModal


  ) { }

  ngOnInit() {

    this.loadParameterFilterFormSave();
    this.form = this.fb.group({
      typeInfo: ['', Validators.required],
      direccion: [''],
      pais: [],
      departamento: [''], // ← nuevo
      ciudad: [],
      barrio: [],
      telefono: [''],
      correo: [''],
      descripcion: [''] // ← nuevo
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

    // Segun opcion activar form dinamico
    this.form.get('typeInfo')?.valueChanges.subscribe(code => {
      this.resetDynamicValidators();

      if (code === 'DIR') {
        this.setValidators(['direccion', 'pais', 'ciudad', 'barrio', 'departamento']);
      } else if (code === 'TEL' || code === 'CEL') {
        this.setValidators(['telefono']);
        this.form.get('telefono')?.setValidators([
          Validators.required,
          Validators.pattern(/^[0-9]+$/)
        ]);
        this.form.get('telefono')?.updateValueAndValidity();
      } else if (code === 'COR') {
        this.setValidators(['correo']);
        this.form.get('correo')?.setValidators([
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
        ]);
        this.form.get('correo')?.updateValueAndValidity();
      }
    });
  }

  soloNumeros(event: KeyboardEvent) {
    const char = event.key;

    // Permitir solo números y teclas de control como Backspace
    if (!/^[0-9]$/.test(char) && event.key !== 'Backspace' && event.key !== 'Tab') {
      event.preventDefault();
    }
  }

  private resetDynamicValidators() {
    const controls = ['direccion', 'pais', 'ciudad', 'barrio', 'telefono', 'correo'];
    controls.forEach(c => {
      this.form.get(c)?.clearValidators();
      this.form.get(c)?.updateValueAndValidity();
    });
  }

  private setValidators(fields: string[]) {
    fields.forEach(f => {
      this.form.get(f)?.setValidators([Validators.required]);
      this.form.get(f)?.updateValueAndValidity();
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) return;

    // Buscar typeId
    const typeSelected = this.parametersGlotypes.find(t => t.key === this.form.value.typeInfo);
    if (!typeSelected) {
      //this.errorMessage = 'No se encontró el tipo de información';
      //this.lastErrorMessage = null;
      this.modalService.open(this.errorAlertTpl, { centered: true, size: 'sm' });
      return;
    }

    // Payload según tipo
    const payload: any = {
      personId: this.person.id,
      typeId: typeSelected.id
    };

    switch (this.form.value.typeInfo) {
      case 'DIR':
        payload.value = this.form.value.direccion.toUpperCase() || '';
        payload.country = this.form.value.pais;
        payload.department = this.form.value.departamento;
        payload.city = this.form.value.ciudad;
        payload.neighborhood = this.form.value.barrio;
        payload.description = this.form.value.descripcion.toUpperCase() || '';
        break;
      case 'TEL':
      case 'CEL':
        payload.value = this.form.value.telefono;
        break;
      case 'COR':
        payload.value = this.form.value.correo;
        break;
    }

    const action = this.contactInfoService.saveContactInfo(payload);
    action.subscribe({
      next: () => {
        // modal éxito
        this.modalService.open(this.successAlertTpl, { centered: true, size: 'sm', backdrop: 'static' });
        // Notificar al padre para refrescar la lista
        this.saved.emit();
        // Reset
        this.form.reset();
        this.submitted = false;
      },
      error: (err) => {

        this.errorMessage = err?.error?.details || 'Error inesperado';

        this.modalService.open(this.errorAlertTpl, { centered: true, size: 'sm' });
      }

    });
  }

  loadParameterFilterFormSave() {
    this.glotypesService.getGlotypesByKey('TIPUBI').subscribe({
      next: (data) => {
        this.parametersGlotypes = data.map(d => {
          if (d.name.toUpperCase().includes('DIRECCIÓN')) return { ...d, key: 'DIR' };
          if (d.name.toUpperCase().includes('TELÉFONO')) return { ...d, key: 'TEL' };
          if (d.name.toUpperCase().includes('CELULAR')) return { ...d, key: 'CEL' };
          if (d.name.toUpperCase().includes('CORREO')) return { ...d, key: 'COR' };
          return d;
        });
      },
      error: (err) => console.error('Error cargando opciones:', err)
    });
  }


}
