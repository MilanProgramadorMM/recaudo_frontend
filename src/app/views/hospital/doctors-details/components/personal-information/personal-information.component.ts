import { Component } from '@angular/core';
import { abilitiesData, experienceData } from '../../data';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'personal-information',
  standalone: true,
  imports: [NgbProgressbarModule],
  templateUrl: './personal-information.component.html',
  styles: ``
})
export class PersonalInformationComponent {
  abilities = abilitiesData

  experienceData = experienceData
}
