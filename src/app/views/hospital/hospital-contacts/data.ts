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


export type ContactType = {
  id: string
  name: string
  image: string
  specialty: string
  email: string
  timing: string
  location: string
  locationKm: string
  ratingStar: number
}

export const contactList: ContactType[] = [
  {
    id: '501',
    image: avatar3,
    name: 'Dr. James D. Roger',
    specialty: 'Cardiology',
    email: 'jamesdroger@armyspy.com',
    timing: 'Mon-Fri: 9 AM - 5 PM',
    location: '3544 Rainbow Drive Akron, OH',
    locationKm: '600m',
    ratingStar: 4.5,
  },
  {
    id: '502',
    image: avatar2,
    name: ' Dr. Morgan H. Beck',
    specialty: 'Dermatology',
    email: 'morganhbeck@rhyta.com',
    timing: 'Mon-Fri: 10 AM - 6 PM',
    location: '1234 Maple Street Springfield , USA',
    locationKm: '1.4km',
    ratingStar: 4.4,
  },
  {
    id: '503',
    image: avatar4,
    name: 'Dr. Terry J. Bowers',
    specialty: 'Pediatrics',
    email: 'terryjbowers@teleworm.us',
    timing: 'Tue-Sat: 8 AM - 4 PM',
    location: '1487 Marconi St Pimville 1809',
    locationKm: '1.1km',
    ratingStar: 4.2,
  },
  {
    id: '504',
    image: avatar5,
    name: 'Dr. Carlos McCollum',
    specialty: 'Orthopedics',
    email: 'carloslmccollum@rhyta.com',
    timing: 'Mon-Thu: 9 AM - 5 PM',
    location: '2425 Bhoola Road Nahoon 12, USA',
    locationKm: '900m',
    ratingStar: 4.3,
  },
  {
    id: '505',
    image: avatar6,
    name: ' Dr. Jeanetta D. Hovey',
    specialty: 'Neurology',
    email: 'jeanettadhovey@jourrapide.com',
    timing: 'Wed-Sat: 1 PM - 9 PM',
    location: 'Casper Fagel straat 331 NT, USA',
    locationKm: '10km',
    ratingStar: 4.1,
  },
  {
    id: '506',
    image: avatar7,
    name: 'Dr. Erma D. Coffman',
    specialty: 'Gastroenterology',
    email: 'ermadcoffman@jourrapide.com',
    timing: 'Mon-Sat: 6 AM - 2 PM',
    location: 'Sneeuwbes 17 2318 AR Leiden',
    locationKm: '6km',
    ratingStar: 4.2,
  },
  {
    id: '507',
    image: avatar8,
    name: 'Dr. Dorian T. Lackey',
    specialty: 'Oncology',
    email: 'doriantlackey@teleworm.us',
    timing: 'Fri-Sun: 9 AM - 5 PM',
    location: '85 Elkview Drive Miami, FL 33128',
    locationKm: '2.1km',
    ratingStar: 3.5,
  },
  {
    id: '508',
    image: avatar9,
    name: 'Dr. Kelli H. Bailey',
    specialty: 'Psychiatry',
    email: 'kelligbailey@rhyta.com',
    timing: 'Mon-Fri: 8 AM - 4 PM',
    location: '1468 Mahlon Street Dunellen, NJ',
    locationKm: '500m',
    ratingStar: 4.4,
  },
]