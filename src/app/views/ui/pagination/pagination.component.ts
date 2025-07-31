import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PageTitleComponent } from "@components/page-title.component";
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pagination',
  standalone: true,
  imports: [PageTitleComponent,NgbPaginationModule],
  templateUrl: './pagination.component.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PaginationComponent {

}
