import { Component } from '@angular/core';
import { PageTitleComponent } from "@components/page-title.component";
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tooltips',
  standalone: true,
  imports: [PageTitleComponent,NgbTooltipModule],
  templateUrl: './tooltips.component.html',
  styles: ``
})
export class TooltipsComponent {

}
