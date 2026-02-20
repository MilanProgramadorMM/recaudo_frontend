import { Component, Input, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OptionDTO, UbicacionService } from '@core/services/ubicacion.service';
import { DeparmentService } from '@core/services/department.service';
import { CitiesService } from '@core/services/cities.service';
import { BarrioService } from '@core/services/neighborhood.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-location-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-location-modal.component.html',
})
export class CreateLocationModalComponent implements OnInit {
  @Input() type!: 'departamento' | 'municipio' | 'barrio';
  @Input() entityToEdit?: any;

  @ViewChild('successAlert') successAlertTpl!: TemplateRef<any>;
  @ViewChild('errorAlert') errorAlertTpl!: TemplateRef<any>;

  form!: FormGroup;
  submitted = false;
  loading = false;
  errorMessage = '';
  lastErrorMessage: string | null = null;

  successMessage: string | null = null;
  successDetails: string | null = null;

  paises: OptionDTO[] = [];
  departamentos: OptionDTO[] = [];
  municipios: OptionDTO[] = [];

  get isEditMode(): boolean {
    return !!this.entityToEdit;
  }

  constructor(
    private fb: FormBuilder,
    private ubicacionService: UbicacionService,
    public activeModal: NgbActiveModal,
    private deparment: DeparmentService,
    private citiesService: CitiesService,
    private barrioService: BarrioService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    // Configuración del formulario con validaciones dinámicas
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      pais: ['', this.type !== 'departamento' ? Validators.required : []],
      departamento: ['', this.type === 'municipio' || this.type === 'barrio' ? Validators.required : []],
      municipio: ['', this.type === 'barrio' ? Validators.required : []],
    });



    // Cargar países
    this.ubicacionService.getPaises().subscribe((data) => {
      this.paises = data;

      if (this.isEditMode) {
        this.form.patchValue({
          nombre: this.entityToEdit.nombre,
          descripcion: this.entityToEdit.description || ''
        });

        if (this.type === 'departamento') {
          this.form.patchValue({ pais: this.entityToEdit.idPais });

        } else if (this.type === 'municipio') {
          this.form.patchValue({ pais: this.entityToEdit.idPais }, { emitEvent: false });
          this.ubicacionService.getDepartamentos(this.entityToEdit.idPais).subscribe((deps) => {
            this.departamentos = deps;
            this.form.patchValue({ departamento: this.entityToEdit.idDepartamento });
          });

        } else if (this.type === 'barrio') {
          this.form.patchValue({ pais: this.entityToEdit.idPais }, { emitEvent: false });
          this.ubicacionService.getDepartamentos(this.entityToEdit.idPais).subscribe((deps) => {
            this.departamentos = deps;
            this.form.patchValue({ departamento: this.entityToEdit.idDepartamento }, { emitEvent: false });

            this.ubicacionService.getMunicipios(this.entityToEdit.idDepartamento).subscribe((muns) => {
              this.municipios = muns;
              this.form.patchValue({ municipio: this.entityToEdit.idMunicipio });
            });
          });
        }
      }

    });

    this.form.get('pais')?.valueChanges.subscribe((paisId) => {
      if (!paisId) return; // 👈 evita llamadas con null
      if (this.type === 'municipio' || this.type === 'barrio') {
        this.ubicacionService.getDepartamentos(paisId).subscribe((data) => {
          this.departamentos = data;
          this.municipios = [];
          this.form.patchValue({ departamento: '', municipio: '' }, { emitEvent: false });
        });
      }
    });

    this.form.get('departamento')?.valueChanges.subscribe((depId) => {
      if (!depId) return;
      if (this.type === 'barrio') {
        this.ubicacionService.getMunicipios(depId).subscribe((data) => {
          this.municipios = data;
          this.form.patchValue({ municipio: '' }, { emitEvent: false });
        });
      }
    });

  }


  save() {
    this.submitted = true;

    if (this.form.invalid) {
      this.errorMessage = 'Por favor completa los campos obligatorios(*).';
      setTimeout(() => (this.errorMessage = ''), 3000);
      return;
    }

    this.loading = true;
    const value = this.form.value;
    let payload: any;
    let service$: Observable<any>;

    if (this.type === 'departamento') {
      payload = { value: value.nombre, description: value.descripcion, idPais: value.pais };
      service$ = this.isEditMode
        ? this.deparment.updateDepartamento(this.entityToEdit.id, payload)
        : this.deparment.createDepartamento(payload);

    } else if (this.type === 'municipio') {
      payload = { value: value.nombre, description: value.descripcion, idDepartamento: value.departamento };
      service$ = this.isEditMode
        ? this.citiesService.updateMunicipio(this.entityToEdit.id, payload)
        : this.citiesService.createMunicipio(payload);

    } else {
      payload = { value: value.nombre, description: value.descripcion, idMunicipio: value.municipio };
      service$ = this.isEditMode
        ? this.barrioService.updateBarrio(this.entityToEdit.id, payload)
        : this.barrioService.createBarrio(payload);
    }

    service$.subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = res.message;
        this.successDetails = res.details;

        const modalRef = this.modalService.open(this.successAlertTpl, {
          centered: true,
          size: 'sm',
          backdrop: 'static',
        });

        modalRef.result.then(
          () => this.activeModal.close(res),
          () => this.activeModal.close(res)
        );
      },
      error: (err) => {
        this.loading = false;
        this.lastErrorMessage =
          err?.error?.details || err?.error?.message || err?.message || 'Error inesperado';
        this.modalService.open(this.errorAlertTpl, { centered: true, size: 'sm' });
      },
    });
  }

  cancel(): void {
    this.activeModal.dismiss();
  }

  onSuccessContinue(alertModalRef: any) {
    alertModalRef.close();
  }
}
