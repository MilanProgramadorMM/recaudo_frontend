import { Component } from '@angular/core';
import { brandListData } from '../../data';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'brand-list',
  standalone: true,
  imports: [NgbDropdownModule],
  templateUrl: './brand-list.component.html',
  styles: ``
})
export class BrandListComponent {
  bransData = brandListData
}
