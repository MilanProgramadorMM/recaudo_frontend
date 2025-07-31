import { Component, inject } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'side-panel',
  standalone: true,
  imports: [],
  templateUrl: './side-panel.component.html',
  styles: ``
})
export class SidePanelComponent {
  private offCanvas = inject(NgbOffcanvas);

  close() {
    this.offCanvas.dismiss();
  }
}
