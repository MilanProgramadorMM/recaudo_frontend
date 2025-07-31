import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { doctorsData } from '../../data';

@Component({
  selector: 'doctors',
  standalone: true,
  imports: [NgbDropdownModule],
  templateUrl: './doctors.component.html',
  styles: ``
})
export class DoctorsComponent {
  doctors = doctorsData
}
