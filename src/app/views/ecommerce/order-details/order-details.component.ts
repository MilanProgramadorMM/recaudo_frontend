import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PageTitleComponent } from "@components/page-title.component";
import { OrderStatsComponent } from "./components/order-stats/order-stats.component";
import { OrderTimelineComponent } from "./components/order-timeline/order-timeline.component";
import { OrderShipmentComponent } from "./components/order-shipment/order-shipment.component";
import { OrderItemsComponent } from "./components/order-items/order-items.component";
import { OrderSummaryComponent } from "./components/order-summary/order-summary.component";

@Component({
  selector: 'order-details',
  standalone: true,
  imports: [PageTitleComponent, OrderStatsComponent, OrderTimelineComponent, OrderShipmentComponent, OrderItemsComponent, OrderSummaryComponent],
  templateUrl: './order-details.component.html',
  styles: ``,
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class OrderDetailsComponent {

}
