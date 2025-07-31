import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { currency } from '@common/constants';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { stats } from '../../data';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'wallet-stats',
  standalone: true,
  imports: [NgbDropdownModule, NgApexchartsModule,CommonModule],
  templateUrl: './wallet-stats.component.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WalletStatsComponent {
  currency = currency

  statsData=stats
}
