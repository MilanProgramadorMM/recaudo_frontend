import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PageTitleComponent } from "@components/page-title.component";
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'solar-icons',
  standalone: true,
  imports: [PageTitleComponent,NgbTooltipModule],
  templateUrl: './solar-icons.component.html',
  styles: ``,
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class SolarIconsComponent {

}
