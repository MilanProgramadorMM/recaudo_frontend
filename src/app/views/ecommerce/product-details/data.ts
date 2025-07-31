const product3 = 'assets/images/products/p-3.png'
const product9 = 'assets/images/products/p-9.png'
const product10 = 'assets/images/products/p-10.png'
const product11 = 'assets/images/products/p-11.png'
const product12 = 'assets/images/products/p-12.png'

export type ProductRatingType = {
  star: number
  progress: number
  count: number
}
export type ShopProductRatingType = {
  image: string
  rating: number
}
export type ShopOffersType = {
  icon: string
  title: string
}

export type ReviewType = {
  rating: number;
  image?: string;
  author: string;
  date: string;
  comment: string;
  likes: number;
  disLikes: number;
}

export const productRatingData: ProductRatingType[] = [
  {
    star: 5,
    progress: 90,
    count: 4525
  },
  {
    star: 4,
    progress: 70,
    count: 2343
  },
  {
    star: 3,
    progress: 30,
    count: 221
  },
  {
    star: 2,
    progress: 20,
    count: 109
  },
  {
    star: 1,
    progress: 10,
    count: 129
  },
]

export const shopRatingData: ProductRatingType[] = [
  {
    star: 5,
    progress: 70,
    count: 3641
  },
  {
    star: 4,
    progress: 65,
    count: 2912
  },
  {
    star: 3,
    progress: 60,
    count: 321
  },
  {
    star: 2,
    progress: 30,
    count: 231
  },
  {
    star: 1,
    progress: 20,
    count: 149
  },
]

export const shopProductRating: ShopProductRatingType[] = [
  {
    image: product3,
    rating: 4.5
  },
  {
    image: product9,
    rating: 4.2
  },
  {
    image: product10,
    rating: 3.5
  },
  {
    image: product11,
    rating: 5
  },
  {
    image: product12,
    rating: 4.4
  },
]

export const shopOffersData: ShopOffersType[] = [
  {
    icon: 'solar:refresh-square-bold',
    title: 'Free Return'
  },
  {
    icon: 'solar:money-bag-bold',
    title: 'Multiple Payment Option'
  },
  {
    icon: 'solar:sofa-2-bold-duotone',
    title: 'Free Assembly'
  },
  {
    icon: 'solar:verified-check-bold',
    title: 'Guaranteed Product Replace'
  },
  {
    icon: 'solar:tram-bold',
    title: 'Fast & Free Shipping'
  },
  {
    icon: 'solar:tag-price-bold',
    title: 'Your Best Price Matching'
  },
  {
    icon: 'solar:headphones-round-bold',
    title: '24/7 Support'
  },
  {
    icon: 'solar:card-2-bold',
    title: 'Secure Checkout'
  },
]

export const customerReviews:ReviewType[] = [
  {
    rating: 4.5,
    image: "assets/images/products/p-10.png",
    author: "Ruth L. Garner",
    date: "11 November 2023",
    comment: "The design of the chair is sleek and modern, fitting perfectly with the aesthetic of my home office. The black mesh backrest not only looks stylish but also provides excellent reachability, preventing any discomfort during long working hours.",
    likes: 2543,
    disLikes: 129
  },
  {
    rating: 4.2,
    author: "Michelle M. Kellerman",
    date: "20 March 2024",
    comment: "One of the standout features of this chair is its adjustability. The chair offers a wide range of adjustments, including seat height, armrest height, and tilt tension. The lumbar support can be easily adjusted to fit the natural curve.",
    likes: 1323,
    disLikes: 34
  },
]