import { addOrSubtractDaysFromDate } from "@core/helper/utils"

export type InvoicesType = {
  id: string
  amount: string
  category: string
  name: string
  avatar: string
  date: Date
  dueDate:Date,
  status: 'Paid' | 'Cancelled' | 'Pending'
}

export const invoicesData: InvoicesType[] = [
  {
    id: "#PC1020@20",
    amount: "42,430",
    category: "Fashion",
    name: "Raul Villa",
    avatar: "assets/images/users/avatar-2.jpg",
    date: addOrSubtractDaysFromDate(32),
    dueDate: addOrSubtractDaysFromDate(65),
    status: "Paid",
},
{
    id: "#PC1240@25",
    amount: "416",
    category: "Electronics",
    name: "Fae Sims",
    avatar: "assets/images/users/avatar-3.jpg",
    date: addOrSubtractDaysFromDate(45),
    dueDate: addOrSubtractDaysFromDate(80),
    status: "Pending"
},
{
    id: "#PC1284@32",
    amount: "187",
    category: "Mobile Accessories",
    name: "David Roderick",
    avatar: "assets/images/users/avatar-4.jpg",
    date: addOrSubtractDaysFromDate(70),
    dueDate: addOrSubtractDaysFromDate(85),
    status: "Paid"
},
{
    id: "#PC1279@69",
    amount: "165",
    category: "Electronics",
    name: "James Zavel",
    avatar: "assets/images/users/avatar-5.jpg",
    date: addOrSubtractDaysFromDate(90),
    dueDate: addOrSubtractDaysFromDate(45),
    status: "Paid"
},
{
    id: "#PC1279@69",
    amount: "165",
    category: "Electronics",
    name: "Denese Martin",
    avatar: "assets/images/users/avatar-6.jpg",
    date: addOrSubtractDaysFromDate(99),
    dueDate: addOrSubtractDaysFromDate(60),
    status: "Cancelled"
},
{
    id: "#PC1276@33",
    amount: "192",
    category: "Watches",
    name: "Jack Nunnally",
    avatar: "assets/images/users/avatar-7.jpg",
    date: addOrSubtractDaysFromDate(65),
    dueDate: addOrSubtractDaysFromDate(21),
    status: "Cancelled"
},
{
    id: "#PC1278@29",
    amount: "159",
    category: "Bags",
    name: "Margaret Shaw",
    avatar: "assets/images/users/avatar-8.jpg",
    date: addOrSubtractDaysFromDate(128),
    dueDate: addOrSubtractDaysFromDate(95),
    status: "Paid"
},
{
    id: "#PC1271@96",
    amount: "259",
    category: "Cloth's",
    name: "Anthony Williams",
    avatar: "assets/images/users/avatar-9.jpg",
    date: addOrSubtractDaysFromDate(150),
    dueDate: addOrSubtractDaysFromDate(85),
    status: "Cancelled"
},
{
    id: "#PC1986@65",
    amount: "259",
    category: "Sofa",
    name: "Axie Barnes",
    avatar: "assets/images/users/avatar-10.jpg",
    date: addOrSubtractDaysFromDate(180),
    dueDate: addOrSubtractDaysFromDate(145),
    status: "Paid"
},
{
    id: "#PC1984@38",
    amount: "256",
    category: "Shoes",
    name: "Glen Morning",
    avatar: "assets/images/users/avatar-1.jpg",
    date: addOrSubtractDaysFromDate(165),
    dueDate: addOrSubtractDaysFromDate(111),
    status: "Pending"
}
]