import { addOrSubtractDaysFromDate } from "@core/helper/utils";

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


export type CustomersType = {
  id: string
  avatar:string
  name:string
  status: 'Active' | 'Block'
  shopRate: number  
  invoice: string
  totalAmount: number
  amountDue: number
  dueDate: Date
}

export const customersData: CustomersType[] = [
  {
    id: '521',
    name: 'Harriett E. Penix',
    avatar: avatar1,
    invoice: 'INV-103452',
    status: 'Active',
    totalAmount: 532.75,
    amountDue: 123.45,
    shopRate: 30,
    dueDate: addOrSubtractDaysFromDate(10)
  },
  {
    id: '522',
    name: 'Carol L. Simon',
    avatar: avatar2,
    invoice: 'INV-984321',
    status: 'Block',
    totalAmount: 689.50,
    amountDue: 234.56,
    shopRate: 70,
    dueDate: addOrSubtractDaysFromDate(150)
  },
  {
    id: '523',
    invoice: 'INV-567890',
    name: 'Rosa L. Winters',
    avatar: avatar3,
    status: 'Active',
    totalAmount: 745.60,
    amountDue: 498.76,
    shopRate: 40,
    dueDate: addOrSubtractDaysFromDate(250)
  },
  {
    id: '524',
    name: 'Jeremy C. Willi',
    avatar: avatar4,
    invoice: 'INV-876543',
    status: 'Active',
    totalAmount: 812.40,
    amountDue: 345.67,
    shopRate: 60,
    dueDate: addOrSubtractDaysFromDate(320)
  },
  {
    id: '525',
    name: 'James R. Alvares',
    avatar: avatar5,
    invoice: 'INV-192837',
    status: 'Block',
    totalAmount: 970.25,
    amountDue: 210.98,
    shopRate: 50,
    dueDate: addOrSubtractDaysFromDate(140)
  },
  {
    id: '526',
    name: 'Kathleen R. Stewart',
    avatar: avatar6,
    invoice: 'INV-283746',
    status: 'Block',
    totalAmount: 524.80,
    amountDue: 432.10,
    shopRate: 80,
    dueDate: addOrSubtractDaysFromDate(540)
  },
  {
    id: '527',
    name: 'Debra R. Morgan',
    avatar: avatar7,
    invoice: 'INV-465728',
    status: 'Active',
    totalAmount: 789.90,
    amountDue: 187.65,
    shopRate: 60,
    dueDate: addOrSubtractDaysFromDate(640)
  },
  {
    id: '528',
    name: 'Mark J. Scott',
    avatar: avatar8,
    invoice: 'INV-372819',
    status: 'Active',
    totalAmount: 632.55,
    amountDue: 321.09,
    shopRate: 80,
    dueDate: addOrSubtractDaysFromDate(180)
  },
  {
    id: '529',
    name: 'Connie R. Kilmer',
    avatar: avatar9,
    invoice: 'INV-948576',
    status: 'Block',
    totalAmount: 915.30,
    amountDue: 543.21,
    shopRate: 30,
    dueDate: addOrSubtractDaysFromDate(920)
  },
  {
    id: '530',
    name: 'Paul K. Coyle',
    avatar: avatar10,
    invoice: 'INV-562738',
    status: 'Active',
    totalAmount: 750.75,
    amountDue: 321.09,
    shopRate: 70,
    dueDate: addOrSubtractDaysFromDate(365)
  },
]