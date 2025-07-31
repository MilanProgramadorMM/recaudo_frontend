import { Component } from '@angular/core';
import { PageTitleComponent } from "@components/page-title.component";
import { NgbCarouselModule,  NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'carousel',
  standalone: true,
  imports: [PageTitleComponent, NgbCarouselModule],
  templateUrl: './carousel.component.html',
  styles: ``
})
export class CarouselComponent {
  constructor(config: NgbCarouselConfig) {
    config.showNavigationArrows = true
    config.showNavigationIndicators = true
  }
}
