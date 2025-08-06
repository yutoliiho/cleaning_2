export interface BookingData {
    zipCode: string;
    neighborhood: string; // Added for neighborhood lookup display
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
    // Payment fields
    paymentMethod: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
    billingAddress: string;
    paymentCompleted: string;
  }
  
  export interface CleanerBookingHistory {
    bookingId: string;
    date: string;
    cleaningType: string;
    status: 'completed' | 'cancelled';
    rating?: number;
    review?: string;
  }
  
  export interface Cleaner {
    id: string;
    name: string;
    rating: number;
    reviews: number;
    profilePic: any;
    verified: boolean;
    availableSlots: string[];
    bookingHistory?: CleanerBookingHistory[];
  }

  export interface ConfirmedBooking {
    id: string;
    bookingData: BookingData;
    cleaner: Cleaner;
    confirmedAt: string;
    status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  }