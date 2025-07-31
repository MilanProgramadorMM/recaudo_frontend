import { Component } from '@angular/core';
import { treatmentData } from '../../data';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'treatment-history',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './treatment-history.component.html',
  styles: ``
})
export class TreatmentHistoryComponent {
  treatmentHistoryData = treatmentData
}
