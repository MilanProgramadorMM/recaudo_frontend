import { Component } from '@angular/core';
import { PageTitleComponent } from "@components/page-title.component";
import { patientsData } from './data';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'patients',
  standalone: true,
  imports: [PageTitleComponent, NgbPaginationModule],
  templateUrl: './patients.component.html',
  styles: ``
})
export class PatientsComponent {
  patients = patientsData
  size = 10
}
