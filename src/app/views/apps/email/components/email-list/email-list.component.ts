import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, inject, Output, type TemplateRef } from '@angular/core';
import { NgbModal, NgbModalModule, NgbTooltipModule, type NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { emailsData } from '../../data';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'email-list',
  standalone: true,
  imports: [NgbTooltipModule,DatePipe,NgbModalModule],
  templateUrl: './email-list.component.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EmailListComponent {
  @Output() composeButtonClicked = new EventEmitter();
  private modalService = inject(NgbModal)

  emails = emailsData
  openComposeSidebar() {
    this.composeButtonClicked.emit();
  }
  openModal(content: TemplateRef<HTMLElement>, options: NgbModalOptions) {
    this.modalService.open(content, options)
  }


}
