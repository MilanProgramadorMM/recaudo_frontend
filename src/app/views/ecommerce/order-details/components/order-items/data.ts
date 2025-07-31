const product1 = 'assets/images/products/p-1.png'
const product3 = 'assets/images/products/p-3.png'
const product6 = 'assets/images/products/p-6.png'
const product4 = 'assets/images/products/p-4.png'

export type OrderItemsType = {
  title: string
  image: string
  price: number
  size: string
}

export const orderItemData : OrderItemsType[] = [
  {
    title: 'Minetta Rattan Swivel Luxury Green Lounge Chair',
    image: product3,
    price: 300,
    size: '56L X 63D X 102H CM'
  },
  {
    title: "Jordan Jumpman MVP Men's Shoes Size",
    image: product6,
    price: 400,
    size: '8'
  },
  {
    title: 'Men White Slim Fit T-shirt',
    image: product1,
    price: 70.90,
    size: 'M'
  },
  {
    title: 'HYPERX Cloud Gaming Headphone',
    image: product4,
    price: 230.90,
    size: 'M'
  },
]