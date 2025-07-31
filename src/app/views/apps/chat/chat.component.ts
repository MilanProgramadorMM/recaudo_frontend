import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { NgbCollapseModule, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { PageTitleComponent } from "../../../components/page-title.component";
import { ChatAreaComponent } from "./components/chat-area/chat-area.component";
import { ChatLeftSideBarComponent } from "./components/chat-left-side-bar/chat-left-side-bar.component";
import type { UserType } from './data';

@Component({
  selector: 'chat',
  standalone: true,
  imports: [PageTitleComponent, ChatLeftSideBarComponent, ChatAreaComponent,NgbCollapseModule],
  templateUrl: './chat.component.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ChatComponent {
  public offCanvas = inject(NgbOffcanvas)

  profileDetail!: UserType

  isCollapsed = false;

  onSidebarButtonClicked() {
    this.offCanvas.open(ChatLeftSideBarComponent, {
      position: 'start',
      backdrop: true,
      panelClass: "chat",
    })
  }


  receiveDataFromChild(data: UserType) {
    this.profileDetail = data
  }

}
