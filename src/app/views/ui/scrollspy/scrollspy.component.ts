import { Component } from '@angular/core';
import { PageTitleComponent } from '@components/page-title.component';
import { NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'scrollspy',
  standalone: true,
  imports: [NgbScrollSpyModule,PageTitleComponent],
  templateUrl: './scrollspy.component.html',
  styles: ``
})
export class ScrollspyComponent {

}
