import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { PageTitleComponent } from "@components/page-title.component";
import { ToastService } from './toast.service';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastsContainer } from './toasts-container.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'notifications',
  standalone: true,
  imports: [PageTitleComponent,NgbToastModule,FormsModule],
  templateUrl: './notifications.component.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NotificationsComponent {
  toastService = inject(ToastService)
  liveToast = false
  show = true
  show1 = true
  show2 = true
  show3 = true
  placement = true
  translucent = true
  toastPlacement: string = ''

  close() {
    this.show = false
  }

  showStandard() {
    this.toastService.show({
      content: 'See Just like this',
      delay: 10000,
      classname: 'standard',
    })
  }

  showSuccess() {
    this.toastService.show({
      content: 'Heads up, toasts will stack automatically',
      delay: 10000,
      classname: 'standard',
    })
  }

}
