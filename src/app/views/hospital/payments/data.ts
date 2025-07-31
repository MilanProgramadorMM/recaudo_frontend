import { addOrSubtractDaysFromDate } from "@core/helper/utils"


export type PaymentStatType = {
  icon: string
  title: string
  count: number
  isMonth?: boolean
}

export type PaymentListType = {
  id: number,
  patientName: string,
  doctor: string,
  insurance: string,
  paymentType: string,
  date: Date,
  amount: number,
  tax: number,
  discount: number,
  total: number,
}

export const paymentStatData: PaymentStatType[] = [
  {
    icon: 'solar:users-group-two-rounded-bold',
    title: 'Number of Patients',
    count: 3421,
    isMonth: true
  },
  {
    icon: 'solar:bill-list-bold',
    title: 'Total Bill Payments',
    count: 2342,
  },
  {
    icon: 'solar:bill-check-bold',
    title: 'Total Paid Bills',
    count: 1310,
  },
  {
    icon: 'solar:bill-cross-bold',
    title: 'Total Unpaid Bills',
    count: 1203,
  },
]

export const paymentListData:PaymentListType[] = [
  {
    id: 1,
    patientName: "Keith Jacobson",
    doctor: "Dr.Justin Williams",
    insurance: "Tata MediCare Insurance",
    paymentType: "Cashless",
    date: addOrSubtractDaysFromDate(1),
    amount: 1500,
    tax: 15,
    discount: 10,
    total: 1500
  },
  {
    id: 2,
    patientName: "Fred Godina",
    doctor: "Dr.Thomas Fant",
    insurance: "Star Health insurance",
    paymentType: "Cashless",
    date:addOrSubtractDaysFromDate(2),
    amount: 1500,
    tax: 10,
    discount: 10,
    total: 3500
  },
  {
    id: 3,
    patientName: "Greg Crosby",
    doctor: "Dr.Aretha Garland",
    insurance: "Apollo Health Insurance",
    paymentType: "Cashless",
    date: addOrSubtractDaysFromDate(4),
    amount: 1500,
    tax: 11,
    discount: 10,
    total: 5000
  },
  {
    id: 4,
    patientName: "Jennifer Doss",
    doctor: "Dr.Justin Williams",
    insurance: "LIC Health Insurance",
    paymentType: "Cashless",
    date:addOrSubtractDaysFromDate(6),
    amount: 1500,
    tax: 10,
    discount: 10,
    total: 1500
  },
  {
    id: 5,
    patientName: "Peggy Doe",
    doctor: "Dr.Thomas Fant",
    insurance: "National Insurance",
    paymentType: "Cashless",
    date: addOrSubtractDaysFromDate(3),
    amount: 1500,
    tax: 18,
    discount: 10,
    total: 3500
  },
  {
    id: 6,
    patientName: "Donald Gardner",
    doctor: "Dr.Aretha Garland",
    insurance: "Star Health insurance",
    paymentType: "Cashless",
    date:addOrSubtractDaysFromDate(8),
    amount: 1500,
    tax: 18,
    discount: 10,
    total: 5000
  },
  {
    id: 7,
    patientName: "Anna Campbel",
    doctor: "Dr.Joshua Ampt",
    insurance: "LIC Health Insurance",
    paymentType: "Cashless",
    date:addOrSubtractDaysFromDate(10),
    amount: 1500,
    tax: 10,
    discount: 10,
    total: 5000
  },
  {
    id: 8,
    patientName: "Rachel Fox",
    doctor: "Dr.Elijah Wylde",
    insurance: "General Insurance Limited",
    paymentType: "Cashless",
    date: addOrSubtractDaysFromDate(12),
    amount: 1322,
    tax: 18,
    discount: 10,
    total: 2300
  },
  {
    id: 9,
    patientName: "Sebastian Barrow",
    doctor: "Dr.Madeline Panton",
    insurance: "Insurance Company Limited",
    paymentType: "Cashless",
    date: addOrSubtractDaysFromDate(13),
    amount: 1500,
    tax: 10,
    discount: 10,
    total: 4800
  },
  {
    id: 10,
    patientName: "Hugo Grey-Smith",
    doctor: "Dr.Angus Rich",
    insurance: "LIC Health Insurance",
    paymentType: "Cashless",
    date: addOrSubtractDaysFromDate(21),
    amount: 2500,
    tax: 18,
    discount: 10,
    total: 4000
  }
]