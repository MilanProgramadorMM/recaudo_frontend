import { addOrSubtractDaysFromDate } from "@core/helper/utils"

const profile1 = 'assets/images/dr-profile/h-1.svg'
const profile2 = 'assets/images/dr-profile/h-2.svg'
const profile3 = 'assets/images/dr-profile/h-3.svg'

export type AbilitiesType = {
  title: string
  progress: number
  variant: string
}

export type ExperienceType = {
  image: string
  title: string
  subTitle: string
  description: string
  address: string
}

export type SpecialtyType = {
  icon: string
  title: string
}


export type AppointmentType = {
  id: string
  name: string
  date: Date
  phone: string
  reasonVisit: string
}

export const abilitiesData: AbilitiesType[] = [
  {
    title: 'Operations',
    progress: 40,
    variant: 'primary'
  },
  {
    title: 'Colestrol',
    progress: 50,
    variant: 'success'
  },
  {
    title: 'Therapy',
    progress: 34,
    variant: 'warning'
  },
  {
    title: 'Mediation',
    progress: 60,
    variant: 'info'
  },
]

export const experienceData: ExperienceType[] = [
  {
    image: profile1,
    title: "Brentwood's Health Company Senior CHO",
    subTitle: 'Head - Online Consultation - Fulltime',
    description: 'Dec 2020 - Present , 4 yer 1 mos',
    address: 'Sharon Lane Michigan City, IN 46360'
  },
  {
    image: profile2,
    title: "Hospital Dynamics Head Doctor",
    subTitle: 'General Cardiology - Fulltime',
    description: 'Dec 2016 - Nov 2020 , 5 yer 4 mos',
    address: 'Friendship Lane Santa Clara, CA 95050'
  },
  {
    image: profile3,
    title: "Florida Multi Specialist Hospital",
    subTitle: 'Echocardiology - Fulltime',
    description: 'Dec 2014 - Nov 2016 , 3 yer 2 mos',
    address: 'Simpson Street Bloomington, IL 61701'
  },
]

export const SpecialtyData: SpecialtyType[] = [
  {
    title: 'General adult cardiologists',
    icon: 'solar:user-check-rounded-bold-duotone'
  },
  {
    title: 'Cardiac imaging specialists',
    icon: 'solar:hand-heart-bold-duotone'
  },
  {
    title: 'Electrophysiologists',
    icon: 'solar:clipboard-heart-bold-duotone'
  },
  {
    title: 'Adult congenital heart specialists',
    icon: 'solar:heart-pulse-bold-duotone'
  },
  {
    title: 'Heart surgeons',
    icon: 'solar:heart-bold-duotone'
  },
]

export const appointmentsData: AppointmentType[] = [
  {
    id: '401',
    name: 'John Anderson',
    date: addOrSubtractDaysFromDate(10),
    phone: '(567) 890-1234',
    reasonVisit: 'Annual Check-up',
  },
  {
    id: '402',
    name: 'Jane Smith',
    date: addOrSubtractDaysFromDate(110),
    phone: '(456) 789-0123',
    reasonVisit: 'Consultation',
  },
  {
    id: '403',
    name: 'Mark Brown',
    date: addOrSubtractDaysFromDate(210),
    phone: '(345) 678-9012',
    reasonVisit: 'Lab Results Review',
  },
  {
    id: '404',
    name: 'Lisa White',
    date: addOrSubtractDaysFromDate(20),
    phone: '(234) 567-8901',
    reasonVisit: 'Cardiology Follow-up',
  },
  {
    id: '405',
    name: 'Tom Clark',
    date: addOrSubtractDaysFromDate(320),
    phone: '(123) 456-7890',
    reasonVisit: 'Blood Pressure Check',
  },
]