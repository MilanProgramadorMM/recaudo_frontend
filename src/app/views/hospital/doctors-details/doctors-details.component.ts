import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PageTitleComponent } from "../../../components/page-title.component";
import { AppointmentComponent } from "./components/appointment/appointment.component";
import { PersonalInformationComponent } from "./components/personal-information/personal-information.component";
import { ProfileCardComponent } from "./components/profile-card/profile-card.component";
import { SkillChartComponent } from "./components/skill-chart/skill-chart.component";
import { SpecialtyComponent } from "./components/specialty/specialty.component";
import { AppointmentListComponent } from "./components/appointment-list/appointment-list.component";

@Component({
  selector: 'doctors-details',
  standalone: true,
  imports: [PageTitleComponent, ProfileCardComponent, PersonalInformationComponent, AppointmentComponent, SkillChartComponent, SpecialtyComponent, AppointmentListComponent],
  templateUrl: './doctors-details.component.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DoctorsDetailsComponent {

}
