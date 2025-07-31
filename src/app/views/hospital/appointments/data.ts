import { addOrSubtractDaysFromDate } from "@core/helper/utils"

const doctors5 = 'assets/images/users/doctors/dr-five.jpg';
const doctors4 = 'assets/images/users/doctors/dr-four.jpg';
const doctors1 = 'assets/images/users/doctors/dr-one.jpg';
const doctors6 = 'assets/images/users/doctors/dr-six.jpg';
const doctors3 = 'assets/images/users/doctors/dr-three.jpg';
const doctors2 = 'assets/images/users/doctors/dr-two.jpg';

export type AppointmentType = {
  id: string
  name: string
  age: number,
  doctorName: string;
  avatar: string;
  date: Date
  phone: string
  department: string
}


export type AppointmentStatType = {
  icon: string
  title: string
  count: number
  patients: {
    title: string
    patientsCount: number
  }[]
}

export const appointmentStatData: AppointmentStatType[] = [
  {
    icon: 'solar:document-medicine-bold',
    title: 'Total Appointment',
    count: 125,
    patients: [
      {
        title: 'Dermatology',
        patientsCount: 67
      },
      {
        title: 'Cardiology',
        patientsCount: 23
      },
    ],
  },
  {
    icon: 'solar:close-square-bold',
    title: 'Appointment Cancelled',
    count: 67,
    patients: [
      {
        title: 'Gastroenterology',
        patientsCount: 56
      },
      {
        title: 'Nephrology',
        patientsCount: 11
      },
    ],
  },
  {
    icon: 'solar:calendar-date-bold',
    title: 'Appointment Pending',
    count: 201,
    patients: [
      {
        title: 'Oncology',
        patientsCount: 132
      },
      {
        title: 'Orthopedics',
        patientsCount: 59
      },
    ],
  },
  {
    icon: 'solar:user-heart-bold',
    title: 'Total Patient',
    count: 134,
    patients: [
      {
        title: 'Ophthalmology',
        patientsCount: 100
      },
      {
        title: 'Endocrinology',
        patientsCount: 34
      },
    ],
  },
]

export const appointmentsData: AppointmentType[] = [
  {
    id: '401',
    name: 'John Anderson',
    age: 38,
    date: addOrSubtractDaysFromDate(10),
    phone: '(567) 890-1234',
    department: 'Cardiology',
    doctorName: 'Dr. Master Gulati',
    avatar: doctors1,
  },
  {
    id: '402',
    name: 'Jane Smith',
    age: 45,
    date: addOrSubtractDaysFromDate(110),
    phone: '(456) 789-0123',
    department: 'Dermatology',
    doctorName: 'Dr. David Wilson',
    avatar: doctors4,
  },
  {
    id: '403',
    name: 'Mark Brown',
    age: 52,
    date: addOrSubtractDaysFromDate(210),
    phone: '(345) 678-9012',
    department: 'Pediatrics',
    doctorName: 'Dr. Robert Brown',
    avatar: doctors2,
  },
  {
    id: '404',
    name: 'Lisa White',
    age: 34,
    date: addOrSubtractDaysFromDate(20),
    phone: '(234) 567-8901',
    department: 'Orthopedics',
    doctorName: 'Dr. Michael Johnson',
    avatar: doctors5,
  },
  {
    id: '405',
    name: 'Tom Clark',
    age: 29,
    date: addOrSubtractDaysFromDate(320),
    phone: '(123) 456-7890',
    department: 'Neurology',
    doctorName: 'Dr. Emily Davis',
    avatar: doctors3,
  },
  {
    id: '406',
    name: 'Susan Green',
    age: 40,
    date: addOrSubtractDaysFromDate(98),
    phone: '(567) 890-1234',
    department: 'Gastroenterology',
    doctorName: 'Dr. Alice Smith',
    avatar: doctors6,
  },
  {
    id: '407',
    name: 'Robert Walker',
    age: 55,
    date: addOrSubtractDaysFromDate(98),
    phone: '(567) 890-1234',
    department: 'Oncology',
    doctorName: ' Dr. Anna Martinez',
    avatar: doctors5,
  },
  {
    id: '408',
    name: 'Jane Smith',
    age: 45,
    date: addOrSubtractDaysFromDate(110),
    phone: '(456) 789-0123',
    department: 'Dermatology',
    doctorName: 'Dr. David Wilson',
    avatar: doctors4,
  },
]