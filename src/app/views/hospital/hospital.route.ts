import type { Route } from "@angular/router";
import { DoctorsComponent } from "./doctors/doctors.component";
import { DoctorsDetailsComponent } from "./doctors-details/doctors-details.component";
import { AddDoctorsComponent } from "./add-doctors/add-doctors.component";
import { PatientsComponent } from "./patients/patients.component";
import { PatientDetailsComponent } from "./patient-details/patient-details.component";
import { AddPatientsComponent } from "./add-patients/add-patients.component";
import { AppointmentsComponent } from "./appointments/appointments.component";
import { PaymentsComponent } from "./payments/payments.component";
import { DepartmentsComponent } from "./departments/departments.component";
import { HospitalContactsComponent } from "./hospital-contacts/hospital-contacts.component";
import { ReviewsComponent } from "./reviews/reviews.component";
import { StaffsComponent } from "./staffs/staffs.component";

export const HOSPITAL_ROUTES: Route[] = [
  {
    path: 'doctors',
    component: DoctorsComponent,
    data: { title: 'Doctors' }
  },
  {
    path: 'doctors-details',
    component: DoctorsDetailsComponent,
    data: { title: 'Doctors Detail' }
  },
  {
    path: 'add-doctors',
    component: AddDoctorsComponent,
    data: { title: 'Add Doctors' }
  },
  {
    path: 'patients',
    component: PatientsComponent,
    data: { title: 'Patients' }
  },
  {
    path: 'patients-details',
    component: PatientDetailsComponent,
    data: { title: 'Patient Details' }
  },
  {
    path: 'add-patients',
    component: AddPatientsComponent,
    data: { title: 'Add Patients' }
  },
  {
    path: 'appointments',
    component: AppointmentsComponent,
    data: { title: 'Appointments' }
  },
  {
    path: 'payments',
    component: PaymentsComponent,
    data: { title: 'Payments' }
  },
  {
    path: 'departments',
    component: DepartmentsComponent,
    data: { title: 'Departments' }
  },
  {
    path: 'reviews',
    component: ReviewsComponent,
    data: { title: 'Reviews' }
  },
  {
    path: 'hospital-contacts',
    component: HospitalContactsComponent,
    data: { title: 'Hospital Contacts' }
  },
  {
    path: 'staffs',
    component: StaffsComponent,
    data: { title: 'Staff' }
  },
]