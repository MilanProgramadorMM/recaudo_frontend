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

export type OrderType = {
  id: string
  name: string;
  avatar: string;
  product: {
    p1: string
    p2?: string
  }
  quantity: {
    p1: number
    p2?: number
  }
  total: number
  date: Date
  paymentStatus: 'Completed' | 'Pending' | 'Failed'
  orderStatus: 'Delivered' | 'Cancel' | 'Ready To Pick' | 'Dispatched'
}

export const orderData: OrderType[] = [
  {
    id: '201',
    avatar: avatar1,
    name: 'Harriett E. Penix',
    product: {
      p1: 'Men White Slim Fit T-shirt',
      p2: 'HYPERX Cloud Gaming Headphone'
    },
    quantity: {
      p1: 2,
      p2: 1
    },
    total: 176.41,
    date: addOrSubtractDaysFromDate(12),
    paymentStatus: 'Completed',
    orderStatus: 'Delivered'
  },
  {
    id: '202',
    name: 'Carol L. Simon',
    avatar: avatar2,
    product: {
      p1: 'Minetta Rattan Swivel Premium Chair',
      p2: 'Sleepify Luno 4 Seater Fabric Sofa'
    },
    quantity: {
      p1: 3,
      p2: 1
    },
    total: 2312,
    date: addOrSubtractDaysFromDate(12),
    paymentStatus: 'Failed',
    orderStatus: 'Cancel'
  },
  {
    id: '203',
    name: 'Rosa L. Winters',
    avatar: avatar3,
    product: {
      p1: '55 L Laptop Backpack fits upto 16 In.',
      p2: 'Men White Slim Fit T-shirt'
    },
    quantity: {
      p1: 4,
      p2: 2
    },
    total: 677.09,
    date: addOrSubtractDaysFromDate(12),
    paymentStatus: 'Pending',
    orderStatus: 'Ready To Pick'
  },
  {
    id: '204',
    name: 'Jeremy C. Willi',
    avatar: avatar4,
    product: {
      p1: 'Sleepify Luno 4 Seater Fabric Sofa',
      p2: 'HYPERX Cloud Gaming Headphone'
    },
    quantity: {
      p1: 2,
      p2: 1
    },
    total: 532.98,
    date: addOrSubtractDaysFromDate(12),
    paymentStatus: 'Failed',
    orderStatus: 'Cancel'
  },
  {
    id: '205',
    name: 'James R. Alvares',
    avatar: avatar5,
    product: {
      p1: '55 L Laptop Backpack fits upto 16 In...'
    },
    quantity: {
      p1: 2,
    },
    total: 233.15,
    date: addOrSubtractDaysFromDate(12),
    paymentStatus: 'Completed',
    orderStatus: 'Cancel'
  },
  {
    id: '206',
    avatar: avatar6,
    name: 'Kathleen R. Stewart',
    product: {
      p1: 'Navy Blue Over Size T-shirt For Men',
      p2: 'Men White Slim Fit T-shirt'
    },
    quantity: {
      p1: 5,
      p2: 6
    },
    total: 772.44,
    date: addOrSubtractDaysFromDate(12),
    paymentStatus: 'Pending',
    orderStatus: 'Ready To Pick'
  },
  {
    id: '207',
    name: 'Debra R. Morgan',
    avatar: avatar7,
    product: {
      p1: 'Sleepify Luno 4 Seater Fabric Sofa',
    },
    quantity: {
      p1: 2,
    },
    total: 425.56,
    date: addOrSubtractDaysFromDate(12),
    paymentStatus: 'Completed',
    orderStatus: 'Delivered'
  },
  {
    id: '208',
    name: 'Mark J. Scott',
    avatar: avatar8,
    product: {
      p1: "Jordan Jumpman MVP Men's Shoes Size",
      p2: 'Men White Slim Fit T-shirt'
    },
    quantity: {
      p1: 1,
      p2: 2
    },
    total: 754.32,
    date: addOrSubtractDaysFromDate(12),
    paymentStatus: 'Failed',
    orderStatus: 'Dispatched'
  },
  {
    id: '209',
    name: 'Connie R. Kilmer',
    avatar: avatar9,
    product: {
      p1: "55 L Laptop Backpack fits upto 16 In",
      p2: 'HYPERX Cloud Gaming Headphonet'
    },
    quantity: {
      p1: 3,
      p2: 1
    },
    total: 533.76,
    date: addOrSubtractDaysFromDate(12),
    paymentStatus: 'Completed',
    orderStatus: 'Delivered'
  },
  {
    id: '210',
    name: 'Paul K. Coyle',
    avatar: avatar10,
    product: {
      p1: "Jordan Jumpman MVP Men's Shoes Size",
      p2: 'Navy Blue Over Size T-shirt For Men'
    },
    quantity: {
      p1: 1,
      p2: 3
    },
    total: 423,
    date: addOrSubtractDaysFromDate(12),
    paymentStatus: 'Completed',
    orderStatus: 'Dispatched'
  },
]