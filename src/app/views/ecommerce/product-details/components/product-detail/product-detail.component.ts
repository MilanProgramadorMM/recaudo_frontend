import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { currency } from '@common/constants';
import { QuantityControlDirective } from '@core/directive/quantity-control.directive';
import { NgbCarouselModule, NgbCarouselConfig, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'product-detail',
  standalone: true,
  imports: [NgbCarouselModule,CommonModule,QuantityControlDirective,NgbRatingModule],
  templateUrl: './product-detail.component.html',
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductDetailComponent {

  currency=currency

  activeSlide: number = 0;
  slides = [
    { img: 'assets/images/products/p-3.png', thumb: 'assets/images/products/p-3.png' },
    { img: 'assets/images/products/p-9.png', thumb: 'assets/images/products/p-9.png' },
    { img: 'assets/images/products/p-10.png', thumb: 'assets/images/products/p-10.png' },
    { img: 'assets/images/products/p-11.png', thumb: 'assets/images/products/p-11.png' },
    { img: 'assets/images/products/p-12.png', thumb: 'assets/images/products/p-12.png' },
  ];

  constructor(config: NgbCarouselConfig) {
    // customize default values of carousels used by this component tree
    config.interval = 2000;
    config.wrap = true;
    config.keyboard = true;
    config.pauseOnHover = true;
  }

  ngOnInit() {
  }

  onSlideChange(event: any) {
    this.activeSlide = event.current;
  }
}
