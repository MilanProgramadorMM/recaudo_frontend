import { Component } from '@angular/core';
import { PageTitleComponent } from "@components/page-title.component";
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'popovers',
  standalone: true,
  imports: [PageTitleComponent,NgbPopoverModule],
  templateUrl: './popovers.component.html',
  styles: ``
})
export class PopoversComponent {

}
