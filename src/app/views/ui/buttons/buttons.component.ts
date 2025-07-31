import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { PageTitleComponent } from "../../../components/page-title.component";

@Component({
  selector: 'buttons',
  standalone: true,
  imports: [NgbDropdownModule, PageTitleComponent],
  templateUrl: './buttons.component.html',
  styles: ``,
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ButtonsComponent {

}
