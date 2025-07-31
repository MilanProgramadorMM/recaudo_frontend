import type { Route } from "@angular/router";
import { AreaComponent } from "./area/area.component";
import { BarComponent } from "./bar/bar.component";
import { BubbleComponent } from "./bubble/bubble.component";
import { CandlestickComponent } from "./candlestick/candlestick.component";
import { ColumnComponent } from "./column/column.component";
import { HeatmapComponent } from "./heatmap/heatmap.component";
import { LineComponent } from "./line/line.component";
import { MixedComponent } from "./mixed/mixed.component";
import { TimelineComponent } from "./timeline/timeline.component";
import { BoxplotComponent } from "./boxplot/boxplot.component";
import { TreemapComponent } from "./treemap/treemap.component";
import { PieComponent } from "./pie/pie.component";
import { RadarComponent } from "./radar/radar.component";
import { RadialbarComponent } from "./radialbar/radialbar.component";
import { ScatterComponent } from "./scatter/scatter.component";
import { PolarareaComponent } from "./polararea/polararea.component";
import { SparklinesComponent } from "./sparklines/sparklines.component";

export const CHARTS_ROUTES: Route[] = [
  {
    path: 'area',
    component: AreaComponent,
    data: { title: 'Apex Area Charts' }
  },
  {
    path: 'bar',
    component: BarComponent,
    data: { title: 'Apex Bar Charts' }
  },
  {
    path: 'bubble',
    component: BubbleComponent,
    data: { title: 'Apex Bubble Charts' }
  },
  {
    path: 'candlestick',
    component: CandlestickComponent,
    data: { title: 'Apex Candlestick Charts' }
  },
  {
    path: 'column',
    component: ColumnComponent,
    data: { title: 'Apex Column Charts' }
  },
  {
    path: 'heatmap',
    component: HeatmapComponent,
    data: { title: 'Apex Heatmap Charts' }
  },
  {
    path: 'line',
    component: LineComponent,
    data: { title: 'Apex Line Charts' }
  },
  {
    path: 'mixed',
    component: MixedComponent,
    data: { title: 'Apex Mixed Charts' }
  },
  {
    path: 'timeline',
    component: TimelineComponent,
    data: { title: 'Apex Timeline Charts' }
  },
  {
    path: 'boxplot',
    component: BoxplotComponent,
    data: { title: 'Apex Boxplot Charts' }
  },
  {
    path: 'treemap',
    component: TreemapComponent,
    data: { title: 'Apex Treemap Charts' }
  },
  {
    path: 'pie',
    component: PieComponent,
    data: { title: 'Apex Pie Charts' }
  },
  {
    path: 'radar',
    component: RadarComponent,
    data: { title: 'Apex Radar Charts' }
  },
  {
    path: 'radialbar',
    component: RadialbarComponent,
    data: { title: 'Apex Radialbar Charts' }
  },
  {
    path: 'scatter',
    component: ScatterComponent,
    data: { title: 'Apex Scatter Charts' }
  },
  {
    path: 'polar',
    component: PolarareaComponent,
    data: { title: 'Apex Polar Charts' }
  },
  {
    path: 'sparklines',
    component: SparklinesComponent,
    data: { title: 'Apex sparkline Charts' }
  },
]