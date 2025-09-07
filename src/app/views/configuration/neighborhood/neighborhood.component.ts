import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageTitleComponent } from '@components/page-title.component';
import { BarrioResponseDto, BarrioService } from '@core/services/neighborhood.service';
import { NgbModal, NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateLocationModalComponent } from '../create-location-modal/create-location-modal.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-neighborhood',
  imports: [PageTitleComponent, NgbPaginationModule, NgbModalModule, CommonModule, FormsModule],
  templateUrl: './neighborhood.component.html',
  styleUrl: './neighborhood.component.scss'
})
export class NeighborhoodComponent {
  barrios: BarrioResponseDto[] = [];
  filteredBarrios: BarrioResponseDto[] = [];
  searchTerm: string = '';
  page = 1;
  loading: boolean = false;


  newBarrio: BarrioResponseDto = { id: 0, nombre: '', nombreMunicipio: '', idMunicipio: 0, nombreDepartamento: '', nombrePais: '' };

  constructor(private modalService: NgbModal, private barrioService: BarrioService) { }

  ngOnInit(): void {
    this.fetchBarrios();
  }

  fetchBarrios() {
    this.loading = true;
    this.barrioService.getAllBarrios().subscribe({
      next: (res) => {
        this.barrios = res.data;
        this.filteredBarrios = [...this.barrios];
        this.loading = false;

      },
      error: (err) => {
        console.error('Error al obtener barrios', err);
        this.loading = false;

      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredBarrios = this.barrios.filter(b =>
      b.nombre?.toLowerCase().includes(term) ||
      b.nombreMunicipio?.toLowerCase().includes(term) ||
      b.nombreDepartamento?.toLowerCase().includes(term)
    );
  }

  openBarrioModal(barrio?: BarrioResponseDto) {
    const modalRef = this.modalService.open(CreateLocationModalComponent, {
      centered: true,
      backdrop: 'static',
      windowClass: 'custom-modal-size modal-xl'
    });

    modalRef.componentInstance.type = 'barrio';

    // Pasar entidad si es edición
    if (barrio) {
      modalRef.componentInstance.entityToEdit = barrio;
    }

    modalRef.result.then(() => {
      this.fetchBarrios();
    }).catch(() => { });
  }

  saveBarrio() {
    //this.barrioService.createOrUpdate(this.newBarrio).subscribe(() => this.fetchBarrios());
    this.modalService.dismissAll();
  }

  onDeleteBarrio(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción marcará el barrio como inactivo.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d69130ff',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.barrioService.deleteBarrio(id).subscribe({
          next: (res) => {
            Swal.fire('¡Eliminado!', res.message, 'success');
            this.fetchBarrios(); // método que recargue la lista de barrios
          },
          error: (err) => {
            console.error('Error eliminando barrio', err);
            Swal.fire('Error', err.error?.message || 'Error al eliminar el barrio', 'error');
          }
        });
      }
    });
  }

}
