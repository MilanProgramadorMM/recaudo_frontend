import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { PageTitleComponent } from "../../../components/page-title.component";
import { ComposeComponent } from "./components/compose/compose.component";
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { EmailListComponent } from "./components/email-list/email-list.component";

@Component({
  selector: 'email',
  standalone: true,
  imports: [PageTitleComponent, ComposeComponent, EmailListComponent],
  templateUrl: './email.component.html',
  styles: ``,
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
})
export class EmailComponent {

  public offCanvas = inject(NgbOffcanvas)

  onSidebarButtonClicked() {
    this.offCanvas.open(ComposeComponent, {
      position: 'start',
      backdrop: true,
    })
  }
}
