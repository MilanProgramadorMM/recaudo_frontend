import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { customerReviews, productRatingData, shopProductRating, shopRatingData } from '../../data';
import { NgbProgressbarModule, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'product-review',
  standalone: true,
  imports: [NgbProgressbarModule,NgbRatingModule],
  templateUrl: './product-review.component.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductReviewComponent {
  productRatingData = productRatingData

  customerReviews=customerReviews

  shopRatingData=shopRatingData

  shopProductRatings=shopProductRating
}
