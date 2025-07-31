import { Component } from '@angular/core';
import { SimplebarAngularModule } from 'simplebar-angular';
import { PageTitleComponent } from "../../../components/page-title.component";

@Component({
  selector: 'app-scrollbar',
  standalone: true,
  imports: [SimplebarAngularModule, PageTitleComponent],
  templateUrl: './scrollbar.component.html',
  styles: ``
})
export class ScrollbarComponent {

}
