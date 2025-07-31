import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { medicalHistoryData } from '../../data';

@Component({
  selector: 'medical-history',
  standalone: true,
  imports: [],
  templateUrl: './medical-history.component.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MedicalHistoryComponent {
  medicalHistoryData = medicalHistoryData
}
