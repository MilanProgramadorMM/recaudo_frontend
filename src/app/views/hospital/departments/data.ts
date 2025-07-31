const department1 = 'assets/images/department/d-1.png';
const department2 = 'assets/images/department/d-2.png';
const department3 = 'assets/images/department/d-3.png';
const department4 = 'assets/images/department/d-4.png';
const department5 = 'assets/images/department/d-5.png';
const department6 = 'assets/images/department/d-6.png';
const department7 = 'assets/images/department/d-7.png';
const department8 = 'assets/images/department/d-8.png';

const avatar1 = 'assets/images/users/avatar-1.jpg';
const avatar2 = 'assets/images/users/avatar-2.jpg';
const avatar3 = 'assets/images/users/avatar-3.jpg';
const avatar4 = 'assets/images/users/avatar-4.jpg';
const avatar5 = 'assets/images/users/avatar-5.jpg';
const avatar6 = 'assets/images/users/avatar-6.jpg';
const avatar7 = 'assets/images/users/avatar-7.jpg';
const avatar8 = 'assets/images/users/avatar-8.jpg';
const avatar9 = 'assets/images/users/avatar-9.jpg';
const avatar10 = 'assets/images/users/avatar-10.jpg';

export type DepartmentType = {
  id: string
  image: string
  title: string
  description: string
  rating: {
    star: number,
    review: number
  }
  bestDoctor: {
    name: string,
    image?: string
    textVariant?: string
    variant?: string
  }[]
}

export const departmentData: DepartmentType[] = [
  {
    id: '601',
    title: 'Cardiology Department',
    image: department1,
    description: 'Cardiologists diagnose and treat conditions such as congenital heart defects, coronary artery disease, heart failure, and valvular heart disease.',
    rating: {
      star: 4.5,
      review: 4.5,
    },
    bestDoctor: [
      {
        image: avatar10,
        name: 'Vicki',
      },
      {
        name: 'T',
        variant: 'dark',
        textVariant: 'dark'
      },
      {
        image: avatar1,
        name: 'Chris'
      }
    ]
  },
  {
    id: '602',
    title: 'Pediatrics Department',
    image: department2,
    description: 'Pediatricians are trained to diagnose and treat a wide range of childhood illnesses, from minor health problems to serious diseases.',
    rating: {
      star: 4.5,
      review: 3.1,
    },
    bestDoctor: [
      {
        image: avatar3,
        name: 'Vicki',
      },
      {
        image: avatar2,
        name: 'Vicki'
      },
      {
        image: avatar5,
        name: 'Chris'
      }
    ]
  },
  {
    id: '603',
    title: 'Orthopedic Department',
    image: department3,
    description: 'Orthopedic surgeons specialize in surgeries involving bones, joints, ligaments, tendons, and muscles. ',
    rating: {
      star: 5,
      review: 1.4,
    },
    bestDoctor: [
      {
        image: avatar4,
        name: 'Vicki',
      },
      {
        image: avatar7,
        name: 'Vicki',
      },
      {
        name: 'S',
        variant: 'dark',
        textVariant: 'success'
      },
    ]
  },
  {
    id: '604',
    title: 'Oncology Department',
    image: department4,
    description: 'Oncologists are medical professionals who manage the care of patients with cancer,radiation therapy, and surgical interventions.',
    rating: {
      star: 4.5,
      review: 2.5,
    },
    bestDoctor: [
      {
        image: avatar9,
        name: 'Vicki',
      },
      {
        image: avatar3,
        name: 'Vicki'
      },
      {
        name: 'A',
        variant: 'dark',
        textVariant: 'primary'
      },
    ]
  },
  {
    id: '605',
    title: 'Ophthalmologist Department',
    image: department5,
    description: 'Ophthalmologists are medical doctors specializing in eye and vision care, including medical and surgical treatments.',
    rating: {
      star: 4.5,
      review: 3.1,
    },
    bestDoctor: [
      {
        name: 'P',
        variant: 'dark',
        textVariant: 'info'
      },
      {
        name: 'D',
        variant: 'dark',
        textVariant: 'warning'
      },
      {
        name: 'A',
        variant: 'dark',
        textVariant: 'primary'
      },
    ]
  },
  {
    id: '606',
    title: 'Imaging Department',
    image: department6,
    description: 'Common types of medical imaging include X-rays, computed tomography (CT) scans, magnetic resonance imaging (MRI), and ultrasound.',
    rating: {
      star: 4.5,
      review: 2.7,
    },
    bestDoctor: [
      {
        image: avatar10,
        name: 'Vicki',
      },
      {
        image: avatar8,
        name: 'Vicki'
      },
      {
        name: 'M',
        variant: 'dark',
        textVariant: 'primary'
      },
    ]
  },
  {
    id: '607',
    title: 'Gastroenterology Department',
    image: department7,
    description: 'Gastroenterologists diagnose and treat conditions affecting the gastrointestinal tract, including the esophagus, stomach , liver, pancreas.',
    rating: {
      star: 4.5,
      review: 1.9,
    },
    bestDoctor: [
      {
        image: avatar3,
        name: 'Vicki',
      },
      {
        image: avatar5,
        name: 'Vicki'
      },
      {
        image: avatar7,
        name: 'Vicki'
      },
    ]
  },
  {
    id: '608',
    title: 'Neurology Department',
    image: department8,
    description: "Neurologists diagnose and treat conditions such as epilepsy, multiple sclerosis, Parkinson's disease, and stroke.",
    rating: {
      star: 4.5,
      review: 2.1,
    },
    bestDoctor: [
      {
        image: avatar2,
        name: 'Vicki',
      },
      {
        name: 'A',
        variant: 'dark',
        textVariant: 'primary'
      },
      {
        image: avatar6,
        name: 'Vicki',
      },
    ]
  },
]