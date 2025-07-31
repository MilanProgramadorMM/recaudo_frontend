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


export type CategoryType = {
  id: string
  image: string
  brand: string[]
  averagePriceMin: number  
  averagePriceMax:  number
  sellingItems: string[]
  discountsAvailable: string
  category: string
  status: 'Active' | 'Inactive'
  discountPrice: number
  rating: {
    star: number
    review: number
  }
}

export const categoryData: CategoryType[] = [
  {
    id: '1',
    image: product1,
    category: 'Fashion',
    status: 'Active',
    brand: ['Nike', 'H&M', 'ZARA', 'Puma'],
    averagePriceMin: 200,
    averagePriceMax: 2000,
    discountsAvailable: 'Seasonal Sales',
    sellingItems: ['T-shirt', 'Cargo Pent', 'Dress'],
    discountPrice: 70.90,
    rating: {
      star: 4.5,
      review: 123
    },
  },
  {
    id: '2',
    image: product2,
    category: 'Bags',
    status: 'Active',
    brand: ['Nike', 'Puma', 'Safari', 'Truster'],
    averagePriceMin: 20,
    averagePriceMax: 300,
    sellingItems: ['Collage Bags', 'Trolly Bags'],
    discountsAvailable: 'Clearance Sales',
    discountPrice: 100.90,
    rating: {
      star: 4.5,
      review: 43
    },
  },
  {
    id: '3',
    image: product3,
    category: 'Furniture',
    status: 'Active',
    brand: ['IKEA', 'Hamilton Beach', 'Premium'],
    averagePriceMin: 300,
    averagePriceMax: 1500,
    discountsAvailable: 'Bundled Discounts',
    sellingItems: ['Sofas', 'Blenders', 'Chairs'],
    discountPrice: 300,
    rating: {
      star: 5,
      review: 23
    },
  },
  {
    id: '4',
    image: product4,
    category: 'Headphone',
    status: 'Inactive',
    brand: ['Boat', 'Sony', 'Jbl', 'Bose'],
    averagePriceMin: 150,
    averagePriceMax: 1000,
    discountsAvailable: 'Holiday Discounts',
    sellingItems: ['Gaming Headphone', 'Buds', 'Nakebands'],
    discountPrice: 70.90,
    rating: {
      star: 4,
      review: 311
    },
  },
  {
    id: '5',
    image: product5,
    category: 'Winter Fashion',
    status: 'Active',
    brand: ['Nike', 'H&M', 'ZARA', 'Puma'],
    averagePriceMin: 200,
    averagePriceMax: 2000,
    discountsAvailable: 'Bulk Purchase Deals',
    sellingItems: ['Hoodie'],
    discountPrice: 90.00,
    rating: {
      star: 4,
      review: 12
    },
  },
  {
    id: '6',
    image: product6,
    category: 'Foot Ware',
    status: 'Inactive',
    brand: ['Nike', 'Bata', 'Woodland', 'Puma'],
    averagePriceMin: 200,
    averagePriceMax: 2000,
    discountsAvailable: 'Coupon Codes',
    sellingItems: ['Sandal', 'Loafer', 'Slippers'],
    discountPrice: 400,
    rating: {
      star: 5,
      review: 200
    },
  },
  {
    id: '7',
    image: product7,
    category: 'Furniture',
    status: 'Inactive',
    brand: ['IKEA', 'Hamilton Beach ', 'Premium'],
    averagePriceMin: 200,
    averagePriceMax: 2000,
    discountsAvailable: 'Subscription Discounts',
    sellingItems: ['Sofas'],
    discountPrice: 340.,
    rating: {
      star: 5,
      review: 120
    },
  },
  {
    id: '8',
    image: product8,
    category: 'Fashion',
    status: 'Active',
    brand: ['Rolex', 'Tag', 'Fossil', 'Timex'],
    averagePriceMin: 400,
    averagePriceMax: 3000,
    discountsAvailable: 'Coupon Codes',
    sellingItems: ['Analog Watch', 'Hand Watch'],
    discountPrice: 70.90,
    rating: {
      star: 4,
      review: 80
    },
  },
  {
    id: '10',
    image: product13,
    category: 'Watches',
    status: 'Active',
    brand: ['Sony', 'Electronic Arts', 'IGT logo'],
    averagePriceMin: 230,
    averagePriceMax: 2100,
    discountsAvailable: 'Seasonal Sales',
    sellingItems: ['PS5', 'Logo'],
    discountPrice: 70.90,
    rating: {
      star: 4.5,
      review: 123
    },
  },
  {
    id: '11',
    image: product14,
    category: 'Games',
    status: 'Inactive',
    brand: ['Lego', 'Hot Wheels', 'Fisher-Price'],
    averagePriceMin: 100,
    averagePriceMax: 800,
    discountsAvailable: 'Buy One Get One',
    sellingItems: ['Toy Car', 'Lego'],
    discountPrice: 70.90,
    rating: {
      star: 4.5,
      review: 123
    },
  },
  {
    id: '12',
    image: product15,
    category: 'Toy',
    status: 'Inactive',
    brand: ['Nike', 'H&M', 'ZARA', 'Puma'],
    averagePriceMin: 200,
    averagePriceMax: 2000,
    discountsAvailable: 'Seasonal Sales',
    sellingItems: ['T-shirt', 'Cargo Pent', 'Dress'],
    discountPrice: 70.90,
    rating: {
      star: 4.5,
      review: 123
    },
  },
]