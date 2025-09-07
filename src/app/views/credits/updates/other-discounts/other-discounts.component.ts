import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageTitleComponent } from '@components/page-title.component';
import { OtherDiscountsDto, OtherDiscountsService } from '@core/services/other-discounts.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormComponent } from '../form/form.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-other-discounts',
  imports: [
    CommonModule,
    FormsModule,
    PageTitleComponent],
  templateUrl: './other-discounts.component.html',
  styleUrl: './other-discounts.component.scss'
})
export class OtherDiscountsComponent {
  otherDiscounts: OtherDiscountsDto[] = [];
  filteredDiscount: OtherDiscountsDto[] = [];
  searchTerm: string = '';

  constructor(private service: OtherDiscountsService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.fetchDiscounts();
  }

  fetchDiscounts(): void {
    this.service.getAll().subscribe({
      next: (response) => {
        this.otherDiscounts = response.data;
        this.filteredDiscount = [...this.otherDiscounts];
      },
      error: (err) => {
        console.error('Error al obtener descuentos', err);
      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredDiscount = this.otherDiscounts.filter(p =>
      p.name.toLowerCase().includes(term)
    );
  }

  discountsTypenModal(data?: OtherDiscountsDto) {
    const modalRef = this.modalService.open(FormComponent, {
      centered: true,
      backdrop: 'static',
      windowClass: 'custom-modal-size modal-lg'
    });

    modalRef.componentInstance.type = 'other_discounts';

    if (data) {
      modalRef.componentInstance.entityToEdit = data;
    }

    modalRef.result.then(() => {
      this.fetchDiscounts();
    }).catch(() => { });
  }

  onDeleteTypeDiscounts(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción marcará al tipo de descuento como inactiva.',
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
            this.fetchDiscounts();
          },
          error: (err) => {
            console.error('Error eliminando tipo de descuento', err);
            Swal.fire('Error', err.error?.message || 'Error al eliminar tipo de amortizacion', 'error');
          }
        });
      }
    });
  }
}
