import { Component } from '@angular/core';
import { PageTitleComponent } from "../../../components/page-title.component";
import { currency } from '@common/constants';

@Component({
  selector: 'basic-tables',
  standalone: true,
  imports: [PageTitleComponent],
  templateUrl: './basic-tables.component.html',
  styles: ``
})
export class BasicTablesComponent {
  currency=currency
}
