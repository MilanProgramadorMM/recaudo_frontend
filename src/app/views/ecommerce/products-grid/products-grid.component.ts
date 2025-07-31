import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PageTitleComponent } from "@components/page-title.component";
import { ProductFilterComponent } from "./components/product-filter/product-filter.component";
import { StatsComponent } from './components/stats/stats.component';
import { productData } from './data';
import { NgbPaginationModule, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { currency } from '@common/constants';

@Component({
  selector: 'products-grid',
  standalone: true,
  imports: [PageTitleComponent, ProductFilterComponent,StatsComponent,NgbRatingModule,NgbPaginationModule],
  templateUrl: './products-grid.component.html',
  styles: ``,
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})

export class ProductsGridComponent {
products=productData

currency=currency
page=2
}
