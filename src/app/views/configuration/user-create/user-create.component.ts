import { Component } from '@angular/core';
import { FlatpickrDirective } from '@core/directive/flatpickr.directive';
import { FormsModule } from '@angular/forms'; // Import this
import { Select2 } from 'ng-select2-component'
import { FileUploaderComponent } from '@components/file-uploader.component';
import { UserDto, UserService } from '@core/services/user.service';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from '@components/page-title.component';
import { NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { PersonCreateComponent } from '../person-create/person-create.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { PersonRegisterDto, PersonService } from '@core/services/person.service';
import { PatientDetailsComponent } from '@views/hospital/patient-details/patient-details.component';


@Component({
  selector: 'add-users',
  standalone: true,
  imports: [FlatpickrDirective, Select2, FileUploaderComponent,FormsModule],
  templateUrl: './user-create.component.html',
  styles: ``
})
export class UserCreateComponent {

  

}
