import { Component } from '@angular/core';
import { PageTitleComponent } from "@components/page-title.component";
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask'

@Component({
  selector: 'input-masks',
  standalone: true,
  imports: [PageTitleComponent,NgxMaskDirective,],
  templateUrl: './input-masks.component.html',
  providers: [provideNgxMask()],
  styles: ``
})
export class InputMasksComponent {

}
