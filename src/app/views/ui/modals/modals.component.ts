import { Component, inject, type TemplateRef } from '@angular/core';
import { PageTitleComponent } from "@components/page-title.component";
import { RouterLink } from '@angular/router';
import { NgbModal, NgbModalModule, type NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'modals',
  standalone: true,
  imports: [PageTitleComponent,NgbModalModule,FormsModule,RouterLink],
  templateUrl: './modals.component.html',
  styles: ``
})
export class ModalsComponent {
  private modalService = inject(NgbModal)

  name: string = ''

  open(content: TemplateRef<any>) {
    this.modalService.open(content)
  }

  openModal(content: TemplateRef<HTMLElement>, options: NgbModalOptions) {
    this.modalService.open(content, options)
  }

  openvaryingModal(content: TemplateRef<HTMLElement>, name: string) {
    this.modalService.open(content)
    this.name = name
  }
}
