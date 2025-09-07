import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageTitleComponent } from '@components/page-title.component';
import { FormComponent } from '../form/form.component';
import { ServiceQuotaResponseDto, ServiceQuotaService } from '@core/services/service-quota.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-service-quota',
  imports: [
    CommonModule,
    FormsModule,
    PageTitleComponent],
  templateUrl: './service-quota.component.html',
  styleUrl: './service-quota.component.scss'
})
export class ServiceQuotaComponent {
  serviceQuotaResponse: ServiceQuotaResponseDto[] = [];
    filteredServiceCuota: ServiceQuotaResponseDto[] = [];
    searchTerm: string = '';
  
    constructor(private service: ServiceQuotaService,
      private modalService: NgbModal
    ) { }
  
    ngOnInit(): void {
      this.fetchServiceQuota();
    }
  
    fetchServiceQuota(): void {
      this.service.getAll().subscribe({
        next: (response) => {
          this.serviceQuotaResponse = response.data;
          this.filteredServiceCuota = [...this.serviceQuotaResponse];
        },
        error: (err) => {
          console.error('Error al obtener cargos por servicios', err);
        }
      });
    }
  
    applyFilter(): void {
      const term = this.searchTerm.toLowerCase();
      this.filteredServiceCuota = this.serviceQuotaResponse.filter(p =>
        p.name.toLowerCase().includes(term)
      );
    }
  
    serviceQuotaModal(data?: ServiceQuotaResponseDto) {
      const modalRef = this.modalService.open(FormComponent, {
        centered: true,
        backdrop: 'static',
        windowClass: 'custom-modal-size modal-lg'
      });
  
      modalRef.componentInstance.type = 'service_quota';
  
      if (data) {
        modalRef.componentInstance.entityToEdit = data;
      }
  
      modalRef.result.then(() => {
        this.fetchServiceQuota();
      }).catch(() => { });
    }
  
    onDeleteTypeServiceQuota(id: number): void {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción marcará al tipo de de cargo por servicio como inactiva.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#d69130ff',
        cancelButtonColor: '#3085d6'
      }).then((result) => {
        if (result.isConfirmed) {
          this.service.delete(id).subscribe({
            next: (res) => {
              Swal.fire('¡Eliminado!', res.message, 'success');
              this.fetchServiceQuota();
            },
            error: (err) => {
              console.error('Error eliminando tipo de de cargo por servicio', err);
              Swal.fire('Error', err.error?.message || 'Error al eliminar tipo de amortizacion', 'error');
            }
          });
        }
      });
    }
}
