import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { PageTitleComponent } from '@components/page-title.component';
import { CreditLineDto, CreditLineService } from '@core/services/creditLine.service';
import { FormLineComponent } from '../form-line/form-line.component';

@Component({
  selector: 'app-lineas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageTitleComponent
  ],
  templateUrl: './lineas.component.html',
  styleUrls: ['./lineas.component.scss']
})
export class LineasComponent {
  creditLines: CreditLineDto[] = [];
  filteredLines: CreditLineDto[] = [];
  searchTerm: string = '';

  constructor(
    private creditLineService: CreditLineService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.fetchLines();
  }

  fetchLines(): void {
    this.creditLineService.getAll().subscribe({
      next: (response) => {
        this.creditLines = response.data;
        this.filteredLines = [...this.creditLines];
      },
      error: (err) => {
        console.error('Error al obtener líneas de crédito', err);
      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredLines = this.creditLines.filter(line =>
      line.name.toLowerCase().includes(term)
    );
  }

  LineModal(data?: CreditLineDto) {
    const modalRef = this.modalService.open(FormLineComponent, {
      centered: true,
      backdrop: 'static',
      windowClass: 'custom-modal-size modal-lg'
    });

    if (data) {
      modalRef.componentInstance.lineData = data;
    }

    modalRef.result.then(() => {
      this.fetchLines();
    }).catch(() => { });
  }

  onDeleteLine(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esto marcará la línea como inactiva.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#e83131ff',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        // Más adelante cuando tengas el endpoint delete
        // this.creditLineService.delete(id).subscribe(...)
        Swal.fire('¡Eliminado!', 'La línea fue eliminada.', 'success');
      }
    });
  }
}
