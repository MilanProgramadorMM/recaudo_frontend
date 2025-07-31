import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PageTitleComponent } from "@components/page-title.component";
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { alerts, alerts2, type AlertType } from './data';
import { toSentenceCase } from '@core/helper/change-casing';

@Component({
  selector: 'alerts',
  standalone: true,
  imports: [PageTitleComponent, NgbAlertModule],
  templateUrl: './alerts.component.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AlertsComponent {
  alerts: AlertType[] = alerts
  alertData = alerts2
  toSentenceCase = toSentenceCase
  show = false

  toggleAlert() {
    this.show = true
  }
  closeAlert() {
    this.show = !this.show
  }


  close(index: number) {
    this.alertData.splice(index, 1)
  }
}
