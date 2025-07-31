import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { shopOffersData } from '../../data';

@Component({
  selector: 'offers',
  standalone: true,
  imports: [],
  templateUrl: './offers.component.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class OffersComponent {
  shopOffersData=shopOffersData
}
