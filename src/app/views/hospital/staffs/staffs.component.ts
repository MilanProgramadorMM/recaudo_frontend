import { Component } from '@angular/core';
import { PageTitleComponent } from "../../../components/page-title.component";
import { staffData } from './data';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'staffs',
  standalone: true,
  imports: [PageTitleComponent,NgbPagination],
  templateUrl: './staffs.component.html',
  styles: ``
})
export class StaffsComponent {
  staffData = staffData

  page = 4
}
