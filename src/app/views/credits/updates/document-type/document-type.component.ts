import { Component } from '@angular/core';
import { DocumentService, DocumentTypeResponseDto } from '@core/services/documentType.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormComponent } from '../form/form.component';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageTitleComponent } from '@components/page-title.component';

@Component({
  selector: 'app-document-type',
  imports: [CommonModule,
    FormsModule,
    PageTitleComponent],
  templateUrl: './document-type.component.html',
  styleUrl: './document-type.component.scss'
})
export class DocumentTypeComponent {
  documentType: DocumentTypeResponseDto[] = [];
  filteredDocument: DocumentTypeResponseDto[] = [];
  searchTerm: string = '';

  constructor(private documentService: DocumentService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.fetchTypeDocument();
  }

  fetchTypeDocument(): void {
    this.documentService.getAll().subscribe({
      next: (response) => {
        this.documentType = response.data;
        this.filteredDocument = [...this.documentType];
      },
      error: (err) => {
        console.error('Error al obtener tipos de documentos', err);
      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredDocument = this.documentType.filter(p =>
      p.name.toLowerCase().includes(term)
    );
  }

  documentTypeModal(data?: DocumentTypeResponseDto) {
    const modalRef = this.modalService.open(FormComponent, {
      centered: true,
      backdrop: 'static',
      windowClass: 'custom-modal-size modal-lg'
    });

    modalRef.componentInstance.type = 'document_type';

    if (data) {
      modalRef.componentInstance.entityToEdit = data;
    }

    modalRef.result.then(() => {
      this.fetchTypeDocument();
    }).catch(() => { });
  }

  onDeleteTypeTax(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción marcará al tipo de documento como inactivo.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d69130ff',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.documentService.delete(id).subscribe({
          next: (res) => {
            Swal.fire('¡Eliminado!', res.message, 'success');
            this.fetchTypeDocument();
          },
          error: (err) => {
            console.error('Error eliminando tipo de documento', err);
            Swal.fire('Error', err.error?.message || 'Error al eliminar tipo de documento', 'error');
          }
        });
      }
    });
  }
}
