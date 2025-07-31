import { Component, ViewChild, type ElementRef } from '@angular/core';
import { PageTitleComponent } from "@components/page-title.component";
import { contactDetailsData, faqData } from './data';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'faqs',
  standalone: true,
  imports: [PageTitleComponent, NgbAccordionModule],
  templateUrl: './faqs.component.html',
  styles: ``
})
export class FaqsComponent {
  contactDetails = contactDetailsData
  faqData = faqData
  @ViewChild('targetId') targetElement!: ElementRef;

  scrollToElement(id: string): void {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
