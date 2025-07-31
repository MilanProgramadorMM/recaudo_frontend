import { Component } from '@angular/core';
import { popularCategoriesData } from '../../data';
import { currency } from '@common/constants';

@Component({
  selector: 'product-filter',
  standalone: true,
  imports: [],
  templateUrl: './product-filter.component.html',
  styles: ``
})
export class ProductFilterComponent {
  brands = ['Samsung', 'Sony', 'Apple', 'H & M', 'Black Berry', 'Skullcandy', 'Zara', 'Noise', 'Nike', 'Adidas']
  currency=currency
  popularCategories = popularCategoriesData
}
