import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OptionDTO, UbicacionService } from '@core/services/ubicacion.service';
import { DeparmentService, DepartamentoRequestDto, DepartamentoResponseDto } from '@core/services/department.service';
import { CitiesResponseDto, CitiesService } from '@core/services/cities.service';
import { BarrioResponseDto, BarrioService } from '@core/services/neighborhood.service';
import { Observable } from 'rxjs';

function isDepartamento(entity: any): entity is DepartamentoResponseDto {
  return (entity as DepartamentoResponseDto).idPais !== undefined;
}

function isCity(entity: any): entity is CitiesResponseDto {
  return (entity as CitiesResponseDto).idDepartamento !== undefined;
}

function isBarrio(entity: any): entity is BarrioResponseDto {
  return (entity as BarrioResponseDto).idMunicipio !== undefined;
}

@Component({
  selector: 'app-create-location-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-location-modal.component.html',
})
export class CreateLocationModalComponent {
  @Input() type!: 'departamento' | 'municipio' | 'barrio';
  @Input() entityToEdit?: DepartamentoResponseDto | CitiesResponseDto | BarrioResponseDto;


  submitted = false;
  loading = false;
  errorMessage = '';
  lastErrorMessage: string | null = null;

  @ViewChild('successAlert') successAlertTpl!: TemplateRef<any>;
  @ViewChild('errorAlert') errorAlertTpl!: TemplateRef<any>;
  nombre: string = '';
  descripcion: string = '';
  paisId?: number;
  departamentoId?: number;
  municipioId?: number;

  successMessage: string | null = null;
  successDetails: string | null = null;


  get isEditMode(): boolean {
    return !!this.entityToEdit;
  }


  paises: OptionDTO[] = [];
  departamentos: DepartamentoResponseDto[] = [];
  municipios: CitiesResponseDto[] = [];

  constructor(
    private ubicacionService: UbicacionService,
    public activeModal: NgbActiveModal,
    private deparment: DeparmentService,
    private citiesService: CitiesService,
    private barrioService: BarrioService,
    private modalService: NgbModal

  ) { }

  ngOnInit(): void {
    if (this.type === 'departamento') {
      this.loadPaises();
    } else if (this.type === 'municipio') {
      this.loadDepartamentos();
    } else if (this.type === 'barrio') {
      this.loadMunicipios();
    }

    // Si es edición, precargar los datos
    if (this.type === 'departamento' && isDepartamento(this.entityToEdit)) {
      this.nombre = this.entityToEdit.nombre;
      this.descripcion = this.entityToEdit.description || '';
      this.paisId = this.entityToEdit.idPais;
    }

    if (this.type === 'municipio' && isCity(this.entityToEdit)) {
      this.nombre = this.entityToEdit.nombre;
      this.descripcion = this.entityToEdit.description || '';
      this.departamentoId = this.entityToEdit.idDepartamento;
    }

    if (this.type === 'barrio' && isBarrio(this.entityToEdit)) {
      this.nombre = this.entityToEdit.nombre;
      this.descripcion = this.entityToEdit.description || '';
      this.municipioId = this.entityToEdit.idMunicipio;
    }
  }

  loadPaises() {
    this.ubicacionService.getPaises().subscribe(res => this.paises = res);
  }

  loadDepartamentos() {
    this.deparment.getAllDepartments().subscribe(res => this.departamentos = res.data);
  }

  loadMunicipios() {
    this.citiesService.getAllMunicipios().subscribe(res => this.municipios = res.data);
  }

  save(form: NgForm) {
    this.submitted = true;

    if (form.invalid) {
      this.errorMessage = 'Por favor completa los campos obligatorios.';
      setTimeout(() => (this.errorMessage = ''), 3000);
      return;
    }

    this.loading = true;

    let payload: any;
    let service$: Observable<any>;

    if (this.type === 'departamento') {
      payload = {
        value: this.nombre,
        description: this.descripcion,
        idPais: this.paisId!,
      };
      if (this.entityToEdit) {
        service$ = this.deparment.updateDepartamento(this.entityToEdit.id!, payload);
      } else {
        service$ = this.deparment.createDepartamento(payload);
      }

    } else if (this.type === 'municipio') {
      payload = {
        value: this.nombre,
        description: this.descripcion,
        idDepartamento: this.departamentoId!,
      };
      if (this.entityToEdit) {
        service$ = this.citiesService.updateMunicipio(this.entityToEdit.id, payload);
      } else {
        service$ = this.citiesService.createMunicipio(payload);
      }
    } else if (this.type === 'barrio') {
      payload = {
        value: this.nombre,
        description: this.descripcion,
        idMunicipio: this.municipioId!,
      };
      if (this.entityToEdit) {
        service$ = this.barrioService.updateBarrio(this.entityToEdit.id, payload);
      } else {
        service$ = this.barrioService.createBarrio(payload);
      }
    } else {
      return;
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

        this.modalService.open(this.errorAlertTpl, {
          centered: true,
          size: 'sm',
        });
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
