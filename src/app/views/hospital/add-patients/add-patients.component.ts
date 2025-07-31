import { Component } from '@angular/core';
import { PageTitleComponent } from "@components/page-title.component";
import { FileUploaderComponent } from "@components/file-uploader.component";
import { Select2, } from 'ng-select2-component';
import { FlatpickrDirective } from '@core/directive/flatpickr.directive';

@Component({
  selector: 'add-patients',
  standalone: true,
  imports: [PageTitleComponent, FileUploaderComponent, Select2, FlatpickrDirective],
  templateUrl: './add-patients.component.html',
  styles: ``
})
export class AddPatientsComponent {
  genderOpts = [
    {
      label: 'Select Gender',
      data: {
        name: 'Select Gender',
      },
      options: [
        {
          value: 'Male',
          label: 'Male',
        },
        {
          value: 'Female',
          label: 'Female',
        },
      ],
    }
  ]

  maritalOpts = [
    {
      label: 'Select Status',
      data: {
        name: 'Select Status',
      },
      options: [
        {
          value: 'Married',
          label: 'Married',
        },
        {
          value: 'Unmarried',
          label: 'Unmarried',
        },
      ],
    }
  ]
}
