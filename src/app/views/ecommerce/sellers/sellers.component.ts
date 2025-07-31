import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PageTitleComponent } from "@components/page-title.component";
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule, type ApexOptions } from 'ng-apexcharts';
import { sellersData } from './data';
import { currency } from '@common/constants';

@Component({
  selector: 'sellers',
  standalone: true,
  imports: [PageTitleComponent, NgApexchartsModule, NgbPaginationModule],
  templateUrl: './sellers.component.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SellersComponent {
  sellers = sellersData
  currency = currency

  sellersChartOpts: ApexOptions = {
    chart: { type: "area", height: 100, sparkline: { enabled: !0 } },
    stroke: { width: 2, curve: "smooth" },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        opacityFrom: 0.4,
        opacityTo: 0,
        stops: [0, 100],
      },
    },
    markers: { size: 0 },
    colors: ["#465dff"],
    tooltip: {
      fixed: { enabled: !1 },
      x: { show: !1 },
      y: {
        title: {
          formatter: function (e) {
            return "";
          },
        },
      },
      marker: { show: !1 },
    },
  }
}
