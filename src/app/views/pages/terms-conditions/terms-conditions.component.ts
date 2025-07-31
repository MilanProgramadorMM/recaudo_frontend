import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageTitleComponent } from "@components/page-title.component";

@Component({
  selector: 'terms-conditions',
  standalone: true,
  imports: [PageTitleComponent,RouterLink],
  templateUrl: './terms-conditions.component.html',
  styles: ``
})
export class TermsConditionsComponent {

}
