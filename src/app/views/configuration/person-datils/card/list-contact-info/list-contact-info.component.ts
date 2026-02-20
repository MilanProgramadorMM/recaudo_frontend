import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContactInfoService } from '@core/services/contactInfo.service';
import { PersonRegisterDto } from '@core/services/person.service';
import { UpdateContactInfoComponent } from '../../update-contact-info/update-contact-info/update-contact-info.component';

@Component({
  selector: 'app-list-contact-info',
  standalone: true,
  imports: [],
  templateUrl: './list-contact-info.component.html',
  styleUrls: ['./list-contact-info.component.scss'],
})
export class ListContactInfoComponent {
  @Input() person!: PersonRegisterDto;
  contactInfoList: any[] = [];
  noContactInfoMessage: string = '';

  @ViewChild('confirmDelete', { static: true }) confirmDeleteTpl!: TemplateRef<any>;
  @ViewChild('successalert', { static: true }) successAlertTpl!: TemplateRef<any>;
  @ViewChild('erroralert', { static: true }) errorAlertTpl!: TemplateRef<any>;

  deleteTarget: any = null;
  successDetails: string = '';
  lastErrorMessage: string = '';
  loading: boolean = false;


  constructor(
    private contactInfoService: ContactInfoService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    if (this.person?.id) {
      this.loadContactInfoList(this.person.id);
    }
  }

  loadContactInfoList(personId?: number) {
    if (!personId) {
      this.noContactInfoMessage = 'No se ha seleccionado una persona.';
      this.loading = false; 
      return;
    }

    this.loading = true;
    this.contactInfoList = []; 

    this.contactInfoService.getContactInfoByPersonId(personId).subscribe({
      next: (res) => {
        this.contactInfoList = res.data || [];
        this.noContactInfoMessage = this.contactInfoList.length === 0
          ? 'La persona no tiene aún información de contacto registrada.'
          : '';
        this.loading = false; 
      },
      error: () => {
        this.loading = false;
        this.noContactInfoMessage = 'Ocurrió un error al cargar la información.';
      },
    });
  }


  editContactInfo(item: any) {
    const modalRef = this.modalService.open(UpdateContactInfoComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });

    modalRef.componentInstance.contactInfo = item; // enviamos el item al modal
    modalRef.componentInstance.person = this.person; // por si necesitas personId

    modalRef.result.then(
      () => {
        if (this.person?.id != null) {
          this.loadContactInfoList(this.person.id);
        } else {
          console.warn('No se pudo recargar la lista porque no hay personId definido.');
        }
      },
      () => { }
    );
  }
  // Abre modal de confirmación
  deleteContactInfo(item: any) {
    this.deleteTarget = item;
    this.modalService.open(this.confirmDeleteTpl, {
      centered: true,
      size: 'sm',
      backdrop: 'static',
    });
  }

  // Acción al confirmar
  onConfirmDelete(modalRef: any) {
    if (!this.deleteTarget) return;
    const id = this.deleteTarget.id;

    this.contactInfoService.deleteContactInfo(id).subscribe({
      next: (res) => {
        modalRef.close(); // cerramos confirm
        this.successDetails = res.details || 'Información eliminada correctamente';
        this.modalService.open(this.successAlertTpl, { centered: true, size: 'sm', backdrop: 'static' });

        if (this.person?.id) {
          this.loadContactInfoList(this.person.id);
        }
      },
      error: (err) => {
        modalRef.close(); // cerramos confirm
        this.lastErrorMessage = err?.error?.details || 'Error eliminando contacto';
        this.modalService.open(this.errorAlertTpl, { centered: true, size: 'sm' });
      },
    });
  }

  isPrincipal(typeName: string): boolean {
    if (!typeName) return false;
    const principales = [
      'CORREO PRINCIPAL',
      'CELULAR PRINCIPAL',
      'TELÉFONO PRINCIPAL',
      'DIRECCIÓN PRINCIPAL'
    ];
    return principales.includes(typeName.toUpperCase());
  }

}
