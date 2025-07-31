import { Component } from '@angular/core';
import { PageTitleComponent } from "@components/page-title.component";
import { productData } from './data';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { currency } from '@common/constants';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'products',
  standalone: true,
  imports: [PageTitleComponent, NgbPaginationModule,RouterLink],
  templateUrl: './products.component.html',
  styles: ``
})
export class ProductsComponent {
  products = productData

  currency = currency

  page = 4
}
