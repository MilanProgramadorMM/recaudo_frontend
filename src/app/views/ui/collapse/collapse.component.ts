import { Component } from '@angular/core';
import { PageTitleComponent } from "@components/page-title.component";
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'collapse',
  standalone: true,
  imports: [PageTitleComponent,NgbCollapseModule],
  templateUrl: './collapse.component.html',
  styles: ``
})
export class CollapseComponent {
  isCollapsed = true
  isHorizontal = true
  isFirstToggle = true
  isSecondToggle = true
}
