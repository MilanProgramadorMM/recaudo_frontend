
export type PricingType = {
  title: string
  description: string
  price: number
  features: {
    icon: string
    title: string
    variant: string
  }[]
}

export type PricingTwoType = {
  title: string
  description: string
  price: number
  popular?: boolean
  features: string[]
}

export const pricingData: PricingType[] = [
  {
    title: 'Professional',
    description: 'Everything a small team needs',
    price: 18,
    features: [
      {
        icon: 'ti-circle-check-filled',
        title: 'Up to 10 people',
        variant: 'primary',
      },
      {
        icon: 'ti-circle-check-filled',
        title: 'Code extensibility',
        variant: 'primary',
      },

      {
        icon: 'ti-circle-check-filled',
        title: 'Collect data',
        variant: 'primary',
      },
      {
        icon: 'ti-circle-x-filled',
        title: 'Product Suppor',
        variant: 'muted',
      },
      {
        icon: 'ti-circle-x-filled',
        title: ' Custom reports',
        variant: 'muted',
      },
      {
        icon: 'ti-circle-x-filled',
        title: 'Activity reporting',
        variant: 'muted',
      },
    ]
  },
  {
    title: 'Teams',
    description: 'Foe growing business',
    price: 36,
    features: [
      {
        icon: 'ti-circle-check-filled',
        title: 'Up to 15 people',
        variant: 'primary',
      },
      {
        icon: 'ti-circle-check-filled',
        title: ' Custom reports',
        variant: 'primary',
      },
      {
        icon: 'ti-circle-check-filled',
        title: 'Collect data',
        variant: 'primary',
      },
      {
        icon: 'ti-circle-check-filled',
        title: 'Product Suppor',
        variant: 'primary',
      },
      {
        icon: 'ti-circle-check-filled',
        title: 'Code extensibility',
        variant: 'primary',
      },
      {
        icon: 'ti-circle-check-filled',
        title: 'Activity reporting',
        variant: 'primary',
      },
    ]
  },
]


export const pricingTwoData: PricingTwoType[] = [
  {
    title: 'Solo Plan',
    description: 'Tailored for individual professionals and hobbyists.',
    price: 229,
    features: ['Single user license', 'Access to all components', 'Lifetime access', 'Unlimited projects', 'Customer support', 'Free updates']
  },
  {
    title: 'Startup Plan',
    description: 'Best suited for experienced developers and small teams.',
    price: 399,
    popular: true,
    features: ['5 user license', 'Access to all components', 'Lifetime access', 'Unlimited projects', 'Priority tech support', 'Customer support', 'Free updates']
  },
  {
    title: 'Organization Plan',
    description: 'Ideal for large teams and organization',
    price: 799,
    features: ['25 user license', 'Access to all components', 'Lifetime access', 'Unlimited projects', 'Customer support', 'Free updates']
  },
]