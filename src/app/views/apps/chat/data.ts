import { addOrSubtractDaysFromDate, addOrSubtractMinutesFromDate } from "@core/helper/utils"

const userAvatar2 = 'assets/images/users/avatar-2.jpg'
const userAvatar5 = 'assets/images/users/avatar-5.jpg'
const userAvatar8 = 'assets/images/users/avatar-8.jpg'
const avatar4 = 'assets/images/users/avatar-4.jpg'
const avatar5 = 'assets/images/users/avatar-5.jpg'
const avatar9 = 'assets/images/users/avatar-9.jpg'
const avatar6 = 'assets/images/users/avatar-6.jpg'
const avatar3 = 'assets/images/users/avatar-3.jpg'
const avatar10 = 'assets/images/users/avatar-10.jpg'

export type UserType = {
  id: string
  name: string
  image?: string
  date: Date
  allMessage?: boolean
  message: string
  voiceMessage?: boolean
  unRead?: number
  sendMessage?: boolean
  status?: 'Active' | 'Offline' | 'Typing'
  isSend?: boolean
}


export type ChatMessageType = {
  id: string
  from: UserType
  to: UserType
  message: string
  sentOn?: Date
}

export const userData: UserType[] = [
  {
    id: '1001',
    name: 'Brandon Smith',
    image: userAvatar2,
    message: 'How are you today?',
    unRead: 3,
    date: addOrSubtractMinutesFromDate(10),
    status: 'Active'
  },
  {
    id: '1002',
    name: 'James Zavel',
    image: userAvatar5,
    message: "Hey! a reminder for tommorow's meeting...",
    isSend: true,
    date: addOrSubtractMinutesFromDate(15),
    status: 'Typing'
  },
  {
    id: '1003',
    name: 'Maria Lopez',
    image: userAvatar8,
    message: 'How are you today?',
    unRead: 1,
    date: addOrSubtractMinutesFromDate(150),
    status: 'Active'
  },
  {
    id: '1005',
    name: 'Eunice Bennett',
    image: avatar3,
    message: 'Please check these design assets',
    date: addOrSubtractMinutesFromDate(55),
    isSend:false,
    status: 'Active',
    allMessage:true
  },
  {
    id: '1007',
    name: 'Hoyt Bahe',
    image: avatar4,
    message: 'Voice Message',
    isSend: true,
    voiceMessage: true,
    date: addOrSubtractMinutesFromDate(220),
    status: 'Active'
  },
  {
    id: '1008',
    name: 'John Otta',
    image: avatar9,
    message: 'What next plan ?',
    isSend: true,
    date: addOrSubtractMinutesFromDate(300),
    status: 'Typing'
  },
  {
    id: '1009',
    name: 'Louis Moller',
    image: avatar6,
    message: 'Are you free for 15 min?',
    unRead: 1,
    date: addOrSubtractMinutesFromDate(320),
    status: 'Active'
  },
  {
    id: '1010',
    name: 'David Callan',
    image: avatar9,
    message: 'Are you interested in learning?',
    unRead: 3,
    date: addOrSubtractMinutesFromDate(420),
    status: 'Offline'
  },
  {
    id: '1011',
    name: 'Sean Lee',
    image: avatar9,
    message: 'Howdy?',
    isSend: true,
    date: addOrSubtractMinutesFromDate(500),
    status: 'Active'
  },
]

export const messages: ChatMessageType[] = []

const defaultTo: UserType = {
  id: '1012',
  name: 'Gilbert Chicoine',
  image: avatar10,
  message: 'Hey! Okay, thank you for letting me know. See you!',
  date: addOrSubtractMinutesFromDate(650),
}

for (const user of userData) {
  messages.push(
    {
      id: '1001',
      to: defaultTo,
      from: user,
      message:'Hey 😊',
      sentOn: addOrSubtractMinutesFromDate(110),
    },
    {
      id: '1002',
      to: user,
      from: defaultTo,
      message: 'Hey there, how are you doing? Any plans for our upcoming meeting?',
      sentOn: addOrSubtractMinutesFromDate(110),
    },
    {
      id: '1003',
      to: defaultTo,
      from: user,
      message:  "Sure, everything's good.",
      sentOn: addOrSubtractMinutesFromDate(110),
    },
    {
      id: '1004',
      to: user,
      from: defaultTo,
      message:"Fantastic! 👍",
      sentOn: addOrSubtractMinutesFromDate(110),
    },
    {
      id: '1005',
      to: defaultTo,
      from: user,
      message: "If you're available, let's schedule it for today.",
      sentOn: addOrSubtractMinutesFromDate(110),
    },
    {
      id: '1006',
      to: user,
      from: defaultTo,
      message: "Absolutely! Just give me a heads up if 2pm suits you.",
      sentOn: addOrSubtractMinutesFromDate(20),
    },
    {
      id: '1007',
      to: defaultTo,
      from: user,
      message: "Apologies 😔, I've got another meeting at 2pm. Could we possibly shift it to 3pm?",
      sentOn: addOrSubtractMinutesFromDate(10),
    },
    {
      id: '1008',
      to: user,
      from: defaultTo,
      message: "3pm works for me 👍. Absolutely, let's dive into the presentation format. It'd be fantastic to wrap that up today. I'm attaching last year's format and assets here for reference.",
      sentOn: addOrSubtractMinutesFromDate(10),
    },
  )
}