import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { filesData } from '../../data';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'checkup-files',
  standalone: true,
  imports: [NgbDropdownModule],
  templateUrl: './checkup-files.component.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CheckupFilesComponent {
  checkupFiles = filesData
}
