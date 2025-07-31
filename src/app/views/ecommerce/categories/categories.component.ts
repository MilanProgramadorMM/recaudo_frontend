import { Component } from '@angular/core';
import { PageTitleComponent } from "@components/page-title.component";
import { Select2 } from 'ng-select2-component';
import { categoryData } from './data';
import { currency } from '@common/constants';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'categories',
  standalone: true,
  imports: [PageTitleComponent, Select2,NgbPagination],
  templateUrl: './categories.component.html',
  styles: ``
})
export class CategoriesComponent {

  currency = currency
  categoryData = categoryData

  page = 4

  categoryOpts = [
    {
      label: '',
      data: {
        name: '',
      },
      options: [
        { value: '10', label: '10', },
        { value: '20', label: '20', },
        { value: '25', label: '25', },
        { value: '30', label: '30', },
        { value: '50', label: '50', },
      ]
    }
  ]
}
