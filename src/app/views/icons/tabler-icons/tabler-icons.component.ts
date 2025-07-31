import { Component } from '@angular/core';
import { PageTitleComponent } from "@components/page-title.component";
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tabler-icons',
  standalone: true,
  imports: [PageTitleComponent,NgbTooltipModule],
  templateUrl: './tabler-icons.component.html',
  styles: ``
})
export class TablerIconsComponent {

}
