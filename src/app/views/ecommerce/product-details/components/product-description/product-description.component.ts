import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductReviewComponent } from "../product-review/product-review.component";
import { OffersComponent } from "../offers/offers.component";

@Component({
  selector: 'product-description',
  standalone: true,
  imports: [NgbNavModule, ProductReviewComponent, OffersComponent],
  templateUrl: './product-description.component.html',
  styles: ``,
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductDescriptionComponent {

}
