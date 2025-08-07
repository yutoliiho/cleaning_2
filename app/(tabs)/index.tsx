// app/(tabs)/index.tsx
import { ProgressBar } from '@/components/ProgressBar';
import React, { useState } from 'react';
import { Alert, View } from 'react-native';
// '../../components/ProgressBar';
import { CheckoutAuthModal } from '@/components/CheckoutAuthModal';
import { useAuth } from '@/hooks/useAuth';
import { useBookingFlow } from '@/hooks/useBookingFlow';
import { commonStyles } from '@/styles/commonStyles';
import { isValidAddress, isValidPhoneNumber, isValidZipCode } from '@/utils/zipCodeUtils';
import { getCleaners } from '../../data/cleaners';

// Import all page components
import { NavigationButtons } from '@/components/NavigationButtons';
import { BookingDetailPage } from '@/pages/BookingDetailPage';
import { CleanerProfileDetailPage } from '@/pages/CleanerProfileDetailPage';
import { CleanersPage } from '@/pages/CleanersPage';
import { CleaningTypePage } from '@/pages/CleaningTypePage';
import { PaymentPage } from '@/pages/PaymentPage';
import { ReservationConfirmedPage } from '@/pages/ReservationConfirmedPage';
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
    setCurrentStep,
    saveConfirmedBooking
  } = useBookingFlow();

  const { isAuthenticated, isGuest, guestData } = useAuth();

  // Payment processing state
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentProcessor, setPaymentProcessor] = useState<(() => Promise<boolean>) | null>(null);
  const [previousStep, setPreviousStep] = useState<number | null>(null);
  
  // Checkout authentication state
  const [showCheckoutAuth, setShowCheckoutAuth] = useState(false);

  // Get cleaners data with current timing preference
  const cleaners = getCleaners(bookingData.timing, bookingData);

  const handleCleanerSelection = (cleanerId: string) => {
    updateBookingData('selectedCleaner', cleanerId);
    setCurrentStep(5); // Go to cleaner profile detail page
  };

  const handleTimeSlotSelection = (cleanerId: string, timeSlot: string) => {
    updateBookingData('selectedCleaner', cleanerId);
    updateBookingData('selectedTimeSlot', timeSlot);
    setCurrentStep(6); // Go to booking page
  };

  const handleViewCleanerProfile = () => {
    setPreviousStep(currentStep); // Store current step before navigating
    
    // Always go to CleanerProfileDetailPage to view cleaner's about/profile information
    setCurrentStep(5); // Go to cleaner profile detail page
  };

  const handleCompleteBooking = async () => {
    const selectedCleaner = cleaners.find(c => c.id === bookingData.selectedCleaner);
    
    // For ASAP appointments with substitute allowed, go to confirmation page
    if (bookingData.timing === 'asap' && bookingData.allowSubstitute === 'true') {
      if (selectedCleaner) {
        // Save the booking for ASAP with substitute
        await saveConfirmedBooking(selectedCleaner);
      }
      setCurrentStep(8); // Go to ReservationConfirmedPage (updated step number)
    } else {
      // For other cases (ASAP without substitute), save and show alert
      if (selectedCleaner) {
        await saveConfirmedBooking(selectedCleaner);
      }
      Alert.alert(
        'Reservation Confirmed!', 
        `Your cleaning appointment has been submitted. You'll receive a confirmation within 15 minutes. We'll wait for ${selectedCleaner?.name} to confirm.`,
        [{
          text: 'OK',
          onPress: () => setCurrentStep(0) // Go back to start
        }]
      );
    }
  };

  const handlePaymentProcess = async () => {
    console.log('handlePaymentProcess called');
    console.log('paymentProcessor:', paymentProcessor);
    console.log('bookingData.paymentMethod:', bookingData.paymentMethod);
    
    if (!paymentProcessor) {
      console.log('No payment processor available');
      return;
    }
    
    setIsProcessingPayment(true);
    try {
      const success = await paymentProcessor();
      console.log('Payment result:', success);
      if (success) {
        // Save booking after successful payment
        const selectedCleaner = cleaners.find(c => c.id === bookingData.selectedCleaner);
        if (selectedCleaner) {
          await saveConfirmedBooking(selectedCleaner);
        }
        
        // Route to appropriate confirmation page
        if (bookingData.timing === 'scheduled' || 
            (bookingData.timing === 'asap' && bookingData.allowSubstitute === 'true')) {
          setCurrentStep(8); // Go to ReservationConfirmedPage
        } else {
          setCurrentStep(9); // Go to ReservationPendingPage for ASAP without substitute
        }
      }
    } catch (error) {
      console.error('Payment processing error:', error);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Function to store payment processor with proper handling
  const handleSetPaymentProcessor = (processor: () => Promise<boolean>) => {
    setPaymentProcessor(() => processor);
  };

  // Handle checkout authentication flow
  const handleCheckoutAuthRequired = () => {
    if (isAuthenticated || isGuest) {
      // User is already authenticated or is a guest, proceed to payment
      if (isGuest && guestData) {
        // Update booking data with guest information
        updateBookingData('guestName', guestData.name);
        updateBookingData('guestEmail', guestData.email);
        updateBookingData('isGuestCheckout', 'true');
      }
      setCurrentStep(7); // Go to payment page
    } else {
      // Show checkout authentication modal
      setShowCheckoutAuth(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowCheckoutAuth(false);
    setCurrentStep(7); // Go to payment page
  };

  const handleGuestContinue = () => {
    setShowCheckoutAuth(false);
    // Update booking data with guest information
    if (guestData) {
      updateBookingData('guestName', guestData.name);
      updateBookingData('guestEmail', guestData.email);
      updateBookingData('isGuestCheckout', 'true');
    }
    setCurrentStep(7); // Go to payment page
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
          nextDisabled: !isValidZipCode(bookingData.zipCode) || !bookingData.neighborhood,
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
              // For scheduled appointments, randomly assign a cleaner and go to booking page
              const availableCleaners = cleaners.filter(cleaner => cleaner.availableSlots.length > 0);
              if (availableCleaners.length > 0) {
                const randomCleaner = availableCleaners[Math.floor(Math.random() * availableCleaners.length)];
                // Use the first available slot from the randomly selected cleaner
                const selectedTimeSlot = randomCleaner.availableSlots[0];
                updateBookingData('selectedCleaner', randomCleaner.id);
                updateBookingData('selectedTimeSlot', selectedTimeSlot);
              }
              setCurrentStep(6); // Go to booking page to collect user details
            } else if (bookingData.timing === 'asap') {
              setCurrentStep(4); // ASAP - go to cleaners selection
            }
          },
          nextDisabled: bookingData.timing === 'scheduled' ? 
            !(bookingData.timing === 'scheduled' && bookingData.selectedDate && bookingData.selectedHour && bookingData.selectedMinute) : 
            !bookingData.timing,
          nextText: bookingData.timing === 'scheduled' ? 'Book Now' : 'Continue'
        };
      case 4: // CleanersPage
        return {
          showBack: true,
          showNext: false, // Remove "Book now" button for ASAP cases
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
          onBack: () => {
            // If we have a previous step stored, go back to it
            if (previousStep !== null) {
              setCurrentStep(previousStep);
              setPreviousStep(null); // Clear the previous step
            } else {
              // Default behavior: For ASAP appointments, go back to cleaners page (step 4)
              if (bookingData.timing === 'asap') {
                setCurrentStep(4); // Go back to cleaners selection
              } else {
                setCurrentStep(4); // Fallback to cleaners page
              }
            }
          }
        };
      case 6: // BookingPage
        return {
          showBack: true,
          showNext: true,
          onBack: () => {
            // For scheduled appointments, go back to TimingPage (step 3)
            // For ASAP appointments, go back to CleanerProfileDetailPage (step 5)
            if (bookingData.timing === 'scheduled') {
              setCurrentStep(3);
            } else {
              prevStep();
            }
          },
          onNext: handleCheckoutAuthRequired, // Updated to handle authentication
          nextDisabled: !isValidAddress(bookingData.homeAddress) || !isValidPhoneNumber(bookingData.phoneNumber),
          nextText: 'Continue to Payment'
        };
      case 7: // PaymentPage
        return {
          showBack: true,
          showNext: true,
          onBack: prevStep,
          onNext: handlePaymentProcess,
          nextDisabled: isProcessingPayment || 
            !bookingData.paymentMethod || 
            (bookingData.paymentMethod === 'card' && (
              !bookingData.cardholderName.trim() ||
              !bookingData.cardNumber.trim() ||
              !bookingData.expiryDate.trim() ||
              !bookingData.cvv.trim() ||
              !bookingData.billingAddress.trim()
            )),
          nextText: isProcessingPayment ? 'Processing...' : `Pay $${(parseInt(bookingData.bookingHours || '2') * 35 * 1.08).toFixed(2)}`
        };
      case 8: // ReservationConfirmedPage (for both scheduled and ASAP with substitute)
        return {
          showBack: false, // Remove back button from confirmation page
          showNext: true,
          onBack: () => {
            // No back action needed since showBack is false
          },
          onNext: () => setCurrentStep(0), // Complete and restart (no save needed here)
          nextDisabled: false,
          nextText: 'Done'
        };
      case 9: // ReservationPendingPage (for ASAP flow only)
        return {
          showBack: false, // Don't allow going back from pending state
          showNext: true,
          onBack: () => {}, // No action - back is disabled
          onNext: handleCompleteBooking,
          nextDisabled: false, // Remove requirement since we have a default selection
          nextText: 'Confirm'
        };
      case 10: // BookingDetailPage
        return {
          showBack: true,
          showNext: false,
          onBack: () => {
            // Go back to previous step (BookingPage)
            if (previousStep !== null) {
              setCurrentStep(previousStep);
              setPreviousStep(null); // Clear the previous step
            } else {
              // Fallback to booking page
              setCurrentStep(6);
            }
          }
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
            onViewCleanerProfile={handleViewCleanerProfile}
          />
        );
      case 7:
        return (
          <PaymentPage
            bookingData={bookingData}
            updateBookingData={updateBookingData}
            cleaners={cleaners}
            onPaymentProcess={handleSetPaymentProcessor}
            isProcessing={isProcessingPayment}
          />
        );
      case 8:
        return (
          <ReservationConfirmedPage
            bookingData={bookingData}
            cleaners={cleaners}
            onViewCleanerProfile={handleViewCleanerProfile}
          />
        );
      case 9:
        return (
          <ReservationPendingPage
            bookingData={bookingData}
            updateBookingData={updateBookingData}
            cleaners={cleaners}
          />
        );
      case 10:
        return (
          <BookingDetailPage
            bookingData={bookingData}
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

  // Calculate total steps based on timing selection
  const getTotalSteps = () => {
    if (bookingData.timing === 'scheduled') {
      return 10; // Steps: 0, 1, 2, 3, 6, 7, 8 (includes BookingPage, PaymentPage, Confirmation, Pending)
    }
    return 10; // Full ASAP flow: 0, 1, 2, 3, 4, 5, 6, 8, 9 (step 7 becomes 8, 9 becomes 10)
  };

  // Calculate display step for progress bar
  const getDisplayStep = () => {
    if (bookingData.timing === 'scheduled') {
      if (currentStep === 9) return 9; // Show as final step
      if (currentStep === 8) return 8; // BookingPage shows as step 5
      if (currentStep === 7) return 7; // PaymentPage shows as step 6
      return currentStep + 1; // Steps 0-3 show as 1-4
    } else {
      // ASAP flow
      if (currentStep === 10) return 10; // Final step
      if (currentStep === 9) return 9; // Step 9 in ASAP is different
      if (currentStep === 8) return 8; // Step 8 in ASAP is different
      return currentStep + 1; // Other steps show as step+1
    }
  };

  return (
    <>
      <View style={commonStyles.container}>
        {currentStep > 0 && (
          <ProgressBar 
            currentStep={getDisplayStep()} 
            totalSteps={getTotalSteps()} 
          />
        )}
        <View style={{ flex: 1 }}>
          {renderCurrentPage()}
        </View>
        {currentStep > 0 && (
          <View style={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            backgroundColor: '#667eea',
            paddingHorizontal: 20,
            paddingBottom: 40,
            paddingTop: 10 // Reduced from 20 to minimize space above buttons
          }}>
            <NavigationButtons
              onBack={navigationConfig.onBack}
              onNext={navigationConfig.onNext || (() => {})}
              nextDisabled={navigationConfig.nextDisabled}
              nextText={navigationConfig.nextText}
              showBack={navigationConfig.showBack}
              showNext={navigationConfig.showNext}
              isPaymentPage={currentStep === 7}
            />
          </View>
        )}
      </View>

      {/* Checkout Authentication Modal */}
      <CheckoutAuthModal
        visible={showCheckoutAuth}
        onClose={() => setShowCheckoutAuth(false)}
        onAuthSuccess={handleAuthSuccess}
        onGuestContinue={handleGuestContinue}
      />
    </>
  );
}