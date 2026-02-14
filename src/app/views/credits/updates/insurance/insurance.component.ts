import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageTitleComponent } from '@components/page-title.component';
import { InsuranceResponseDto, InsuranceService } from '@core/services/insurance.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormComponent } from '../form/form.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-insurance',
  imports: [
    CommonModule,
    FormsModule,
    PageTitleComponent],
  templateUrl: './insurance.component.html',
  styleUrl: './insurance.component.scss'
})
export class InsuranceComponent {
  insuranceResponseDto: InsuranceResponseDto[] = [];
  filteredInsurance: InsuranceResponseDto[] = [];
  searchTerm: string = '';

  constructor(private service: InsuranceService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.fetchInsurance();
  }

  fetchInsurance(): void {
    this.service.getAll().subscribe({
      next: (response) => {
        this.insuranceResponseDto = response.data;
        this.filteredInsurance = [...this.insuranceResponseDto];
      },
      error: (err) => {
        console.error('Error al obtener seguros', err);
      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredInsurance = this.insuranceResponseDto.filter(p =>
      p.name.toLowerCase().includes(term)
    );
  }

  insuranceModal(data?: InsuranceResponseDto) {
    const modalRef = this.modalService.open(FormComponent, {
      centered: true,
      backdrop: 'static',
      windowClass: 'custom-modal-size modal-lg'
    });

    modalRef.componentInstance.type = 'insurance';

    if (data) {
      modalRef.componentInstance.entityToEdit = data;
    }

    modalRef.result.then(() => {
      this.fetchInsurance();
    }).catch(() => { });
  }

  // onDeleteTypeServiceQuota(id: number): void {
  //   Swal.fire({
  //     title: '¿Estás seguro?',
  //     text: 'Esta acción marcará al tipo de seguro como inactivo.',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Sí, eliminar',
  //     cancelButtonText: 'Cancelar',
  //     confirmButtonColor: '#d69130ff',
  //     cancelButtonColor: '#3085d6'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.service.delete(id).subscribe({
  //         next: (res) => {
  //           Swal.fire('¡Eliminado!', res.message, 'success');
  //           this.fetchInsurance();
  //         },
  //         error: (err) => {
  //           console.error('Error eliminando tipo de seguro', err);
  //           Swal.fire('Error', err.error?.message || 'Error al eliminar tipo de seguro', 'error');
  //         }
  //       });
  //     }
  //   });
  // }
}
