import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from '@components/page-title.component';
import { NgbModal, NgbPaginationModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { DeparmentService, DepartamentoResponseDto } from '@core/services/department.service';
import { CreateLocationModalComponent } from "../create-location-modal/create-location-modal.component";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-department-component',
  standalone: true,
  imports: [PageTitleComponent, NgbPaginationModule, NgbModalModule, CommonModule, FormsModule],
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})
export class DepartmentComponent {
  departments: DepartamentoResponseDto[] = [];
  filteredDepartments: DepartamentoResponseDto[] = [];
  searchTerm: string = '';
  page = 1;
  pageSize = 10;

  loading: boolean = false;


  newDepartment: DepartamentoResponseDto = { id: 0, nombre: '', nombrePais: '', idPais: 0 };

  constructor(private modalService: NgbModal, private departmentService: DeparmentService) { }

  ngOnInit(): void {
    this.fetchDepartments();
  }

  fetchDepartments() {
    this.loading = true;
    this.departmentService.getAllDepartments().subscribe({
      next: (response) => {
        this.departments = response.data;
        this.filteredDepartments = [...this.departments];
        this.page = 1; 

        this.loading = false;

      },
      error: (error) => {
        console.error('Error al obtener departamentos', error);
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredDepartments = this.departments.filter(d =>
      d.nombre?.toLowerCase().includes(term) || d.nombrePais?.toLowerCase().includes(term)
    );
    this.page = 1; 

  }

    get pagedDeparment(): DepartamentoResponseDto[] {
      const start = (this.page - 1) * this.pageSize;
      return this.filteredDepartments.slice(start, start + this.pageSize);
    }

  openDepartmentModal(dept?: DepartamentoResponseDto) {
    const modalRef = this.modalService.open(CreateLocationModalComponent, {
      centered: true,
      backdrop: 'static',
      windowClass: 'custom-modal-size modal-lg'
    });

    modalRef.componentInstance.type = 'departamento';

    // Pasar entidad si es edición
    if (dept) {
      modalRef.componentInstance.entityToEdit = dept;
    }

    modalRef.result.then(() => {
      this.fetchDepartments();
    }).catch(() => { });
  }


  onDeleteDepartamento(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción marcará el departamento como inactivo.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d69130ff',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.departmentService.deleteDepartamento(id).subscribe({
          next: (res) => {
            Swal.fire('¡Eliminado!', res.message, 'success');
            this.fetchDepartments(); // método que recargue la lista de departamentos
          },
          error: (err) => {
            console.error('Error eliminando departamento', err);
            Swal.fire('Error', err.error?.message || 'Error al eliminar el departamento', 'error');
          }
        });
      }
    });
  }

}
