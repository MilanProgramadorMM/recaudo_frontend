import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PageTitleComponent } from "@components/page-title.component";
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'maestro-modulos', // Cambiado
  standalone: true,
  imports: [PageTitleComponent, NgbAccordionModule],
  templateUrl: './maestro-modulos.component.html', // Cambiado
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MaestroModulosComponent { // Cambiado
  accordionData = ['first', 'second', 'third'];
}
