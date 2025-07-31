import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PageTitleComponent } from "../../../components/page-title.component";

@Component({
  selector: 'timeline',
  standalone: true,
  imports: [PageTitleComponent],
  templateUrl: './timeline.component.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TimelineComponent {

}
