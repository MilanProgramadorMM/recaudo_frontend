import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageTitleComponent } from "@components/page-title.component";

@Component({
  selector: 'error-two-404',
  standalone: true,
  imports: [PageTitleComponent,RouterLink],
  templateUrl: './error-two-404.component.html',
  styles: ``
})
export class ErrorTwo404Component {

}
