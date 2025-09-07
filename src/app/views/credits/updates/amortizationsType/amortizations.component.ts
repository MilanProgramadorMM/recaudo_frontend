import { Component } from '@angular/core';
import { AmortizationDto, AmortizationService } from '@core/services/amortizationType.service';
import { PageTitleComponent } from "@components/page-title.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormComponent } from '../form/form.component';


@Component({
  selector: 'app-amortizations',
  imports: [
    CommonModule,
    FormsModule,
    PageTitleComponent],
  templateUrl: './amortizations.component.html',
})
export class AmortizationsComponent {
  amortizations: AmortizationDto[] = [];
  filteredAmortizations: AmortizationDto[] = [];
  searchTerm: string = '';

  constructor(private amortizationService: AmortizationService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.fetchAmortizations();
  }

  fetchAmortizations(): void {
    this.amortizationService.getAll().subscribe({
      next: (response) => {
        this.amortizations = response.data;
        this.filteredAmortizations = [...this.amortizations];
      },
      error: (err) => {
        console.error('Error al obtener amortizaciones', err);
      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredAmortizations = this.amortizations.filter(p =>
      p.name.toLowerCase().includes(term)
    );
  }

  openAmortizatioTypenModal(data?: AmortizationDto) {
    const modalRef = this.modalService.open(FormComponent, {
      centered: true,
      backdrop: 'static',
      windowClass: 'custom-modal-size modal-lg'
    });

    modalRef.componentInstance.type = 'amortization_type';

    if (data) {
      modalRef.componentInstance.entityToEdit = data;
    }

    modalRef.result.then(() => {
      this.fetchAmortizations();
    }).catch(() => { });
  }

  onDeleteTypeAmortization(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción marcará al tipo de amortizacion como inactiva.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d69130ff',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.amortizationService.delete(id).subscribe({
          next: (res) => {
            Swal.fire('¡Eliminado!', res.message, 'success');
            this.fetchAmortizations();
          },
          error: (err) => {
            console.error('Error eliminando tipo de amortizacion', err);
            Swal.fire('Error', err.error?.message || 'Error al eliminar tipo de amortizacion', 'error');
          }
        });
      }
    });
  }
}
