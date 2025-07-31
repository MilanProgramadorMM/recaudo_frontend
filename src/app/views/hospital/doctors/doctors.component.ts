import { Component } from '@angular/core';
import { PageTitleComponent } from "@components/page-title.component";
import { doctorListData } from './data';
import { RouterLink } from '@angular/router';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'doctors',
  standalone: true,
  imports: [PageTitleComponent,RouterLink,NgbPaginationModule,RouterLink],
  templateUrl: './doctors.component.html',
  styles: ``
})
export class DoctorsComponent {
  doctors = doctorListData

  page=4
}
