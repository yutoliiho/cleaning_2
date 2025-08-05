export interface BookingData {
    zipCode: string;
    cleaningType: string;
    bedrooms: string;
    bathrooms: string;
    squareFootage: string;
    timing: string;
    selectedDate: string;
    selectedTime: string;
    selectedHour: string;
    selectedMinute: string;
    selectedCleaner: string;
    selectedTimeSlot: string;
    bookingHours: string;
    homeAddress: string;
    phoneNumber: string;
    bookingNotes: string;
    allowSubstitute: string;
  }
  
  export interface Cleaner {
    id: string;
    name: string;
    rating: number;
    reviews: number;
    profilePic: any;
    verified: boolean;
    availableSlots: string[];
  }