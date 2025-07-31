import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PageTitleComponent } from "@components/page-title.component";
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tabs',
  standalone: true,
  imports: [PageTitleComponent,NgbNavModule],
  templateUrl: './tabs.component.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TabsComponent {

}
