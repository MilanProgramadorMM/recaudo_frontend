import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ContactInfoService } from '@core/services/contactInfo.service';
import { PersonRegisterDto } from '@core/services/person.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateContactInfoComponent } from '../../update-contact-info/update-contact-info/update-contact-info.component';

@Component({
  selector: 'app-list-contact-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-contact-info.component.html',
  styleUrls: ['./list-contact-info.component.scss'],
})
export class ListContactInfoComponent {
  @Input() person!: PersonRegisterDto;
  contactInfoList: any[] = [];
  noContactInfoMessage: string = '';


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
    if (personId == null) {
      this.noContactInfoMessage = 'No se ha seleccionado una persona.';
      return;
    }
    this.contactInfoService.getContactInfoByPersonId(personId).subscribe({
      next: (res) => {
        if (!res.data || res.data.length === 0) {
          this.contactInfoList = [];
          this.noContactInfoMessage = 'La persona no tiene aún información de contacto registrada.';
        } else {
          this.contactInfoList = res.data;
          this.noContactInfoMessage = '';
        }
      },
      error: (err) => {
        console.error(err);
        this.noContactInfoMessage = 'Ocurrió un error al cargar la información de contacto.';
      }
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
      () => { /* cerrado sin guardar */ }
    );
  }


}
