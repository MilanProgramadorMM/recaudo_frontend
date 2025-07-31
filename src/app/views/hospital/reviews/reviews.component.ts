import { Component } from '@angular/core';
import { PageTitleComponent } from "@components/page-title.component";
import { reviewData } from './data';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'reviews',
  standalone: true,
  imports: [PageTitleComponent,DatePipe],
  templateUrl: './reviews.component.html',
  styles: ``
})
export class ReviewsComponent {
  reviewData = reviewData

}
