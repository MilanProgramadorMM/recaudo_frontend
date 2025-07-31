import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PageTitleComponent } from "../../../components/page-title.component";
import { ProductDetailComponent } from "./components/product-detail/product-detail.component";
import { ProductDescriptionComponent } from "./components/product-description/product-description.component";

@Component({
  selector: 'product-details',
  standalone: true,
  imports: [PageTitleComponent, ProductDetailComponent, ProductDescriptionComponent],
  templateUrl: './product-details.component.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductDetailsComponent {

}
