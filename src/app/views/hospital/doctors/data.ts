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

export type DoctorListType = {
  id: string
  name: string
  image: string
  specialty: string
  number: string
  email: string
  timing: string
  experience: number
}

export const doctorListData: DoctorListType[] = [
  {
    id: '501',
    image: avatar3,
    name: 'Dr. James D. Roger',
    specialty: 'Cardiology',
    number: '96 303-975-3491',
    email: 'jamesdroger@armyspy.com',
    timing: 'Mon-Fri: 9 AM - 5 PM',
    experience: 14
  },
  {
    id: '502',
    image: avatar2,
    name: ' Dr. Morgan H. Beck',
    specialty: 'Dermatology',
    number: '56 408-272-5403',
    email: 'morganhbeck@rhyta.com',
    timing: 'Mon-Fri: 10 AM - 6 PM',
    experience: 9
  },
  {
    id: '503',
    image: avatar4,
    name: 'Dr. Terry J. Bowers',
    specialty: 'Pediatrics',
    number: '92 845-693-5084',
    email: 'terryjbowers@teleworm.us',
    timing: 'Tue-Sat: 8 AM - 4 PM',
    experience: 12
  },
  {
    id: '504',
    image: avatar5,
    name: 'Dr. Carlos McCollum',
    specialty: 'Orthopedics',
    number: '68 036961 83 22',
    email: 'carloslmccollum@rhyta.com',
    timing: 'Mon-Thu: 9 AM - 5 PM',
    experience: 17
  },
  {
    id: '505',
    image: avatar6,
    name: ' Dr. Jeanetta D. Hovey',
    specialty: 'Neurology',
    number: '62 0951 29 41 23',
    email: 'jeanettadhovey@jourrapide.com',
    timing: 'Wed-Sat: 1 PM - 9 PM',
    experience: 10
  },
  {
    id: '506',
    image: avatar7,
    name: 'Dr. Erma D. Coffman',
    specialty: 'Gastroenterology',
    number: '44 06588 19 07 95',
    email: 'ermadcoffman@jourrapide.com',
    timing: 'Mon-Sat: 6 AM - 2 PM',
    experience: 6
  },
  {
    id: '507',
    image: avatar8,
    name: 'Dr. Dorian T. Lackey',
    specialty: 'Oncology',
    number: '41 02161 72 22 77',
    email: 'doriantlackey@teleworm.us',
    timing: 'Fri-Sun: 9 AM - 5 PM',
    experience: 4
  },
  {
    id: '508',
    image: avatar9,
    name: 'Dr. Kelli H. Bailey',
    specialty: 'Psychiatry',
    number: '99 073 38 56 39',
    email: 'kelligbailey@rhyta.com',
    timing: 'Mon-Fri: 8 AM - 4 PM',
    experience: 12
  },
  {
    id: '509',
    image: avatar10,
    name: 'Dr. Robert A. Camp',
    specialty: 'Endocrinology',
    number: '9 08684 81 00 91',
    email: 'robertacampbell@armyspy.com',
    timing: 'Tue-Sat: 9 AM - 5 PM',
    experience: 19
  },
  {
    id: '510',
    image: avatar1,
    name: 'Dr. Jewel B. Odom',
    specialty: 'Ophthalmology',
    number: '41 0451 67 15 47',
    email: 'jewelbodom@armyspy.com',
    timing: 'Mon-Thu: 10 AM - 6 PM',
    experience: 3
  },
]