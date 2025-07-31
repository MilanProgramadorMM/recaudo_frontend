import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { productStatData } from '../../data';

@Component({
  selector: 'stats',
  standalone: true,
  imports: [],
  templateUrl: './stats.component.html',
  styles: ``,
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
})
export class StatsComponent {
statData=productStatData
}
