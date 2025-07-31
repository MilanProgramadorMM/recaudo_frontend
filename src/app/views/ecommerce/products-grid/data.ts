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


export type PopularCategoriesType = {
  title: string
  count: number
}

export type ProductType = {
  id: string
  name: string
  image: string
  price: number
  sellingItems: string[]
  productName: string
  discountPrice: number
  size: string
  rating: {
    star: number
    review: number
  }
  isDeal?: boolean
  isSell?: boolean
  isFavorite?:boolean
}

export type ProductStat = {
  icon: string
  title: string
  count: number
}

export const popularCategoriesData: PopularCategoriesType[] = [
  {
    title: 'All Categories',
    count: 5352
  },
  {
    title: 'Furniture',
    count: 624
  },
  {
    title: 'Headphones',
    count: 351
  },
  {
    title: 'Eye Ware & Sunglass',
    count: 98
  },
  {
    title: 'Foot Ware',
    count: 452
  },
  {
    title: "Fashion Men , Women & Kid's",
    count: 2120
  },
  {
    title: "Electronics Items",
    count: 667
  },
  {
    title: "Watches",
    count: 80
  },
  {
    title: "Beauty & Health",
    count: 960
  },
]

export const productStatData: ProductStat[] = [
  {
    icon: 'solar:t-shirt-bold-duotone',
    title: 'Fashion Men & Women',
    count: 2120
  },
  {
    icon: 'solar:sofa-2-bold-duotone',
    title: 'Furniture Sofa & Chair',
    count: 624
  },
  {
    icon: 'solar:headphones-round-sound-bold-duotone',
    title: 'Electronics Items',
    count: 667
  },
  {
    icon: 'solar:glasses-bold-duotone',
    title: 'Eye Ware & Sunglass',
    count: 98
  },
]

export const productData: ProductType[] = [
  {
    id: '1',
    name: 'Men White Slim Fit T-shirt',
    image: product1,
    price: 70.90,
    sellingItems: ['T-shirt', 'Cargo Pent', 'Dress'],
    productName: 'Zara Fashion',
    discountPrice: 70.90,
    rating: {
      star: 4.5,
      review: 123
    },
    size: 'Size : XS , S , M',
    isDeal: true,
    isFavorite:true,
  },
  {
    id: '2',
    name: '55 L Laptop Backpack fits upto 16 In..',
    image: product2,
    price: 100.90,
    sellingItems: ['Collage Bags', 'Trolly Bags'],
    productName: 'Wrogn Bags',
    discountPrice: 100.90,
    rating: {
      star: 4.5,
      review: 43
    },
    size: 'Size : 30L , 40L , 55L'
  },
  {
    id: '3',
    name: 'Minetta Rattan Swivel Premium Chair',
    image: product3,
    price: 300.00,
    sellingItems: ['Sofas', 'Blenders', 'Chairs'],
    productName: 'Premium Furniture',
    discountPrice: 300,
    rating: {
      star: 5,
      review: 23
    },
    size: 'Size : 56L X 63D X 102H CM',
    isDeal: true
  },
  {
    id: '4',
    name: 'HYPERX Cloud Gaming Headphone',
    image: product4,
    price: 230.90,
    sellingItems: ['Gaming Headphone', 'Buds', 'Nakebands'],
    productName: 'Bose Headphones',
    discountPrice: 70.90,
    rating: {
      star: 4,
      review: 311
    },
    size: 'Size : S , M',
    isFavorite:true,
  },
  {
    id: '5',
    name: 'Men Winter Knitted Sweater',
    image: product5,
    price: 90.00,
    sellingItems: ['Hoodie'],
    productName: 'Winter Fashion',
    discountPrice: 90.00,
    rating: {
      star: 4,
      review: 12
    },
    size: 'Size : S , M , XL ,XXL',
    isSell: true,
    isFavorite:true,
  },
  {
    id: '6',
    name: "Jordan Jumpman MVP Men's Shoes Size",
    image: product6,
    price: 400.00,
    sellingItems: ['Sandal', 'Loafer', 'Slippers'],
    productName: 'Nike Foot Ware',
    discountPrice: 400,
    rating: {
      star: 5,
      review: 200
    },
    size: 'Size US : 7 , 8 , 8.5 , 9 , 10',
    isSell: true,
    isFavorite:true,
  },
  {
    id: '7',
    name: "Sleepify Luno 4 Seater Fabric Sofa",
    image: product7,
    price: 340.00,
    sellingItems: ['Sofas'],
    productName: 'CRAFT Furniture',
    discountPrice: 340.,
    rating: {
      star: 5,
      review: 120
    },
    size: 'Size : XS , S , M'
  },
  {
    id: '8',
    name: "Navy Blue Over Size T-shirt For Men",
    image: product8,
    price: 80.00,
    sellingItems: ['Analog Watch', 'Hand Watch'],
    productName: 'H&M Fashion',
    discountPrice: 70.90,
    rating: {
      star: 4,
      review: 80
    },
    size: 'Size : M , XL , XXL , XXXL',
    isSell: true,
    isFavorite:true,
  },
]