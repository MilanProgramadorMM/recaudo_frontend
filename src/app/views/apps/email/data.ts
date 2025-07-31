import { addOrSubtractDaysFromDate } from "@core/helper/utils"

const amazonImg = 'assets/images/brands/amazon.svg'
const digitalOceanImg = 'assets/images/brands/digital-ocean.svg'
const dribbbleImg = 'assets/images/brands/dribbble.svg'
const gitlabImg = 'assets/images/brands/gitlab.svg'
const instagramImg = 'assets/images/brands/instagram.svg'
const linkedinImg = 'assets/images/brands/linkedin.svg'
const avatar2 = 'assets/images/users/avatar-2.jpg'
const avatar3 = 'assets/images/users/avatar-3.jpg'
const avatar4 = 'assets/images/users/avatar-4.jpg'
const avatar5 = 'assets/images/users/avatar-5.jpg'
const avatar6 = 'assets/images/users/avatar-6.jpg'
const avatar7 = 'assets/images/users/avatar-7.jpg'
const avatar8 = 'assets/images/users/avatar-8.jpg'
const avatar9 = 'assets/images/users/avatar-9.jpg'


export type EmailType = {
  isStar?: boolean
  image: string
  name: string
  subTitle: string
  description: string
  isAttachment?: number
  date: Date
  variant?: string
}

export const emailsData: EmailType[] = [
  {
    isStar: false,
    image: avatar2,
    name: "George Thomas",
    subTitle: "Request For Information",
    description: "I hope you are doing well. I have a small request. Can you please...",
    date: addOrSubtractDaysFromDate(12),
    variant: "danger"
  },
  {
    isStar: true,
    image: avatar3,
    name: "Robert C. Lane",
    subTitle: "Invitation For Meeting",
    description: "Good Morning, I hope this email finds you well. I am writing to extra...",
    isAttachment: 2,
    date: addOrSubtractDaysFromDate(21),
    variant: "success"
  },
  {
    isStar: false,
    image: dribbbleImg,
    name: "Dribbble",
    subTitle: "Become a successful self-taught designer",
    description: "There's no one right way to learn design. In fa...",
    date: addOrSubtractDaysFromDate(145),
    variant: "info"
  },
  {
    isStar: true,
    image: avatar5,
    name: "Darren C. Gallimore",
    subTitle: "Holiday Notice",
    description: "Good Evening, I hope you are doing well. I have a small request.",
    date: addOrSubtractDaysFromDate(12),
  },
  {
    isStar: false,
    image: avatar9,
    name: "Mike A. Bell",
    subTitle: "Offer Letter",
    description: "Thank you for applying. I hope you are doing well. I have a small.",
    date: addOrSubtractDaysFromDate(45),
    variant: "secondary"
  },
  {
    isStar: true,
    image: avatar6,
    name: "Bennett C. Rice",
    subTitle: "Apology Letter",
    description: "I hope you are doing well. I have a small request. Can you please",
    isAttachment: 4,
    date: addOrSubtractDaysFromDate(89),
  },
  {
    isStar: false,
    image: gitlabImg,
    name: "John J. Bowser",
    subTitle: "How to get started on Gitlab",
    description: "We know setting off on a freelancing journey can feel intim...",
    isAttachment: 3,
    date: addOrSubtractDaysFromDate(78),
  },
  {
    isStar: false,
    image: avatar8,
    name: "Jill N. Neal",
    subTitle: "Apply For Executive Position",
    description: "I am writing to express my keen interest in the Executive Po...",
    date: addOrSubtractDaysFromDate(158),
    variant: "success"
  },
  {
    isStar: false,
    image: instagramImg,
    name: "Instagram",
    subTitle: "You have received 2 new followers",
    description: "2 new followers, 1 new collected project, and more at...",
    date: addOrSubtractDaysFromDate(320),
    variant: "info"
  },
  {
    isStar: false,
    image: amazonImg,
    name: "Amazon",
    subTitle: "Your order is shipped",
    description: "Your order is on the way with tracking...",
    isAttachment: 1,
    date: addOrSubtractDaysFromDate(478),
    variant: "success"
  },
  {
    isStar: true,
    image: avatar7,
    name: "Alfredo D. Rico",
    subTitle: "Class schedule",
    description: "Your online class will be held on Saturday at 2:30 pm Bangladesh.",
    date: addOrSubtractDaysFromDate(14),
    variant: "secondary"
  },
  {
    isStar: false,
    image: avatar4,
    name: "Vernon B. Rutter",
    subTitle: "Invitation to attend our Exclusive Webinar",
    description: "An exclusive webinar will be held on 23 January...",
    date: addOrSubtractDaysFromDate(890),
    variant: ""
  },
  {
    isStar: true,
    image: digitalOceanImg,
    name: "Digital Ocean",
    subTitle: "Update to Discord's Policies",
    description: "Hey! we wanted to let you know that we are updating our Te...",
    date: addOrSubtractDaysFromDate(14),
    variant: "danger"
  },
  {
    isStar: true,
    image: linkedinImg,
    name: "Linkedin",
    subTitle: "New job similar to UI/UX",
    description: "Jobs similar to UI/UX Designer at St Trinity Property group and s...",
    isAttachment: 4,
    date: addOrSubtractDaysFromDate(89),
    variant: "success"
  }

]