const avatar1 = 'assets/images/users/avatar-1.jpg';
const avatar10 = 'assets/images/users/avatar-10.jpg';
const avatar2 = 'assets/images/users/avatar-2.jpg';
const avatar3 = 'assets/images/users/avatar-3.jpg';
const avatar4 = 'assets/images/users/avatar-4.jpg';
const avatar5 = 'assets/images/users/avatar-5.jpg';
const avatar6 = 'assets/images/users/avatar-6.jpg';
const avatar7 = 'assets/images/users/avatar-7.jpg';
const avatar8 = 'assets/images/users/avatar-8.jpg';
const avatar9 = 'assets/images/users/avatar-9.jpg';

export type PatientsType = {
  id: string
  name: string
  avatar: string;
  gender: 'Male' | 'Female'
  phone:string
  bloodGroup: string
  address: string
  physician: string
  birthDate: string
}

export const patientsData: PatientsType[] = [
  {
    id: '801',
    gender: 'Male',
    bloodGroup: 'A+',
    address: '123 Main St, City, ST',
    physician: 'Dr. James D. Roger',
    name: 'Harriett E. Penix',
    avatar: avatar1,
    birthDate: '1 January 1980',
    phone: '(567) 890-1234'
  },
  {
    id: '802',
    gender: 'Male',
    bloodGroup: 'O+',
    address: '456 Elm St, City, ST',
    physician: 'Dr. Morgan H. Beck',
    name: 'Carol L. Simon',
    avatar: avatar2,
    birthDate: '2 February 1975',
    phone: '(456) 789-0123'
  },
  {
    id: '803',
    gender: 'Female',
    bloodGroup: 'A-',
    address: '789 Pine St, City, ST',
    physician: 'Dr. Terry J. Bowers',
    name: 'Rosa L. Winters',
    avatar: avatar3,
    phone: '(345) 678-9012',
    birthDate: '1 May 1989',
  },
  {
    id: '804',
    gender: 'Male',
    bloodGroup: 'B+',
    address: '101 Maple St, City, ST',
    physician: 'Dr. James D. Roger',
    name: 'Jeremy C. Willi',
    avatar: avatar4,
    birthDate: '4 April 1985',
    phone: '(234) 567-8901'
  },
  {
    id: '805',
    gender: 'Male',
    bloodGroup: 'AB-',
    address: '202 Oak St, City, ST',
    physician: 'Dr. Kelli H. Bailey',
    name: 'James R. Alvares',
    avatar: avatar5,
    birthDate: '5 May 1982',
    phone: '(123) 456-7890'
  },
  {
    id: '806',
    gender: 'Male',
    bloodGroup: 'O-',
    address: '303 Cedar St, City, ST',
    physician: 'Dr. Terry J. Bowers',
    name: 'Kathleen R. Stewart',
    avatar: avatar6,
    birthDate: '6 June 1978',
    phone: '1-567-890-1234'
  },
  {
    id: '807',
    gender: 'Female',
    bloodGroup: 'A+',
    address: '404 Birch St, City, ST',
    physician: 'Dr. Kelli H. Bailey',
    name: 'Debra R. Morgan',
    avatar: avatar7,
    birthDate: '7 July 1987',
    phone: '(456) 789 0123'
  },
  {
    id: '808',
    gender: 'Male',
    bloodGroup: 'B-',
    address: '505 Walnut St, City, ST',
    physician: 'Dr. Carlos McCollum',
    name: 'Mark J. Scott',
    avatar: avatar8,
    birthDate: '8 August 1981',
    phone: '345 678 9012'
  },
  {
    id: '809',
    gender: 'Female',
    bloodGroup: 'AB+',
    address: '606 Spruce St, City, ST',
    physician: 'Dr. Morgan H. Beck',
    name: 'Connie R. Kilmer',
    avatar: avatar8,
    birthDate: '9 September 1979',
    phone: '234.567.8901'
  },
  {
    id: '810',
    gender: 'Female',
    bloodGroup: 'O+',
    address: '707 Redwood St, City, ST',
    physician: 'Dr. Kelli H. Bailey',
    name: 'Paul K. Coyle',
    avatar: avatar8,
    birthDate: '10 October 1983',
    phone: '123-456-7890'
  },
]