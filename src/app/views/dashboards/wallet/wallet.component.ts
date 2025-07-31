import { Component } from '@angular/core';
import { PageTitleComponent } from "../../../components/page-title.component";
import { WalletStatsComponent } from "./components/wallet-stats/wallet-stats.component";
import { OverviewChartComponent } from "./components/overview-chart/overview-chart.component";
import { BalanceDetailComponent } from "./components/balance-detail/balance-detail.component";
import { QuickTransferComponent } from "./components/quick-transfer/quick-transfer.component";
import { TransactionsComponent } from "./components/transactions/transactions.component";

@Component({
  selector: 'wallet',
  standalone: true,
  imports: [WalletStatsComponent, PageTitleComponent, OverviewChartComponent, BalanceDetailComponent, QuickTransferComponent, TransactionsComponent],
  templateUrl: './wallet.component.html',
  styles: ``
})
export class WalletComponent {

}
