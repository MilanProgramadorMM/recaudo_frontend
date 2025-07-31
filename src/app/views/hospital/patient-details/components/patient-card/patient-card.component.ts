import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { treatmentData } from '../../data';

@Component({
  selector: 'patient-card',
  standalone: true,
  imports: [],
  templateUrl: './patient-card.component.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PatientCardComponent {

    treatmentHistoryData = treatmentData


}
