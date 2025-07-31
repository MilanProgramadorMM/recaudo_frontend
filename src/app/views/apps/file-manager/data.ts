import { addOrSubtractDaysFromDate } from "@core/helper/utils"

const avatar1 = 'assets/images/users/avatar-1.jpg';
const avatar2 = 'assets/images/users/avatar-2.jpg';
const avatar3 = 'assets/images/users/avatar-3.jpg';
const avatar4 = 'assets/images/users/avatar-4.jpg';
const avatar5 = 'assets/images/users/avatar-5.jpg';

export type QuickAccessType = {
  icon: string
  title: string
  files: number
  storage: number
  isStar?: boolean
  progress: number
  variant: string
}

export type FilesType = {
  id: string
  icon: string
  name: string;
  avatar: string;
  email: string;
  title: string
  fileVariant: string
  file: string
  date: Date
  size: number
  members: {
    text: string,
    variant: string
  }[]
}

export const quickAccessData: QuickAccessType[] = [
  {
    icon: 'logos:google-meet',
    title: 'Google Media',
    files: 38,
    storage: 44.6,
    isStar: true,
    progress: 94,
    variant: 'primary'
  },
  {
    icon: 'logos:google-drive',
    title: 'Google Drive',
    files: 42,
    storage: 38.80,
    progress: 78,
    variant: 'success'
  },
  {
    icon: 'logos:dropbox',
    title: 'Dropbox',
    files: 98,
    storage: 44.86,
    progress: 92,
    variant: 'info'
  },
  {
    icon: 'logos:cloudlinux',
    title: 'Cloud Storage',
    files: 56,
    storage: 20.63,
    isStar: true,
    progress: 40,
    variant: 'secondary'
  },
]

export const filesData: FilesType[] = [
  {
    id: '2001',
    title: 'Dashboard-requirements.docx',
    icon: 'ti-file-type-docx',
    file: '12 Docx',
    fileVariant: 'info',
    date: addOrSubtractDaysFromDate(21),
    size: 128,
    name: 'Harriett E. Penix',
    email: 'harriettepenix@rhyta.com',
    avatar: avatar1,
    members: [
      {
        text: 'D',
        variant: 'success'
      },
      {
        text: 'K',
        variant: 'primary'
      },
      {
        text: 'H',
        variant: 'secondary'
      },
      {
        text: 'L',
        variant: 'warning'
      },
      {
        text: 'G',
        variant: 'info'
      },
    ]
  },
  {
    id: '2002',
    title: 'ocen-dashboard.pdf',
    icon: 'ti-file-type-pdf',
    file: '18 Pdf',
    fileVariant: 'danger',
    date: addOrSubtractDaysFromDate(210),
    size: 521,
    name: 'Carol L. Simon',
    email: 'carollcimon@jourrapide.com',
    avatar: avatar2,
    members: [
      {
        text: 'Y',
        variant: 'danger'
      },
      {
        text: 'L',
        variant: 'success'
      },
      {
        text: 'O',
        variant: 'dark'
      },
      {
        text: 'J',
        variant: 'warning'
      },
      {
        text: 'G',
        variant: 'primary'
      },
    ]
  },
  {
    id: '2003',
    title: 'Dashboard tech requirements',
    icon: 'ti-files',
    file: '12 File',
    fileVariant: 'warning',
    date: addOrSubtractDaysFromDate(100),
    size: 7.2,
    name: 'Rosa L. Winters',
    email: 'rosalwinters@teleworm.us',
    avatar: avatar3,
    members: [
      {
        text: 'A',
        variant: 'primary'
      },
      {
        text: 'B',
        variant: 'warning'
      },
      {
        text: 'R',
        variant: 'danger'
      },
      {
        text: 'C',
        variant: 'secondary'
      },
      {
        text: 'U',
        variant: 'dark'
      },
    ]
  },
  {
    id: '2004',
    title: 'dashboard.jpg',
    icon: 'ti-file-type-jpg',
    file: '172 Jpg Photo',
    fileVariant: 'primary',
    date: addOrSubtractDaysFromDate(354),
    size: 54.2,
    name: 'Jeremy C. Willi',
    email: 'jeremycwilliams@dayrep.com',
    avatar: avatar4,
    members: [
      {
        text: 'L',
        variant: 'warning'
      },
      {
        text: 'Y',
        variant: 'secondary'
      },
      {
        text: 'A',
        variant: 'dark'
      },
      {
        text: 'R',
        variant: 'primary'
      },
      {
        text: 'V',
        variant: 'info'
      },
    ]
  },
  {
    id: '2005',
    title: 'admin-hospital.zip',
    icon: 'ti-file-type-zip',
    file: 'admin-hospital.zip',
    fileVariant: 'success',
    date: addOrSubtractDaysFromDate(45),
    size: 8.3,
    name: 'James R. Alvares',
    email: 'jamesralvares@jourrapide.com',
    avatar: avatar5,
    members: [
      {
        text: 'G',
        variant: 'dark'
      },
      {
        text: 'O',
        variant: 'danger'
      },
      {
        text: 'W',
        variant: 'secondary'
      },
      {
        text: 'A',
        variant: 'primary'
      },
      {
        text: 'K',
        variant: 'warning'
      },
    ]
  },
]