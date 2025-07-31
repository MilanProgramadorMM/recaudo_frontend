import { Component } from '@angular/core';
import { SimplebarAngularModule } from 'simplebar-angular';
import { activityData } from '../../data';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'activity',
  standalone: true,
  imports: [SimplebarAngularModule,DatePipe],
  templateUrl: './activity.component.html',
  styles: ``
})
export class ActivityComponent {
  activityData = activityData
}
