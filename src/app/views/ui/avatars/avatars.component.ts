import { Component } from '@angular/core';
import { PageTitleComponent } from "@components/page-title.component";
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'avatars',
  standalone: true,
  imports: [PageTitleComponent,NgbTooltipModule],
  templateUrl: './avatars.component.html',
  styles: ``
})
export class AvatarsComponent {

}
