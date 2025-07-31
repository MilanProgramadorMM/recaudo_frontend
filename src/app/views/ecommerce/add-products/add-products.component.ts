import { Component } from '@angular/core';
import { PageTitleComponent } from "@components/page-title.component";
import { FileUploaderComponent } from "@components/file-uploader.component";
import { Select2 } from 'ng-select2-component';
import { currency } from '@common/constants';

@Component({
  selector: 'add-products',
  standalone: true,
  imports: [PageTitleComponent, FileUploaderComponent,Select2],
  templateUrl: './add-products.component.html',
  styles: ``
})
export class AddProductsComponent {
  currency=currency
 categoryOpts = [
    {
      label: 'Select Category',
      data: {
        name: 'Select Category',
      },
      options: [
        {value: 'Electronics',label: 'Electronics',},
        {value: 'Mobile Accessories',label: 'Mobile Accessories',},
        {value: 'Games',label: 'Games',},
        {value: 'Sports',label: 'Sports',},
        {value: 'Watches',label: 'Watches',},
        {value: 'Bags',label: 'Bags',},
        {value: 'Toys',label: 'Toys',},
        {value: "Cloth's",label: "Cloth's",},
        {value: "Shoes",label: "Shoes",},
        {value: "Fashion",label: "Fashion",},
        {value: "Furniture",label: "Furniture",},
      ],
    }
  ]

 categoryTypeOpts = [
    {
      label: 'Select Type',
      data: {
        name: 'Select Type',
      },
      options: [
        {value: 'Simple',label: 'Simple',},
        {value: 'Classy',label: 'Classy',},
      ],
    }
  ]

 productBrandOpts = [
    {
      label: 'Select Brand',
      data: {
        name: 'Select Brand',
      },
      options: [
        {value: 'Sony',label: 'Sony',},
        {value: 'Canon',label: 'Canon',},
        {value: 'Snitch',label: 'Snitch',},
        {value: 'Titan',label: 'Titan',},
        {value: 'JCB',label: 'JCB',},
        {value: 'Wood',label: 'Wood',},
        {value: 'Apple',label: 'Apple',},
        {value: 'Nike',label: 'Nike',},
      ],
    }
  ]

 productStatsOpts = [
    {
      label: '',
      data: {
        name: '',
      },
      options: [
        {value: 'Draft',label: 'Draft',},
        {value: 'Scheduled',label: 'Scheduled',},
        {value: 'Published',label: 'Published',},
        {value: 'Entertainment',label: 'Entertainment',},
      ],
    }
  ]

 visibilityOpts = [
    {
      label: '',
      data: {
        name: '',
      },
      options: [
        {value: 'Public',label: 'Public',},
        {value: 'Hidden',label: 'Hidden',},
      ],
    }
  ]

 productTaxOpts = [
    {
      label: 'Select Tax',
      data: {
        name: 'Select Tax',
      },
      options: [
        {value: '5%',label: '5%',},
        {value: '8%',label: '8%',},
        {value: '12%',label: '12%',},
        {value: '16%',label: '16%',},
        {value: '20%',label: '20%',},
        {value: '22%',label: '22%',},
      ],
    }
  ]


}
