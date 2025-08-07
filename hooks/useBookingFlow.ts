import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { BookingData, ConfirmedBooking } from '../types';

interface BookingFlowContextType {
  currentStep: number;
  bookingData: BookingData;
  confirmedBookings: ConfirmedBooking[];
  isBookingDetailActive: boolean;
  updateBookingData: (field: keyof BookingData, value: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  setCurrentStep: (step: number) => void;
  saveConfirmedBooking: (cleaner: any) => Promise<void>;
  loadConfirmedBookings: () => Promise<void>;
  addSampleBookings: () => Promise<void>;
  setBookingDetailActive: (active: boolean) => void;
}

const BookingFlowContext = createContext<BookingFlowContextType | undefined>(undefined);

const CONFIRMED_BOOKINGS_KEY = 'confirmed_bookings';

export const BookingFlowProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [confirmedBookings, setConfirmedBookings] = useState<ConfirmedBooking[]>([]);
  const [isBookingDetailActive, setIsBookingDetailActive] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData>({
    zipCode: '',
    neighborhood: '',
    cleaningType: '',
    bedrooms: '2',
    bathrooms: '2',
    squareFootage: '',
    timing: '',
    selectedDate: '',
    selectedTime: '',
    selectedHour: '',
    selectedMinute: '',
    selectedCleaner: '',
    selectedTimeSlot: '',
    bookingHours: '3', // Default to 3 to accommodate deep clean minimum
    homeAddress: '',
    phoneNumber: '',
    bookingNotes: '',
    allowSubstitute: 'true',
    // Payment fields
    paymentMethod: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: '',
    paymentCompleted: 'false'
  });

  // Load confirmed bookings on app start
  useEffect(() => {
    loadConfirmedBookings();
  }, []);

  const updateBookingData = (field: keyof BookingData, value: string) => {
    setBookingData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-adjust hours when cleaning type changes
      if (field === 'cleaningType') {
        const currentHours = parseInt(prev.bookingHours) || 3;
        const minHours = value === 'deep' ? 3 : 2;
        
        // If current hours are less than minimum for new cleaning type, adjust
        if (currentHours < minHours) {
          newData.bookingHours = minHours.toString();
        }
        // If switching from deep to routine and user has exactly 3 hours, 
        // offer the routine minimum of 2 hours
        else if (value === 'routine' && currentHours === 3 && prev.cleaningType === 'deep') {
          newData.bookingHours = '2';
        }
      }
      
      return newData;
    });
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const saveConfirmedBooking = async (cleaner: any) => {
    try {
      const newBooking: ConfirmedBooking = {
        id: Date.now().toString(),
        bookingData: { ...bookingData },
        cleaner,
        confirmedAt: new Date().toISOString(),
        status: 'confirmed'
      };

      const updatedBookings = [...confirmedBookings, newBooking];
      setConfirmedBookings(updatedBookings);
      
      await AsyncStorage.setItem(CONFIRMED_BOOKINGS_KEY, JSON.stringify(updatedBookings));
    } catch (error) {
      console.error('Error saving confirmed booking:', error);
    }
  };

  const loadConfirmedBookings = async () => {
    try {
      const stored = await AsyncStorage.getItem(CONFIRMED_BOOKINGS_KEY);
      if (stored) {
        const bookings: ConfirmedBooking[] = JSON.parse(stored);
        setConfirmedBookings(bookings);
      }
    } catch (error) {
      console.error('Error loading confirmed bookings:', error);
    }
  };

  // Development utility to add sample bookings
  const addSampleBookings = async () => {
    const sampleBookings: ConfirmedBooking[] = [
      {
        id: 'sample-1',
        bookingData: {
          zipCode: '10001',
          neighborhood: 'Manhattan',
          cleaningType: 'deep', // Use lowercase to match our system
          bedrooms: '2',
          bathrooms: '2',
          squareFootage: '800',
          timing: 'scheduled',
          selectedDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
          selectedTime: '',
          selectedHour: '14',
          selectedMinute: '30',
          selectedCleaner: '1',
          selectedTimeSlot: '',
          bookingHours: '3', // Deep clean minimum
          homeAddress: '123 Main St, Apt 4B',
          phoneNumber: '(555) 123-4567',
          bookingNotes: 'Please be careful with the plants',
          allowSubstitute: 'true',
          // Payment fields
          paymentMethod: 'card',
          cardNumber: '****',
          expiryDate: '**/**',
          cvv: '***',
          cardholderName: 'John Doe',
          billingAddress: '123 Main St, Apt 4B',
          paymentCompleted: 'true'
        },
        cleaner: {
          id: '1',
          name: 'Sarah Johnson',
          rating: 4.9,
          reviews: 127,
          profilePic: require('@/assets/images/maidProfile/1.jpg'),
          verified: true,
          availableSlots: []
        },
        confirmedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        status: 'confirmed'
      },
      {
        id: 'sample-2',
        bookingData: {
          zipCode: '10001',
          neighborhood: 'Manhattan',
          cleaningType: 'routine', // Use lowercase to match our system
          bedrooms: '1',
          bathrooms: '1',
          squareFootage: '600',
          timing: 'asap',
          selectedDate: '',
          selectedTime: '',
          selectedHour: '',
          selectedMinute: '',
          selectedCleaner: '2',
          selectedTimeSlot: 'Today 4:30 PM',
          bookingHours: '2',
          homeAddress: '456 Oak Ave, Unit 2A',
          phoneNumber: '(555) 987-6543',
          bookingNotes: '',
          allowSubstitute: 'true',
          // Payment fields
          paymentMethod: 'card',
          cardNumber: '****',
          expiryDate: '**/**',
          cvv: '***',
          cardholderName: 'Jane Smith',
          billingAddress: '456 Oak Ave, Unit 2A',
          paymentCompleted: 'true'
        },
        cleaner: {
          id: '2',
          name: 'Mike Rodriguez',
          rating: 4.8,
          reviews: 89,
          profilePic: require('@/assets/images/maidProfile/2.jpg'),
          verified: true,
          availableSlots: []
        },
        confirmedAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        status: 'confirmed'
      }
    ];

    try {
      const updatedBookings = [...confirmedBookings, ...sampleBookings];
      setConfirmedBookings(updatedBookings);
      await AsyncStorage.setItem(CONFIRMED_BOOKINGS_KEY, JSON.stringify(updatedBookings));
    } catch (error) {
      console.error('Error adding sample bookings:', error);
    }
  };

  return React.createElement(BookingFlowContext.Provider, {
    value: {
      currentStep,
      bookingData,
      confirmedBookings,
      updateBookingData,
      nextStep,
      prevStep,
      goToStep,
      setCurrentStep,
      saveConfirmedBooking,
      loadConfirmedBookings,
      addSampleBookings,
      isBookingDetailActive,
      setBookingDetailActive: setIsBookingDetailActive
    }
  }, children);
};

export const useBookingFlow = () => {
  const context = useContext(BookingFlowContext);
  if (context === undefined) {
    throw new Error('useBookingFlow must be used within a BookingFlowProvider');
  }
  return context;
};