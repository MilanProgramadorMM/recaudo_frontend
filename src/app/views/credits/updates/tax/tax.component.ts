import { Component } from '@angular/core';
import { TaxTypeDto, TaxTypeService } from '@core/services/tax-type.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageTitleComponent } from '@components/page-title.component';
import { FormComponent } from '../form/form.component';

@Component({
  selector: 'app-tax',
  imports: [
    CommonModule,
    FormsModule,
    PageTitleComponent
  ],
  templateUrl: './tax.component.html',
})
export class TaxComponent {
  taxtype: TaxTypeDto[] = [];
  filteredTax: TaxTypeDto[] = [];
  searchTerm: string = '';

  constructor(private taxservice: TaxTypeService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.fetchTax();
  }

  fetchTax(): void {
    this.taxservice.getAll().subscribe({
      next: (response) => {
        this.taxtype = response.data;
        this.filteredTax = [...this.taxtype];
      },
      error: (err) => {
        console.error('Error al obtener tasas', err);
      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredTax = this.taxtype.filter(p =>
      p.name.toLowerCase().includes(term)
    );
  }

  taxTypenModal(data?: TaxTypeDto) {
    const modalRef = this.modalService.open(FormComponent, {
      centered: true,
      backdrop: 'static',
      windowClass: 'custom-modal-size modal-lg'
    });

    modalRef.componentInstance.type = 'tax_type';

    if (data) {
      modalRef.componentInstance.entityToEdit = data;
    }

    modalRef.result.then(() => {
      this.fetchTax();
    }).catch(() => { });
  }

  onDeleteTypeTax(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción marcará al tipo de tasa como inactiva.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d69130ff',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.taxservice.delete(id).subscribe({
          next: (res) => {
            Swal.fire('¡Eliminado!', res.message, 'success');
            this.fetchTax();
          },
          error: (err) => {
            console.error('Error eliminando tipo de tasa', err);
            Swal.fire('Error', err.error?.message || 'Error al eliminar tipo de amortizacion', 'error');
          }
        });
      }
    });
  }
}
