import { addOrSubtractDaysFromDate } from "@core/helper/utils"

const product1 = 'assets/images/products/p-1.png';
const product13 = 'assets/images/products/p-13.png';
const product14 = 'assets/images/products/p-14.png';
const product15 = 'assets/images/products/p-15.png';
const product2 = 'assets/images/products/p-2.png';
const product3 = 'assets/images/products/p-3.png';
const product4 = 'assets/images/products/p-4.png';
const product5 = 'assets/images/products/p-5.png';
const product6 = 'assets/images/products/p-6.png';
const product7 = 'assets/images/products/p-7.png';
const product8 = 'assets/images/products/p-8.png';

export type ProductType = {
  id: string
  name: string
  image: string
  description: string
  date: Date
  price: number
  category: string
  quantity: number
  status: 'Active' | 'Inactive'
}

export const productData: ProductType[] = [
  {
    id: '1',
    name: 'Men White Slim Fit T-shirt',
    description: '100% cotton t-shirt in white',
    image: product1,
    date: addOrSubtractDaysFromDate(50),
    price: 70.90,
    quantity: 890,
    category: 'Fashion',
    status: 'Active',
  },
  {
    id: '2',
    name: '55 L Laptop Backpack fits upto 16 In..',
    description: 'Durable hiking backpack',
    image: product2,
    date: addOrSubtractDaysFromDate(150),
    price: 100.90,
    quantity: 923,
    category: 'Bags',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Minetta Rattan Swivel Premium Chair',
    description: 'Ergonomic Villa chair',
    image: product3,
    date: addOrSubtractDaysFromDate(180),
    price: 300.00,
    quantity: 231,
    category: 'Furniture',
    status: 'Active',
  },
  {
    id: '4',
    name: 'HYPERX Cloud Gaming Headphone',
    description: 'Noise-canceling wireless headphones',
    image: product4,
    date: addOrSubtractDaysFromDate(250),
    price: 230.90,
    quantity: 413,
    category: 'Headphone',
    status: 'Inactive',
  },
  {
    id: '5',
    name: 'Men Winter Knitted Sweater',
    description: 'Waterproof windbreaker jacket',
    image: product5,
    date: addOrSubtractDaysFromDate(350),
    price: 90.00,
    quantity: 120,
    category: 'Winter Fashion',
    status: 'Active',
  },
  {
    id: '6',
    name: "Jordan Jumpman MVP Men's Shoes Size",
    description: 'Comfortable running shoes',
    image: product6,
    date: addOrSubtractDaysFromDate(350),
    price: 400.00,
    quantity: 264,
    category: 'Foot Ware',
    status: 'Inactive',
  },
  {
    id: '7',
    name: "Sleepify Luno 4 Seater Fabric Sofa",
    description: 'Modern three-piece sofa set',
    image: product7,
    date: addOrSubtractDaysFromDate(350),
    price: 340.00,
    quantity: 372,
    category: 'Furniture',
    status: 'Inactive',
  },
  {
    id: '8',
    name: "Navy Blue Over Size T-shirt For Men",
    description: '100% cotton t-shirt in blue',
    image: product8,
    date: addOrSubtractDaysFromDate(350),
    price: 80.00,
    quantity: 470,
    category: 'Fashion',
    status: 'Active',
  },
  {
    id: '10',
    name: "Man's Round Dial Wrist Watch",
    description: 'Fitness tracking smartwatch',
    image: product13,
    date: addOrSubtractDaysFromDate(350),
    price: 140.00,
    quantity: 1092,
    category: 'Watches',
    status: 'Active',
  },
  {
    id: '11',
    name: "PS 5 Control",
    description: 'Ergonomic gaming ps and multi control',
    image: product14,
    date: addOrSubtractDaysFromDate(350),
    price: 230.00,
    quantity: 523,
    category: 'Games',
    status: 'Inactive',
  },
  {
    id: '12',
    name: "Plastic Duckie barry b benson",
    description: 'Bath Duck Toy Mead With Plastic',
    image: product15,
    date: addOrSubtractDaysFromDate(350),
    price: 70.00,
    quantity: 2102,
    category: 'Toy',
    status: 'Inactive',
  },
]