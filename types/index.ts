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
    // Guest checkout fields
    guestEmail?: string;
    guestName?: string;
    isGuestCheckout?: string;
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

  // User Authentication Types
  export interface User {
    id: string;
    name: string;
    email: string;
    profileImage?: string;
    phoneNumber?: string;
    defaultAddress?: string;
    defaultLocation?: string;
    language?: string;
    theme?: 'light' | 'dark' | 'system';
    notifications?: {
      push: boolean;
      email: boolean;
      sms: boolean;
    };
    paymentMethods?: PaymentMethod[];
    addresses?: Address[];
    createdAt: string;
    lastLoginAt: string;
  }

  export interface PaymentMethod {
    id: string;
    type: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
    cardNumber?: string; // Last 4 digits
    expiryDate?: string;
    cardholderName?: string;
    isDefault: boolean;
  }

  export interface Address {
    id: string;
    label: string; // 'Home', 'Work', etc.
    address: string;
    city: string;
    state: string;
    zipCode: string;
    isDefault: boolean;
  }

  export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;
    isGuest: boolean;
    guestData?: {
      name: string;
      email: string;
      phoneNumber?: string;
    };
  }