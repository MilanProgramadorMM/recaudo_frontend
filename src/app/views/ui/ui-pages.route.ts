import type { Route } from "@angular/router";
import { MaestroModulosComponent } from "./accordions/maestro-modulos.component";
import { AlertsComponent } from "./alerts/alerts.component";
import { AvatarsComponent } from "./avatars/avatars.component";
import { BadgesComponent } from "./badges/badges.component";
import { BreadcrumbComponent } from "./breadcrumb/breadcrumb.component";
import { ButtonsComponent } from "./buttons/buttons.component";
import { CardsComponent } from "./cards/cards.component";
import { CarouselComponent } from "./carousel/carousel.component";
import { CollapseComponent } from "./collapse/collapse.component";
import { DropdownsComponent } from "./dropdowns/dropdowns.component";
import { RatioComponent } from "./ratio/ratio.component";
import { GridComponent } from "./grid/grid.component";
import { LinksComponent } from "./links/links.component";
import { ListGroupComponent } from "./list-group/list-group.component";
import { ModalsComponent } from "./modals/modals.component";
import { NotificationsComponent } from "./notifications/notifications.component";
import { OffcanvasComponent } from "./offcanvas/offcanvas.component";
import { PlaceholdersComponent } from "./placeholders/placeholders.component";
import { PaginationComponent } from "./pagination/pagination.component";
import { PopoversComponent } from "./popovers/popovers.component";
import { ProgressComponent } from "./progress/progress.component";
import { ScrollspyComponent } from "./scrollspy/scrollspy.component";
import { SpinnersComponent } from "./spinners/spinners.component";
import { TabsComponent } from "./tabs/tabs.component";
import { TooltipsComponent } from "./tooltips/tooltips.component";
import { TypographyComponent } from "./typography/typography.component";
import { UtilitiesComponent } from "./utilities/utilities.component";

export const UI_PAGES_ROUTES: Route[] = [
  {
    path: 'accordions',
    component: MaestroModulosComponent,
    data: { title: 'Maestro de módulos' },
  },
  {
    path: 'alerts',
    component: AlertsComponent,
    data: { title: 'Alerts' },
  },
  {
    path: 'avatars',
    component: AvatarsComponent,
    data: { title: 'Avatars' },
  },
  {
    path: 'avatars',
    component: AvatarsComponent,
    data: { title: 'Avatars' },
  },
  {
    path: 'badges',
    component: BadgesComponent,
    data: { title: 'Badge' },
  },
  {
    path: 'breadcrumb',
    component: BreadcrumbComponent,
    data: { title: 'Breadcrumb' },
  },
  {
    path: 'buttons',
    component: ButtonsComponent,
    data: { title: 'buttons' },
  },
  {
    path: 'cards',
    component: CardsComponent,
    data: { title: 'Cards' },
  },
  {
    path: 'carousel',
    component: CarouselComponent,
    data: { title: 'Carousel' },
  },
  {
    path: 'collapse',
    component: CollapseComponent,
    data: { title: 'Collapse' },
  },
  {
    path: 'dropdowns',
    component: DropdownsComponent,
    data: { title: 'Dropdowns' },
  },
  {
    path: 'ratio',
    component: RatioComponent,
    data: { title: 'Ratio' },
  },
  {
    path: 'grid',
    component: GridComponent,
    data: { title: 'Grid' },
  },
  {
    path: 'links',
    component: LinksComponent,
    data: { title: 'Links' },
  },
  {
    path: 'list-group',
    component: ListGroupComponent,
    data: { title: 'List Group' },
  },
  {
    path: 'modals',
    component: ModalsComponent,
    data: { title: 'Modals' },
  },
  {
    path: 'notifications',
    component: NotificationsComponent,
    data: { title: 'Notifications' },
  },
  {
    path: 'notifications',
    component: NotificationsComponent,
    data: { title: 'Notifications' },
  },
  {
    path: 'offcanvas',
    component: OffcanvasComponent,
    data: { title: 'Offcanvas' },
  },
  {
    path: 'placeholders',
    component: PlaceholdersComponent,
    data: { title: 'Placeholders' },
  },
  {
    path: 'pagination',
    component: PaginationComponent,
    data: { title: 'Pagination' },
  },
  {
    path: 'popovers',
    component: PopoversComponent,
    data: { title: 'Popovers' },
  },
  {
    path: 'progress',
    component: ProgressComponent,
    data: { title: 'Progress' },
  },
  {
    path: 'scrollspy',
    component: ScrollspyComponent,
    data: { title: 'Scrollspy' },
  },
  {
    path: 'spinners',
    component: SpinnersComponent,
    data: { title: 'Spinners' },
  },
  {
    path: 'tabs',
    component: TabsComponent,
    data: { title: 'Tabs' },
  },
  {
    path: 'tooltips',
    component: TooltipsComponent,
    data: { title: 'Tooltips' },
  },
  {
    path: 'typography',
    component: TypographyComponent,
    data: { title: 'Typography' },
  },
  {
    path: 'utilities',
    component: UtilitiesComponent,
    data: { title: 'Utilities' },
  },
]