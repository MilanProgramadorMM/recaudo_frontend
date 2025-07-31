import { Component } from '@angular/core';
import { currency } from '@common/constants';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'quick-transfer',
  standalone: true,
  imports: [NgbDropdownModule],
  templateUrl: './quick-transfer.component.html',
  styles: ``
})
export class QuickTransferComponent {
  currency=currency
}
