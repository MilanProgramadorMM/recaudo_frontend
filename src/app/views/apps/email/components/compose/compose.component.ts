import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, inject, Output, type TemplateRef } from '@angular/core';
import { NgbCollapseModule, NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { QuillEditorComponent } from 'ngx-quill'

@Component({
  selector: 'compose',
  standalone: true,
  imports: [NgbCollapseModule,QuillEditorComponent],
  templateUrl: './compose.component.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComposeComponent {
  isCollapsed = false;
  isCollapsed2 = false;

  private offCanvas = inject(NgbOffcanvas);

  close() {
    this.offCanvas.dismiss();
  }

  private modalService = inject(NgbModal);


	open(content: TemplateRef<any>) {
		this.modalService.open(content, { size:"lg" ,centered:true})
  }

  content: string = ` Writing something...`
}
