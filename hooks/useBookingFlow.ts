import React, { createContext, ReactNode, useContext, useState } from 'react';
import { BookingData } from '../types';

interface BookingFlowContextType {
  currentStep: number;
  bookingData: BookingData;
  updateBookingData: (field: keyof BookingData, value: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  setCurrentStep: (step: number) => void;
}

const BookingFlowContext = createContext<BookingFlowContextType | undefined>(undefined);

export const BookingFlowProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [bookingData, setBookingData] = useState<BookingData>({
    zipCode: '',
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
    bookingHours: '2',
    homeAddress: '',
    phoneNumber: '',
    bookingNotes: '',
    allowSubstitute: 'false'
  });

  const updateBookingData = (field: keyof BookingData, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
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

  return React.createElement(BookingFlowContext.Provider, {
    value: {
      currentStep,
      bookingData,
      updateBookingData,
      nextStep,
      prevStep,
      goToStep,
      setCurrentStep
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