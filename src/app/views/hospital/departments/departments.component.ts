import { Component } from '@angular/core';
import { PageTitleComponent } from "@components/page-title.component";
import { departmentData } from './data';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'departments',
  standalone: true,
  imports: [PageTitleComponent,NgbTooltipModule],
  templateUrl: './departments.component.html',
  styles: ``
})
export class DepartmentsComponent {
  departments = departmentData
}
