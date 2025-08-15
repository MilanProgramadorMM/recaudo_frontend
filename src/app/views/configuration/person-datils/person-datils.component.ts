import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { treatmentData } from '@views/hospital/patient-details/data';
import { PersonInfoComponent } from './card/person-info/person-info.component';
import { ListContactInfoComponent } from './card/list-contact-info/list-contact-info.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PersonRegisterDto } from '@core/services/person.service';

@Component({
  selector: 'app-person-datils',
  standalone: true,
  imports: [PersonInfoComponent, ListContactInfoComponent],
  templateUrl: './person-datils.component.html',
  styleUrls: ['./person-datils.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class PersonDatilsComponent {
  @ViewChild(ListContactInfoComponent) listCmp!: ListContactInfoComponent;

  personData!: PersonRegisterDto;

  treatmentHistoryData = treatmentData

  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  close(): void {
    this.activeModal.dismiss();
  }

  onContactSaved(): void {
    if (this.personData?.id) {
      this.listCmp.loadContactInfoList(this.personData.id); // refresca la tabla
    }
  }

}
