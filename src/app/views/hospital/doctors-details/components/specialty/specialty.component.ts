import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SpecialtyData } from '../../data';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'specialty',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './specialty.component.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SpecialtyComponent {
  specialtyData = SpecialtyData
}
