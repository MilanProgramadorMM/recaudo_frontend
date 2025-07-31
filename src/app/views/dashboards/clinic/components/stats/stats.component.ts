import { Component } from '@angular/core';
import { statData } from '../../data';

@Component({
  selector: 'stats',
  standalone: true,
  imports: [],
  templateUrl: './stats.component.html',
  styles: ``
})
export class StatsComponent {
  statData=statData
}
