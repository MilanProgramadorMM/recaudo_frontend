import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { PageTitleComponent } from "../../../components/page-title.component";
import { toSentenceCase } from '@core/helper/change-casing';

@Component({
  selector: 'dropdowns',
  standalone: true,
  imports: [NgbDropdownModule, PageTitleComponent],
  templateUrl: './dropdowns.component.html',
  styles: ``,
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
})
export class DropdownsComponent {
colorVariants=['primary','secondary','success','info','warning','danger']
toSentenceCase=toSentenceCase
}
