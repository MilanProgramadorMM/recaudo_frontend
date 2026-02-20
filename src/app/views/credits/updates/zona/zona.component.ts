import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageTitleComponent } from '@components/page-title.component';
import { ZonaResponseDto, ZonaService } from '@core/services/zona.service';
import { NgbModal, NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateRoleComponent } from '@views/configuration/maestro-roles/create-rol/create-role/create-role.component';
import { UserConfigPermisionsComponent } from '@views/configuration/user-config-permisions/user-config-permisions.component';
import { CreateZonaComponent } from './create-zona/create-zona.component';
import Swal from 'sweetalert2';
import { OrderCustomerComponent } from './order-customer/order-customer.component';

@Component({
  selector: 'app-zona',
  imports: [
    PageTitleComponent,
    NgbPaginationModule,
    NgbModalModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './zona.component.html',
  styleUrl: './zona.component.scss'
})
export class ZonaComponent {
  zonas: ZonaResponseDto[] = [];
  filteredZonas: ZonaResponseDto[] = [];
  searchTerm: string = '';
  page = 1;
  showModal = false;

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  constructor(
    private modalService: NgbModal,
    private zonaService: ZonaService
  ) { }

  ngOnInit(): void {
    this.fetchZonas();
  }

  fetchZonas() {
    this.zonaService.getAll().subscribe({
      next: (response) => {
        this.zonas = response.data;
        this.filteredZonas = [...this.zonas];
      },
      error: (error) => {
        console.error('Error al obtener users', error);
      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredZonas = this.zonas.filter(zonas =>
    ((
      String(zonas.value).toLowerCase().includes(term)
    )));
  }

  openZonaModal(id?: number) {
    if (id) {
      this.zonaService.getAll().subscribe({
        next: (res) => {
          const zonaToEdit = res.data.find(z => z.id === id);
          if (!zonaToEdit) return;

          const modalRef = this.modalService.open(CreateZonaComponent, {
            centered: true,
            backdrop: 'static',
            size: 'lg'
          });

          modalRef.componentInstance.zonaToEdit = zonaToEdit;

          modalRef.result.then((res) => {
            if (res) {
              this.fetchZonas(); // refrescas la lista
            }
          }).catch(() => { });
        }
      });
    } else {
      const modalRef = this.modalService.open(CreateZonaComponent, {
        centered: true,
        backdrop: 'static',
        size: 'lg'
      });

      modalRef.result.then((res) => {
        if (res) {
          this.fetchZonas();
        }
      }).catch(() => { });
    }
  }

  openClientesByZona(zona: ZonaResponseDto) {
    const modalRef = this.modalService.open(OrderCustomerComponent, {
      size: 'xl',
      backdrop: 'static',
          windowClass: 'custom-modal-xl'  // clase personalizada

    });
    modalRef.componentInstance.zonaId = zona.id;
    modalRef.componentInstance.zonaValue = zona.value;
  }

  onDeleteZona(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción marcará la Zona como inactiva.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.zonaService.delete(id).subscribe({
          next: (res) => {
            Swal.fire('¡Eliminado!', res.message, 'success');
            this.fetchZonas();
          },
          error: (err) => {
            console.error('Error eliminando Zona', err);
            Swal.fire('Error', err.error?.message || 'Error al eliminar la Zona', 'error');
          }
        });
      }
    });
  }

}
