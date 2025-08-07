import { BookingData, Cleaner } from '../types';

// Helper function to format date for display
const formatDateForDisplay = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  }
};

// Helper function to format time for display
const formatTimeForDisplay = (hour: string, minute: string): string => {
  const hourNum = parseInt(hour);
  const minuteNum = parseInt(minute);
  const hour12 = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
  const ampm = hourNum >= 12 ? 'PM' : 'AM';
  return `${hour12}:${minuteNum.toString().padStart(2, '0')} ${ampm}`;
};

// Helper function to generate alternative time slots
const generateAlternativeSlots = (bookingData: BookingData): string[] => {
  if (!bookingData.selectedDate || !bookingData.selectedHour || !bookingData.selectedMinute) {
    return [];
  }

  const selectedDate = new Date(bookingData.selectedDate);
  const selectedHour = parseInt(bookingData.selectedHour);
  const selectedMinute = parseInt(bookingData.selectedMinute);
  
  const slots: string[] = [];
  
  // Add the exact selected time
  const selectedTimeDisplay = formatTimeForDisplay(bookingData.selectedHour, bookingData.selectedMinute);
  const selectedDateDisplay = formatDateForDisplay(bookingData.selectedDate);
  slots.push(`${selectedDateDisplay} ${selectedTimeDisplay}`);
  
  // Add alternative times on the same day (±1-2 hours)
  const alternativeTimes = [
    { hour: selectedHour - 2, minute: selectedMinute },
    { hour: selectedHour - 1, minute: selectedMinute },
    { hour: selectedHour + 1, minute: selectedMinute },
    { hour: selectedHour + 2, minute: selectedMinute },
  ];

  alternativeTimes.forEach(({ hour, minute }) => {
    if (hour >= 8 && hour <= 18) { // Keep within business hours
      const timeDisplay = formatTimeForDisplay(hour.toString(), minute.toString());
      slots.push(`${selectedDateDisplay} ${timeDisplay}`);
    }
  });

  // Add slots for the next day
  const nextDay = new Date(selectedDate);
  nextDay.setDate(selectedDate.getDate() + 1);
  const nextDayDisplay = formatDateForDisplay(nextDay.toISOString().split('T')[0]);
  
  const nextDayTimes = [
    { hour: selectedHour, minute: selectedMinute },
    { hour: selectedHour + 1, minute: selectedMinute },
    { hour: selectedHour - 1, minute: selectedMinute },
  ];

  nextDayTimes.forEach(({ hour, minute }) => {
    if (hour >= 8 && hour <= 18) {
      const timeDisplay = formatTimeForDisplay(hour.toString(), minute.toString());
      slots.push(`${nextDayDisplay} ${timeDisplay}`);
    }
  });

  return slots.slice(0, 5); // Limit to 5 slots
};

export const getCleaners = (timing: string, bookingData?: BookingData): Cleaner[] => [
  {
    id: '1',
    name: 'Sarah Johnson',
    rating: 4.9,
    reviews: 127,
    profilePic: require('@/assets/images/maidProfile/1.jpg'),
    verified: true,
    availableSlots: timing === 'asap' 
      ? ['Today 2:00 PM', 'Today 4:30 PM', 'Today 6:00 PM', 'Tomorrow 9:00 AM', 'Tomorrow 11:30 AM']
      : generateAlternativeSlots(bookingData || {} as BookingData),
    bookingHistory: [
      {
        bookingId: 'BK001',
        date: '2024-01-15',
        cleaningType: 'Routine Clean',
        status: 'completed',
        rating: 5,
        review: 'Excellent work! Very thorough and professional.'
      },
      {
        bookingId: 'BK007',
        date: '2024-02-20',
        cleaningType: 'Deep Clean',
        status: 'completed',
        rating: 5,
        review: 'Amazing deep clean. Highly recommend!'
      }
    ]
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
      : generateAlternativeSlots(bookingData || {} as BookingData),
    bookingHistory: [
      {
        bookingId: 'BK003',
        date: '2024-01-28',
        cleaningType: 'Move-in Cleaning',
        status: 'completed',
        rating: 4,
        review: 'Good job overall, very reliable.'
      }
    ]
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
      : generateAlternativeSlots(bookingData || {} as BookingData),
    bookingHistory: [
      {
        bookingId: 'BK012',
        date: '2024-01-10',
        cleaningType: 'Routine Clean',
        status: 'completed',
        rating: 4,
        review: 'Good job, arrived on time.'
      },
      {
        bookingId: 'BK018',
        date: '2024-02-15',
        cleaningType: 'Routine Clean',
        status: 'completed',
        rating: 5,
        review: 'Amazing attention to detail!'
      },
      {
        bookingId: 'BK024',
        date: '2024-03-05',
        cleaningType: 'Routine Clean',
        status: 'completed',
        rating: 4,
      },
      {
        bookingId: 'BK030',
        date: '2024-03-20',
        cleaningType: 'Deep Clean',
        status: 'completed',
        rating: 5,
        review: 'Outstanding deep cleaning service!'
      }
    ]
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
      : generateAlternativeSlots(bookingData || {} as BookingData)
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
      : generateAlternativeSlots(bookingData || {} as BookingData)
  }
];