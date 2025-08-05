import { Cleaner } from '../types';
// import { 1 } from '@/assets/images/maidProfile/1.jpg';
// '../../data/cleaners';
export const getCleaners = (timing: string): Cleaner[] => [
  {
    id: '1',
    name: 'Sarah Johnson',
    rating: 4.9,
    reviews: 127,
    profilePic: require('@/assets/images/maidProfile/1.jpg'),
    verified: true,
    availableSlots: timing === 'asap' 
      ? ['Today 2:00 PM', 'Today 4:30 PM', 'Today 6:00 PM', 'Tomorrow 9:00 AM', 'Tomorrow 11:30 AM']
      : ['Selected Date', 'Alternative Times', 'Next Day', 'Weekend']
  },
  {
    id: '2', 
    name: 'Mike Rodriguez',
    rating: 4.8,
    reviews: 89,
    profilePic: require('@/assets/images/maidProfile/2.jpg'),
    verified: true,
    availableSlots: timing === 'asap'
      ? ['Today 3:15 PM', 'Today 5:45 PM', 'Tomorrow 8:30 AM', 'Tomorrow 1:00 PM', 'Tomorrow 3:30 PM']
      : ['Selected Date', 'Alternative Times', 'Next Day', 'Weekend']
  },
  {
    id: '3',
    name: 'Emma Chen',
    rating: 5.0,
    reviews: 203,
    profilePic: require('@/assets/images/maidProfile/26.jpg'),
    verified: true,
    availableSlots: timing === 'asap'
      ? ['Today 1:30 PM', 'Today 4:00 PM', 'Today 7:00 PM', 'Tomorrow 10:00 AM', 'Tomorrow 2:15 PM', 'Tomorrow 5:00 PM']
      : ['Selected Date', 'Alternative Times', 'Next Day', 'Weekend']
  },
  {
    id: '4',
    name: 'David Thompson',
    rating: 4.7,
    reviews: 156,
    profilePic: require('@/assets/images/maidProfile/43.jpg'),
    verified: true,
    availableSlots: timing === 'asap'
      ? ['Today 12:00 PM', 'Today 3:00 PM', 'Today 5:30 PM', 'Tomorrow 9:30 AM', 'Tomorrow 12:30 PM']
      : ['Selected Date', 'Alternative Times', 'Next Day', 'Weekend']
  },
  {
    id: '5',
    name: 'Lisa Martinez',
    rating: 4.9,
    reviews: 98,
    profilePic: require('@/assets/images/maidProfile/91.jpg'),
    verified: true,
    availableSlots: timing === 'asap'
      ? ['Today 2:45 PM', 'Today 4:15 PM', 'Today 6:30 PM', 'Tomorrow 8:00 AM', 'Tomorrow 11:00 AM', 'Tomorrow 4:00 PM']
      : ['Selected Date', 'Alternative Times', 'Next Day', 'Weekend']
  }
];