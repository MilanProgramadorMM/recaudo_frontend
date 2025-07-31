import { Component } from '@angular/core';
import { PageTitleComponent } from "@components/page-title.component";
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [PageTitleComponent, NgbProgressbarModule],
  templateUrl: './progress.component.html',
  styles: ``
})
export class ProgressComponent {

}
