import { Component } from '@angular/core';
import { PageTitleComponent } from "@components/page-title.component";
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
  CdkDragHandle
} from '@angular/cdk/drag-drop';

const avatar1 = 'assets/images/users/avatar-1.jpg';
const avatar2 = 'assets/images/users/avatar-2.jpg';
const avatar3 = 'assets/images/users/avatar-3.jpg';
const avatar4 = 'assets/images/users/avatar-4.jpg';
const avatar5 = 'assets/images/users/avatar-5.jpg';
const avatar6 = 'assets/images/users/avatar-6.jpg';
const avatar7 = 'assets/images/users/avatar-7.jpg';
const avatar8 = 'assets/images/users/avatar-8.jpg';
const avatar9 = 'assets/images/users/avatar-9.jpg';
const avatar10 = 'assets/images/users/avatar-10.jpg';


@Component({
  selector: 'app-dragula',
  standalone: true,
  imports: [PageTitleComponent, CdkDropListGroup, CdkDropList, CdkDrag, CdkDragHandle],
  templateUrl: './dragula.component.html',
  styles: ``
})
export class DragulaComponent {


  simpleList = [
    { id: '1', variant: 'primary' },
    { id: '2', variant: 'secondary' },
    { id: '3', variant: 'success' },
    { id: '4', variant: 'info' },
    { id: '5', variant: 'warning' },
    { id: '6', variant: 'danger' },
  ];

  list1 = [
    { id: '1', image: avatar1, name: 'Louis K. Bond', role: 'Founder & CEO' },
    { id: '2', image: avatar2, name: 'Dennis N. Cloutier', role: 'Software Engineer' },
    { id: '3', image: avatar3, name: 'Susan J. Sander', role: 'Web Designer' },
  ];

  list2 = [
    { id: '4', image: avatar4, name: 'James M. Short', role: 'Web Developer' },
    { id: '5', image: avatar5, name: 'Gabriel J. Snyder', role: 'Business Analyst' },
    { id: '6', image: avatar6, name: 'Louie C. Mason', role: 'Human Resources' },
  ];

  list3 = [
    { id: '7', image: avatar7, name: 'Louis K. Bond', role: 'Founder & CEO' },
    { id: '8', image: avatar8, name: 'Dennis N. Cloutier', role: 'Software Engineer' },
    { id: '9', image: avatar9, name: 'Susan J. Sander', role: 'Web Designer' },
  ];

  list4 = [
    { id: '10', image: avatar1, name: 'James M. Short', role: 'Web Developer' },
    { id: '11', image: avatar5, name: 'Gabriel J. Snyder', role: 'Business Analyst' },
    { id: '12', image: avatar3, name: 'Louie C. Mason', role: 'Human Resources' },
  ];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

}
