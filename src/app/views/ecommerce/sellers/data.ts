import type { ApexOptions } from "ng-apexcharts"

const seller1 = 'assets/images/sellers/s-1.svg';
const seller4 = 'assets/images/sellers/s-4.svg';
const seller6 = 'assets/images/sellers/s-6.svg';
const seller7 = 'assets/images/sellers/s-7.svg';
const seller8 = 'assets/images/sellers/s-8.svg';
const seller2 = 'assets/images/sellers/s-2.svg';

export type SellersType = {
  id: string
  title: string
  image: string
  rating: {
    star: number
    review: number
  }
  description: string
  location: string
  email: string
  stock: string
  sells: number
  series: ApexOptions['series'] 
  brand: string
  revenue: string
}

export const sellersData: SellersType[] = [
  {
    id: '2001',
    title: 'Lacoste',
    image: seller1,
    rating: {
      star: 4.5,
      review: 5.3
    },
    description: 'Lacoste, a global icon in the world of fashion, was founded in 1933 by the legendary French tennis player René Lacoste.',
    location: '966 Hiddenview Drive Philadelphia,',
    email: 'lacostefashion@rhyta.com',
    stock: '941',
    sells: 6.7,
    brand: 'Fashion',
    revenue: '62,100',
    series: [{ data: [25, 66, 41, 89, 63, 25, 44, 12, 36, 9, 54] }],
  },
  {
    id: '2002',
    title: 'Asics Foot Ware',
    image: seller4,
    rating: {
      star: 4.5,
      review: 2.5
    },
    description: ' Asics footwear is renowned for its advanced technology and superior craftsmanship, making it a favorite among athletes and fitness worldwide.',
    location: '2267 Raver Croft Drive Chattanooga,',
    email: 'asionwares@rhyta.com',
    stock: '764',
    sells: 2.9,
    brand: 'Footware',
    revenue: '40,400',
    series: [{ data: [17, 83, 56, 45, 29, 92, 38, 72, 11, 67, 53] }],
  },
  {
    id: '2003',
    title: 'American Tourister',
    image: seller6,
    rating: {
      star: 4.5,
      review: 4.9
    },
    description: 'American Tourister, a trusted name in the luggage industry, has been synonymous with quality, durability, and style since its founding in 1933.',
    location: '3383 Briarhill Lane Youngstown,',
    email: 'americanbag@rhyta.com',
    stock: '1.6k',
    sells: 5.1,
    brand: 'Luggage',
    revenue: '75,450',
    series: [{ data: [34, 77, 23, 65, 48, 90, 14, 69, 37, 52, 81] }]
  },
  {
    id: '2004',
    title: 'Hitachi',
    image: seller7,
    rating: {
      star: 4.5,
      review: 8
    },
    description: 'Hitachi, Ltd., founded in 1910, is a global leader in technology and innovation, renowned for its diverse range of products and services.',
    location: '2496 Gladwell Street Cleburne,',
    email: 'hitachielectronics@rhyta.com',
    stock: '3.1k',
    sells: 15.9,
    brand: 'Electronics',
    revenue: '98,900',
    series: [{ data: [45, 12, 78, 31, 56, 89, 22, 67, 41, 53, 96] }],
  },
  {
    id: '2005',
    title: 'Pepperfry',
    image: seller8,
    rating: {
      star: 4.5,
      review: 6.9
    },
    description: "Pepperfry, launched in 2012, has rapidly grown to become India's leading online marketplace for furniture and home decor. ",
    location: '3840 Sunset Drive Brinkley,',
    email: 'pepperfryfurniture@rhyta.com',
    stock: '2.9k',
    sells: 7.5,
    brand: 'Furniture',
    revenue: '54,810',
    series: [{ data: [72, 35, 87, 23, 56, 94, 11, 68, 49, 75, 31] }],
  },
  {
    id: '2006',
    title: 'Skulcandy',
    image: seller2,
    rating: {
      star: 4.5,
      review: 7.5
    },
    description: "Skullcandy, founded in 2003 by Rick Alden, is a leading audio brand known for its innovative and stylish audio accessories.",
    location: '1024 Veltri Drive Takotna,',
    email: 'skulcandyaudio@rhyta.com',
    stock: '4.8k',
    sells: 10.3,
    brand: 'Audio',
    revenue: '63,219',
    series: [{ data: [18, 47, 32, 76, 51, 22, 65, 39, 58, 14, 83] }],
  },
]