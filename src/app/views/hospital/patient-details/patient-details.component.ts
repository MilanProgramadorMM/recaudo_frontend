import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PageTitleComponent } from "../../../components/page-title.component";
import { CheckupFilesComponent } from "./components/checkup-files/checkup-files.component";
import { MedicalHistoryComponent } from './components/medical-history/medical-history.component';
import { PatientCardComponent } from "./components/patient-card/patient-card.component";
import { PatientInformationComponent } from "./components/patient-information/patient-information.component";
import { WaterChartComponent } from "./components/water-chart/water-chart.component";
import { PatientChartComponent } from "./components/patient-chart/patient-chart.component";
import { DietCardComponent } from "./components/diet-card/diet-card.component";
import { TreatmentHistoryComponent } from "./components/treatment-history/treatment-history.component";

@Component({
  selector: 'patient-details',
  standalone: true,
  imports: [PatientCardComponent, TreatmentHistoryComponent],
  templateUrl: './patient-details.component.html',
  styles: ``,
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class PatientDetailsComponent {

}
