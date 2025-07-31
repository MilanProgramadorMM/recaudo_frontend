import { addOrSubtractDaysFromDate } from "@core/helper/utils";

const avatar2 = 'assets/images/users/avatar-2.jpg';
const avatar3 = 'assets/images/users/avatar-3.jpg';
const avatar4 = 'assets/images/users/avatar-4.jpg';
const avatar5 = 'assets/images/users/avatar-5.jpg';
const avatar6 = 'assets/images/users/avatar-6.jpg';
const avatar7 = 'assets/images/users/avatar-7.jpg';

export type ReviewType = {
  id: string
  name:string
  avatar:string;
  specialty:string;
  rating: {
    star: number
    review: number
  }
  reviews: {
    name: string
    star: number
    description: string
    like: number
    dislike: number
    date: Date
  }[]
}

export const reviewData: ReviewType[] = [
  {
    id: '701',
    avatar: avatar3,
    name: 'Dr. James D. Roger',
    specialty: 'Cardiology',
    rating: {
      star: 4.9,
      review: 2.3,
    },
    reviews: [
      {
        name: 'Oliver Baynton',
        star: 5,
        description: "Dr. James Roger is exceptional. A great listener and communicator. Makes our family's health a top priority. Highly recommended",
        like: 632,
        dislike: 9,
        date: addOrSubtractDaysFromDate(10)
      },
      {
        name: 'Jonathan Hort',
        star: 5,
        description: "Our family doctor, provides outstanding care. Always prompt, understanding, and offers excellent guidance. We couldn't ask for a better healthcare partner. Compassionate, thorough, and always available when needed. Our family's health is in capable hands.",
        like: 212,
        dislike: 4,
        date: addOrSubtractDaysFromDate(56)
      },
    ]
  },
  {
    id: '702',
    avatar: avatar2,
    name: ' Dr. Morgan H. Beck',
    specialty: 'Dermatology',
    rating: {
      star: 4.7,
      review: 1.6,
    },
    reviews: [
      {
        name: 'Hugo Strele',
        star: 5,
        description: "He genuinely cares about our family's health and goes above and beyond to ensure we receive the best care possible.",
        like: 322,
        dislike: 8,
        date: addOrSubtractDaysFromDate(30)
      },
      {
        name: 'Mackenzie McHale',
        star: 5,
        description: "Dr. Morgan Beck is a true gem. Always attentive, patient, and knowledgeable. Takes time to explain things and makes us feel at ease during. provides outstanding care. Always prompt, understanding, and offers excellent guidance. We couldn't ask for a better healthcare partner.",
        like: 532,
        dislike: 43,
        date: addOrSubtractDaysFromDate(5)
      },
    ]
  },
  {
    id: '703',
    avatar: avatar4,
    name: 'Dr. Terry J. Bowers',
    specialty: 'Pediatrics',
    rating: {
      star: 4.5,
      review: 2.5,
    },
    reviews: [
      {
        name: 'Lauren Oberg',
        star: 5,
        description: 'Dr. Roger consistently goes the extra mile, making him our trusted choice for medical advice and treatment.',
        like: 452,
        dislike: 23,
        date: addOrSubtractDaysFromDate(70)
      },
      {
        name: 'Ralph Kappel',
        star: 4.5,
        description: 'Dr. Terry Bowers was exceptional. They took the time to listen attentively to our concerns and attentively to our concerns thoroughly explain everything in a way that was easy to understand. Their expertise and compassionate approach reassured us throughout the appointment.',
        like: 621,
        dislike: 60,
        date: addOrSubtractDaysFromDate(85)
      },
    ]
  },
  {
    id: '704',
    avatar: avatar5,
    name: 'Dr. Carlos McCollum',
    specialty: 'Orthopedics',
    rating: {
      star: 4.1,
      review: 4.2,
    },
    reviews: [
      {
        name: 'Anja Bachmeier',
        star: 4,
        description: 'I am incredibly grateful for the care I received at ortho care. Thanks to their expertise and dedication, I am now on the road to recovery.',
        like: 841,
        dislike: 20,
        date: addOrSubtractDaysFromDate(10)
      },
      {
        name: 'Jan Fuhrmann',
        star: 4.5,
        description: 'I am incredibly grateful for the care I received at [Orthopedics Practice Name]. Thanks to their expertise and attentively to our concerns dedication, I am now on the road to recovery. I highly recommend ortho care to anyone in need of orthopedic care."',
        like: 732,
        dislike: 120,
        date: addOrSubtractDaysFromDate(150)
      },
    ]
  },
  {
    id: '705',
    avatar: avatar6,
    name: ' Dr. Jeanetta D. Hovey',
    specialty: 'Neurology',
    rating: {
      star: 4.3,
      review: 3.7,
    },
    reviews: [
      {
        name: 'Katja Theissen',
        star: 4.5,
        description: 'The nursing staff and medical assistants were also fantastic. They were attentive, caring, and always willing to answer any questions I had.',
        like: 287,
        dislike: 0,
        date: addOrSubtractDaysFromDate(78)
      },
      {
        name: 'Torsten Fisher',
        star: 4.5,
        description: 'Dr. Erma Coffman is a true professional. They took the time to listen attentively to my symptoms, a comprehensive examination, and explained my diagnosis and treatment options clearly. Their expertise and genuine concern for my well-being were evident throughout our consultation.',
        like: 400,
        dislike: 80,
        date: addOrSubtractDaysFromDate(210)
      },
    ]
  },
  {
    id: '706',
    avatar: avatar7,
    name: 'Dr. Erma D. Coffman',
    specialty: 'Gastroenterology',
    rating: {
      star: 3.5,
      review: 8,
    },
    reviews: [
      {
        name: 'Lukas Kastner',
        star: 4,
        description: 'The entire atmosphere at Psycho is calming and conducive to healing. The support staff were always helpful, ensuring my visits were stress-free.',
        like: 79,
        dislike: 2,
        date: addOrSubtractDaysFromDate(150)
      },
      {
        name: 'Martina Hofmann',
        star: 4.5,
        description: 'I have seen significant improvements in my mental health since starting treatment with Dr. Kelli Bailey . I would highly recommend Psycho to anyone seeking compassionate and effective psychiatry care. They were accommodating and made me feel comfortable right from the start."',
        like: 128,
        dislike: 23,
        date: addOrSubtractDaysFromDate(210)
      },
    ]
  },
]