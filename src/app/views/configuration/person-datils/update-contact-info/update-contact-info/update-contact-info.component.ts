import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ContactInfoService } from '@core/services/contactInfo.service';
import { GlotypesService } from '@core/services/glotypes.service';
import { UbicacionService } from '@core/services/ubicacion.service';

@Component({
  selector: 'app-update-contact-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule ],
  templateUrl: './update-contact-info.component.html',
  styleUrls: ['./update-contact-info.component.scss']
})
export class UpdateContactInfoComponent implements OnInit {
  @Input() contactInfo: any;
  @Input() person: any;

  form!: FormGroup;
  parametersGlotypes: any[] = [];
  paises: any[] = [];
  departamentos: any[] = [];
  ciudades: any[] = [];
  barrios: any[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private contactInfoService: ContactInfoService,
    private glotypesService: GlotypesService,
    private ubicacionService: UbicacionService

  ) { }

  ngOnInit() {
    // Evitar que form sea undefined en el render inicial
    this.form = this.fb.group({
      typeInfo: [''],
      direccion: [''],
      pais: [''],
      ciudad: [''],
      barrio: [''],
      departamento: [''],
      telefono: [''],
      correo: [''],
      descripcion: ['']
    });

    this.loadTypes();
    this.loadUbicacion();

  }


  loadTypes() {
    this.glotypesService.getGlotypesByKey('TIPUBI').subscribe(types => {
      this.parametersGlotypes = types.map(d => {
        if (d.name.toUpperCase().includes('DIRECCIÓN')) return { ...d, key: 'DIR' };
        if (d.name.toUpperCase().includes('TELÉFONO')) return { ...d, key: 'TEL' };
        if (d.name.toUpperCase().includes('CELULAR')) return { ...d, key: 'CEL' };
        if (d.name.toUpperCase().includes('CORREO')) return { ...d, key: 'COR' };
        return d;
      });

      this.buildForm();
    });
  }

  buildForm() {
    this.form = this.fb.group({
      typeInfo: [this.contactInfo?.typeCode || '', Validators.required],
      direccion: [this.contactInfo?.typeCode === 'DIR' ? this.contactInfo?.value : ''],
      pais: [this.contactInfo?.country || ''],
      ciudad: [this.contactInfo?.city || ''],
      barrio: [this.contactInfo?.neighborhood || ''],
      departamento: [this.contactInfo?.department || ''],
      telefono: [(this.contactInfo?.typeCode === 'TEL' || this.contactInfo?.typeCode === 'CEL') ? this.contactInfo?.value : ''],
      correo: [this.contactInfo?.typeCode === 'COR' ? this.contactInfo?.value : ''],
      descripcion: [this.contactInfo?.description || '']
    });
  }


  getTypeLabel(code: string): string {
    switch (code) {
      case 'DIR': return 'Dirección';
      case 'TEL': return 'Teléfono';
      case 'CEL': return 'Celular';
      case 'COR': return 'Correo';
      default: return '';
    }
  }

  private findIdByLabel(list: any[], label: string): number | null {
    if (!label) return null;
    const match = list.find(item => item.label?.toLowerCase() === label.toLowerCase());
    return match ? match.id : null;
  }

  loadUbicacion() {
    this.ubicacionService.getPaises().subscribe(paises => {
      this.paises = paises;

      const paisId = this.findIdByLabel(paises, this.contactInfo?.country);
      if (paisId) {
        this.form.patchValue({ pais: paisId });

        this.ubicacionService.getDepartamentos(paisId).subscribe(deps => {
          this.departamentos = deps;

          const depId = this.findIdByLabel(deps, this.contactInfo?.department);
          if (depId) {
            this.form.patchValue({ departamento: depId });

            this.ubicacionService.getMunicipios(depId).subscribe(muns => {
              this.ciudades = muns;

              const munId = this.findIdByLabel(muns, this.contactInfo?.city);
              if (munId) {
                this.form.patchValue({ ciudad: munId });

                this.ubicacionService.getBarrios(munId).subscribe(bars => {
                  this.barrios = bars;

                  const barId = this.findIdByLabel(bars, this.contactInfo?.neighborhood);
                  if (barId) {
                    this.form.patchValue({ barrio: barId });
                  }
                });
              }
            });
          }
        });
      }
    });

    // Listeners de cambios
    this.form.get('pais')?.valueChanges.subscribe(paisId => {
      if (paisId) {
        this.ubicacionService.getDepartamentos(paisId).subscribe(data => {
          this.departamentos = data;
          this.ciudades = [];
          this.barrios = [];
          this.form.patchValue({ departamento: '', ciudad: '', barrio: '' });
        });
      }
    });

    this.form.get('departamento')?.valueChanges.subscribe(depId => {
      if (depId) {
        this.ubicacionService.getMunicipios(depId).subscribe(data => {
          this.ciudades = data;
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

  onSubmit() {
    if (this.form.invalid) return;

    const typeSelected = this.parametersGlotypes.find(t => t.key === this.form.value.typeInfo);
    if (!typeSelected) return;

    const payload: any = {
      personId: this.person.id,
      typeId: typeSelected.id
    };

    switch (this.form.value.typeInfo) {
      case 'DIR':
        payload.value = this.form.value.direccion;
        payload.country = this.form.value.pais;
        payload.department = this.form.value.departamento;
        payload.city = this.form.value.ciudad;
        payload.neighborhood = this.form.value.barrio;
        payload.description = this.form.value.descripcion;
        break;
      case 'TEL':
      case 'CEL':
        payload.value = this.form.value.telefono;
        break;
      case 'COR':
        payload.value = this.form.value.correo;
        break;
    }

    this.contactInfoService.updateContactInfo(this.contactInfo.id, payload)
      .subscribe(() => {
        this.activeModal.close(true);
      });
  }
}
