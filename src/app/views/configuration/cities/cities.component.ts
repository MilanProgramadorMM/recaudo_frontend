import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from '@components/page-title.component';
import { NgbModal, NgbPaginationModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { DepartamentoResponseDto } from '@core/services/department.service';
import { CitiesResponseDto, CitiesService } from '@core/services/cities.service';
import { CreateLocationModalComponent } from "../create-location-modal/create-location-modal.component";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cities',
  imports: [PageTitleComponent, NgbPaginationModule, NgbModalModule, CommonModule, FormsModule],
  templateUrl: './cities.component.html',
  styleUrl: './cities.component.scss'
})
export class CitiesComponent {
  municipios: CitiesResponseDto[] = [];
  filteredMunicipios: CitiesResponseDto[] = [];
  searchTerm: string = '';
  page = 1;
  loading: boolean = false;


  newMunicipio: CitiesResponseDto = { id: 0, nombre: '', nombreDepartamento: '', idDepartamento: 0, nombrePais: '' };

  constructor(private modalService: NgbModal, private citiesService: CitiesService) { }

  ngOnInit(): void {
    this.fetchMunicipios();
  }

  fetchMunicipios() {
    this.loading = true;

    this.citiesService.getAllMunicipios().subscribe({
      next: (res) => {
        this.municipios = res.data;
        this.filteredMunicipios = [...this.municipios];
        this.loading = false;

      },
      error: (err) => {
        console.error('Error al obtener municipios', err);
        this.loading = false;

      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredMunicipios = this.municipios.filter(m =>
      m.nombre?.toLowerCase().includes(term) || m.nombreDepartamento?.toLowerCase().includes(term)
    );
  }

  openCityModal(muni?: CitiesResponseDto) {
    const modalRef = this.modalService.open(CreateLocationModalComponent, {
      centered: true,
      backdrop: 'static',
      windowClass: 'custom-modal-size modal-xl'
    });

    modalRef.componentInstance.type = 'municipio';

    // Pasar entidad si es edición
    if (muni) {
      modalRef.componentInstance.entityToEdit = muni;
    }

    modalRef.result.then(() => {
      this.fetchMunicipios();
    }).catch(() => { });
  }

  onDeleteMunicipio(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción marcará el municipio como inactivo.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d69130ff',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.citiesService.deleteMunicipio(id).subscribe({
          next: (res) => {
            Swal.fire('¡Eliminado!', res.message, 'success');
            this.fetchMunicipios(); // refresca la lista
          },
          error: (err) => {
            console.error('Error eliminando municipio', err);
            Swal.fire('Error', err.error?.message || 'Error al eliminar el municipio', 'error');
          }
        });
      }
    });
  }


}
