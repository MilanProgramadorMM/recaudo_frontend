import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { dietData } from '../../data';

@Component({
  selector: 'diet-card',
  standalone: true,
  imports: [],
  templateUrl: './diet-card.component.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DietCardComponent {
  dietData=dietData
}
