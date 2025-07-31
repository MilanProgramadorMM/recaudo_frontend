import { Component } from '@angular/core';
import { FlatpickrDirective } from '@core/directive/flatpickr.directive';
import { Select2 } from 'ng-select2-component'
import { PageTitleComponent } from "@components/page-title.component";
import { FileUploaderComponent } from '@components/file-uploader.component';

@Component({
  selector: 'add-doctors',
  standalone: true,
  imports: [FlatpickrDirective, Select2, PageTitleComponent,FileUploaderComponent],
  templateUrl: './add-doctors.component.html',
  styles: ``
})
export class AddDoctorsComponent {

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

  departmentOpts = [
    {
      label: '',
      data: {
        name: 'Select Departments',
      },
      options: [
        {
          value: 'Cardiology',
          label: 'Cardiology',
        },
        {
          value: 'Dermatology',
          label: 'Dermatology',
        },
        {
          value: 'Pediatrics',
          label: 'Pediatrics',
        },
        {
          value: 'Gastroenterology',
          label: 'Gastroenterology',
        },
        {
          value: 'Orthopedics',
          label: 'Orthopedics',
        },
        {
          value: 'Neurology',
          label: 'Neurology',
        },
        {
          value: 'Psychiatry',
          label: 'Psychiatry',
        },
        {
          value: 'Oncology',
          label: 'Oncology',
        },
        {
          value: 'Endocrinology',
          label: 'Endocrinology',
        },
        {
          value: 'Ophthalmology',
          label: 'Ophthalmology',
        },
      ],
    }
  ]
}
