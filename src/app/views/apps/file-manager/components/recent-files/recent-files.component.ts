import { Component } from '@angular/core';
import { filesData } from '../../data';
import { DatePipe } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'recent-files',
  standalone: true,
  imports: [DatePipe,NgbDropdownModule],
  templateUrl: './recent-files.component.html',
  styles: ``
})
export class RecentFilesComponent {
  files = filesData
}
