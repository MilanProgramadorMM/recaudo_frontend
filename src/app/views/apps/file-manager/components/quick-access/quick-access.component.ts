import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { NgbDropdownModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import type { QuickAccessType } from '../../data';

@Component({
  selector: 'quick-access',
  standalone: true,
  imports: [NgbProgressbarModule, NgbDropdownModule],
  templateUrl: './quick-access.component.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class QuickAccessComponent {

  isActive = false

  toggle() {
    this.isActive = !this.isActive;
  }

  @Input() file: QuickAccessType = {
    icon: '',
    title: '',
    files: 1,
    progress: 1,
    storage: 1,
    variant: '',
  };
}
