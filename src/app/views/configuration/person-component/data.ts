const avatar2 = 'assets/images/users/avatar-2.jpg';
const avatar3 = 'assets/images/users/avatar-3.jpg';
const avatar4 = 'assets/images/users/avatar-4.jpg';
const avatar5 = 'assets/images/users/avatar-5.jpg';

export type PersonDataType = {
  image: string;
  username: string;
  name: string;
  createdAt: string;
  lastPasswordUpdate: string;
};

export const personData: PersonDataType[] = [
  {
    image: avatar2,
    username: 'james.roger',
    name: 'James D. Roger',
    createdAt: '2024-12-10',
    lastPasswordUpdate: '2025-06-01'
  },
  {
    image: avatar3,
    username: 'morgan.beck',
    name: 'Morgan H. Beck',
    createdAt: '2023-08-22',
    lastPasswordUpdate: '2025-05-15'
  },
  {
    image: avatar4,
    username: 'terry.bowers',
    name: 'Terry J. Bowers',
    createdAt: '2022-04-13',
    lastPasswordUpdate: '2025-04-30'
  },
  {
    image: avatar5,
    username: 'carlos.mccollum',
    name: 'Carlos L. McCollum',
    createdAt: '2021-11-05',
    lastPasswordUpdate: '2025-07-10'
  }
];
