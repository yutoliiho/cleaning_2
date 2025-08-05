// app/(tabs)/index.tsx
import { ProgressBar } from '@/components/ProgressBar';
import React from 'react';
import { Alert, View } from 'react-native';
// '../../components/ProgressBar';
import { useBookingFlow } from '@/hooks/useBookingFlow';
import { commonStyles } from '@/styles/commonStyles';
import { getCleaners } from '../../data/cleaners';

// Import all page components
import { NavigationButtons } from '@/components/NavigationButtons';
import { CleanerProfileDetailPage } from '@/pages/CleanerProfileDetailPage';
import { CleanersPage } from '@/pages/CleanersPage';
import { CleaningTypePage } from '@/pages/CleaningTypePage';
import { ReservationPendingPage } from '@/pages/ReservationPendingPage';
import { SpaceSizePage } from '@/pages/SpaceSizePage';
import { TimingPage } from '@/pages/TimingPage';
import { ZipCodePage } from '@/pages/ZipCodePage';
import { BookingPage } from '../../pages/BookingPage';

export default function HomeScreen() {
  const {
    currentStep,
    bookingData,
    updateBookingData,
    nextStep,
    prevStep,
    setCurrentStep
  } = useBookingFlow();

  // Get cleaners data with current timing preference
  const cleaners = getCleaners(bookingData.timing);

  const handleCleanerSelection = (cleanerId: string) => {
    updateBookingData('selectedCleaner', cleanerId);
    setCurrentStep(5); // Go to cleaner profile detail page
  };

  const handleTimeSlotSelection = (cleanerId: string, timeSlot: string) => {
    updateBookingData('selectedCleaner', cleanerId);
    updateBookingData('selectedTimeSlot', timeSlot);
    setCurrentStep(6); // Go to booking page
  };

  const handleCompleteBooking = () => {
    const selectedCleaner = cleaners.find(c => c.id === bookingData.selectedCleaner);
    Alert.alert(
      'Reservation Confirmed!', 
      `Your cleaning appointment has been submitted. You'll receive a confirmation within 15 minutes. ${
        bookingData.allowSubstitute === 'true' 
          ? 'We may assign an alternative cleaner if needed.' 
          : `We'll wait for ${selectedCleaner?.name} to confirm.`
      }`,
      [{
        text: 'OK',
        onPress: () => setCurrentStep(0) // Go back to start
      }]
    );
  };

  // Navigation configuration for each step
  const getNavigationConfig = () => {
    const selectedCleaner = cleaners.find(c => c.id === bookingData.selectedCleaner);
    
    switch (currentStep) {
      case 0: // ZipCodePage - handled internally
        return {
          showBack: false,
          showNext: false, // Don't show navigation buttons for home page
          onNext: nextStep,
          nextDisabled: !bookingData.zipCode,
          nextText: 'Continue'
        };
      case 1: // CleaningTypePage
        return {
          showBack: true,
          showNext: true,
          onBack: prevStep,
          onNext: nextStep,
          nextDisabled: !bookingData.cleaningType,
          nextText: 'Continue'
        };
      case 2: // SpaceSizePage
        return {
          showBack: true,
          showNext: true,
          onBack: prevStep,
          onNext: nextStep,
          nextDisabled: !bookingData.bedrooms || !bookingData.bathrooms || !bookingData.squareFootage,
          nextText: 'Continue'
        };
      case 3: // TimingPage
        return {
          showBack: true,
          showNext: true,
          onBack: prevStep,
          onNext: () => {
            const isScheduledComplete = bookingData.timing === 'scheduled' && 
              bookingData.selectedDate && bookingData.selectedHour && bookingData.selectedMinute;
            
            if (bookingData.timing === 'scheduled' && isScheduledComplete) {
              setCurrentStep(4); // Go to cleaners with scheduled time
            } else if (bookingData.timing === 'asap') {
              setCurrentStep(4); // ASAP - skip to cleaners
            }
          },
          nextDisabled: bookingData.timing === 'scheduled' ? 
            !(bookingData.timing === 'scheduled' && bookingData.selectedDate && bookingData.selectedHour && bookingData.selectedMinute) : 
            !bookingData.timing,
          nextText: 'Continue'
        };
      case 4: // CleanersPage
        return {
          showBack: true,
          showNext: true,
          onBack: prevStep,
          onNext: () => {
            Alert.alert('Booking Confirmed!', `Your cleaning is booked with ${selectedCleaner?.name}!`);
          },
          nextDisabled: !bookingData.selectedCleaner,
          nextText: 'Book Now'
        };
      case 5: // CleanerProfileDetailPage
        return {
          showBack: true,
          showNext: false,
          onBack: prevStep
        };
      case 6: // BookingPage
        return {
          showBack: true,
          showNext: true,
          onBack: prevStep,
          onNext: () => setCurrentStep(7),
          nextDisabled: !bookingData.homeAddress || !bookingData.phoneNumber,
          nextText: 'Schedule Appointment'
        };
      case 7: // ReservationPendingPage
        return {
          showBack: true,
          showNext: true,
          onBack: prevStep,
          onNext: handleCompleteBooking,
          nextDisabled: false,
          nextText: 'Confirm Reservation'
        };
      default:
        return {
          showBack: false,
          showNext: false,
          onNext: nextStep,
          nextDisabled: false,
          nextText: 'Continue'
        };
    }
  };

  const renderCurrentPage = () => {
    switch (currentStep) {
      case 0:
        return (
          <ZipCodePage
            bookingData={bookingData}
            updateBookingData={updateBookingData}
            onNext={nextStep}
          />
        );
      case 1:
        return (
          <CleaningTypePage
            bookingData={bookingData}
            updateBookingData={updateBookingData}
          />
        );
      case 2:
        return (
          <SpaceSizePage
            bookingData={bookingData}
            updateBookingData={updateBookingData}
          />
        );
      case 3:
        return (
          <TimingPage
            bookingData={bookingData}
            updateBookingData={updateBookingData}
            onSkipToCleaners={() => setCurrentStep(4)}
          />
        );
      case 4:
        return (
          <CleanersPage
            bookingData={bookingData}
            cleaners={cleaners}
            onSelectCleaner={handleCleanerSelection}
            onSelectTimeSlot={handleTimeSlotSelection}
          />
        );
      case 5:
        return (
          <CleanerProfileDetailPage
            bookingData={bookingData}
            cleaners={cleaners}
            onSelectTimeSlot={handleTimeSlotSelection}
          />
        );
      case 6:
        return (
          <BookingPage
            bookingData={bookingData}
            updateBookingData={updateBookingData}
            cleaners={cleaners}
          />
        );
      case 7:
        return (
          <ReservationPendingPage
            bookingData={bookingData}
            updateBookingData={updateBookingData}
            cleaners={cleaners}
          />
        );
      default:
        return (
          <ZipCodePage
            bookingData={bookingData}
            updateBookingData={updateBookingData}
          />
        );
    }
  };

  const navigationConfig = getNavigationConfig();

  return (
    <View style={commonStyles.container}>
      {currentStep > 0 && <ProgressBar currentStep={currentStep} totalSteps={7} />}
      <View style={{ flex: 1 }}>
        {renderCurrentPage()}
      </View>
      {(navigationConfig.showBack || navigationConfig.showNext) && (
        <View style={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          backgroundColor: '#667eea',
          paddingHorizontal: 20,
          paddingBottom: 40,
          paddingTop: 20
        }}>
          <NavigationButtons
            onBack={navigationConfig.onBack}
            onNext={navigationConfig.onNext || (() => {})}
            nextDisabled={navigationConfig.nextDisabled}
            nextText={navigationConfig.nextText}
            showBack={navigationConfig.showBack}
            showNext={navigationConfig.showNext}
          />
        </View>
      )}
    </View>
  );
}