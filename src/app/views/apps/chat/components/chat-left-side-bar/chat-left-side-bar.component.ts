import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, inject, Input, Output, type OnInit } from '@angular/core';
import { FirstTwoLettersPipe } from '@core/first-two-letters.pipe';
import { NgbCollapseModule, NgbDropdownModule, NgbOffcanvas, NgbOffcanvasModule } from '@ng-bootstrap/ng-bootstrap';
import { SimplebarAngularModule } from 'simplebar-angular';
import { userData, type UserType } from '../../data';
import  { ToggleService } from '@core/services/toggle.service';

@Component({
  selector: 'chat-left-side-bar',
  standalone: true,
  imports: [SimplebarAngularModule, NgbDropdownModule, CommonModule, DatePipe,NgbCollapseModule,NgbOffcanvasModule],
  templateUrl: './chat-left-side-bar.component.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ChatLeftSideBarComponent implements OnInit {
  users = userData;
  selectedUser = userData[0];

  @Output() profileDetail = new EventEmitter<UserType>()

  private offCanvas = inject(NgbOffcanvas);

  close() {
    this.offCanvas.dismiss();
  }

  isCollapsed!: boolean;

  constructor(private toggleService: ToggleService) {}


  ngOnInit(): void {
    // Fetch Data
    const data = this.users[0]
    this.profileDetail.emit(data)

    this.toggleService.toggleState$.subscribe(state => {
      this.isCollapsed = state;
    });
  }

  getDetail(user: UserType) {
    const data = user
    this.profileDetail.emit(data)
  }

}
