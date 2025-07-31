import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, type TemplateRef } from '@angular/core';
import { PageTitleComponent } from "@components/page-title.component";
import { NgbOffcanvas, NgbOffcanvasModule } from '@ng-bootstrap/ng-bootstrap';
import { QuickAccessComponent } from "./components/quick-access/quick-access.component";
import { RecentFilesComponent } from "./components/recent-files/recent-files.component";
import { SidePanelComponent } from "./components/side-panel/side-panel.component";
import { quickAccessData } from './data';

@Component({
  selector: 'file-manager',
  standalone: true,
  imports: [PageTitleComponent, QuickAccessComponent, RecentFilesComponent, NgbOffcanvasModule, SidePanelComponent],
  templateUrl: './file-manager.component.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class FileManagerComponent {
  allFiles = quickAccessData
  private offcanvasService = inject(NgbOffcanvas);

  openSidebar(content: TemplateRef<any>) {
    this.offcanvasService.open(content, {
      position: 'start',
      backdrop: true,
    })
  }
}
