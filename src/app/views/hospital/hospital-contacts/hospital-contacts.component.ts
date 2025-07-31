import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { contactList } from './data';
import { PageTitleComponent } from "../../../components/page-title.component";

@Component({
  selector: 'hospital-contacts',
  standalone: true,
  imports: [PageTitleComponent],
  templateUrl: './hospital-contacts.component.html',
  styles: ``,
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class HospitalContactsComponent {
contactData=contactList
}
