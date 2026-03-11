import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, inject, Input, Output, ViewChild, type OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, Validators, type UntypedFormGroup } from '@angular/forms';
import { addOrSubtractMinutesFromDate } from '@core/helper/utils';
import { NgbCollapseModule, NgbOffcanvasModule } from '@ng-bootstrap/ng-bootstrap';
import { SimplebarAngularModule, type SimplebarAngularComponent } from 'simplebar-angular';
import { messages, userData, type UserType } from '../../data';
import type { Subscription } from 'rxjs';
import { ToggleService } from '@core/services/toggle.service';

@Component({
  selector: 'chat-area',
  standalone: true,
  imports: [NgbOffcanvasModule, SimplebarAngularModule, CommonModule, FormsModule, ReactiveFormsModule, NgbCollapseModule],
  templateUrl: './chat-area.component.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ChatAreaComponent implements OnInit {
  @Input() profileDetail!: UserType

  messages = messages;
  selectedUser = userData[0];
  formData!: UntypedFormGroup
  submitted = false

  isCollapsed!: boolean;
  constructor(private toggleService: ToggleService) { }
  toggleCollapse() {
    this.toggleService.toggle();
  }

  @Output() sidebarButtonClicked = new EventEmitter();

  openSidebar() {
    this.sidebarButtonClicked.emit();
  }

  toUser: UserType = {
    id: '1012',
    name: 'Gilbert Chicoine',
    image: "assets/images/users/avatar-10.jpg",
    message: 'Hey! Okay, thank you for letting me know. See you!',
    date: addOrSubtractMinutesFromDate(650),
  }

  public formBuilder = inject(UntypedFormBuilder)

  @ViewChild('scrollRef', { static: false })
  scrollRef!: SimplebarAngularComponent;

  ngOnInit(): void {
    this.messages = messages.filter(
      (m) =>
        (m.to.id === this.toUser.id && m.from.id === this.selectedUser.id) ||
        (this.toUser.id === m.from.id && m.to.id === this.selectedUser.id),
    );

    this.formData = this.formBuilder.group({
      message: ['', [Validators.required]],
    })

    this.toggleService.toggleState$.subscribe(state => {
      this.isCollapsed = state;
    });
  }

  ngAfterViewInit() {
    this.scrollRef.SimpleBar.getScrollElement().scrollTop = 300
    this.scrollToBottom(true)
  }

  scrollToBottom(smooth = true) {
    const self = this
    const scrollElement = this.scrollRef.SimpleBar.getScrollElement()

    if (scrollElement) {
      const maxPosition =
        scrollElement.scrollHeight - scrollElement.clientHeight
      const time = smooth ? 10 : 1 // Adjust the interval time based on smoothness
      const scrollSpeed = 2 // Change this to control the scroll speed
      let scrollPosition = scrollElement.scrollTop

      const interval = setInterval(function () {
        scrollPosition += scrollSpeed
        scrollElement.scrollTop = scrollPosition

        if (scrollPosition >= maxPosition) {
          clearInterval(interval) // Stop when the bottom is reached
        }
      }, time)
    }
  }

  get form() {
    return this.formData.controls
  }

  messageSend() {
    const message = this.formData.get('message')!.value
    if (this.formData.valid && message) {
      this.messages.push({
        id: (this.messages.length + 1).toString(),
        from: this.toUser,
        to: this.selectedUser,
        message: message,
        sentOn: addOrSubtractMinutesFromDate(0.1),
      })
      setTimeout(() => {
        this.messages.push({
          id: (this.messages.length + 1).toString(),
          from: this.selectedUser,
          to: this.toUser,
          message: 'Server is not connected 😔',
          sentOn: addOrSubtractMinutesFromDate(0.1),
        })
        this.scrollToBottom(true)
      }, 1000)
    } else {
      this.submitted = true
    }
    setTimeout(() => {
      this.scrollToBottom(true)
    }, 500)
    setTimeout(() => {
      this.formData.reset()
    }, 500)
  }



}
