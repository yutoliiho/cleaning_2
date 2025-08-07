import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { PageContainer } from '../components/PageContainer';
import { commonStyles } from '../styles/commonStyles';
import { BookingData, Cleaner } from '../types';
import { formatPhoneNumber, isValidAddress, isValidPhoneNumber } from '../utils/zipCodeUtils';

const getHourlyRate = (cleaningType: string): number => {
  switch (cleaningType) {
    case 'routine':
      return 35;
    case 'deep':
      return 45;
    default:
      return 35; // Default to routine rate
  }
};

const formatCleaningType = (cleaningType: string): string => {
  switch (cleaningType) {
    case 'routine':
      return 'Routine Clean';
    case 'deep':
      return 'Deep Clean';
    default:
      return cleaningType; // Return as-is if unknown
  }
};

interface BookingPageProps {
  bookingData: BookingData;
  updateBookingData: (field: keyof BookingData, value: string) => void;
  cleaners: Cleaner[];
  onNext?: () => void;
  onBack?: () => void;
  onViewCleanerProfile?: () => void;
}

const Counter: React.FC<{
  label: string;
  value: string;
  onDecrease: () => void;
  onIncrease: () => void;
  canDecrease: boolean;
  canIncrease: boolean;
}> = ({ label, value, onDecrease, onIncrease, canDecrease, canIncrease }) => (
  <View style={styles.counterContainer}>
    <Text style={styles.counterLabel}>{label}</Text>
    <View style={styles.counterRow}>
      <TouchableOpacity
        style={[
          styles.counterButton,
          !canDecrease && styles.counterButtonDisabled
        ]}
        onPress={onDecrease}
        disabled={!canDecrease}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.counterButtonText,
          !canDecrease && styles.counterButtonTextDisabled
        ]}>−</Text>
      </TouchableOpacity>
      
      <View style={styles.counterValueContainer}>
        <Text style={styles.counterValue}>{value}</Text>
      </View>
      
      <TouchableOpacity
        style={[
          styles.counterButton,
          !canIncrease && styles.counterButtonDisabled
        ]}
        onPress={onIncrease}
        disabled={!canIncrease}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.counterButtonText,
          !canIncrease && styles.counterButtonTextDisabled
        ]}>+</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export const BookingPage: React.FC<BookingPageProps> = ({
  bookingData,
  updateBookingData,
  cleaners,
  onNext,
  onBack,
  onViewCleanerProfile
}) => {
  const selectedCleaner = cleaners.find(c => c.id === bookingData.selectedCleaner);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Validation checks
  const isAddressValid = isValidAddress(bookingData.homeAddress);
  const isPhoneValid = isValidPhoneNumber(bookingData.phoneNumber);

  const handleAddressChange = (text: string) => {
    updateBookingData('homeAddress', text);
    setAddressError(null);
    
    if (text.length > 0 && !isValidAddress(text)) {
      setAddressError('Please enter a complete address with street number and name');
    }
  };

  const handlePhoneChange = (text: string) => {
    // Format the phone number as user types
    const formatted = formatPhoneNumber(text);
    updateBookingData('phoneNumber', formatted);
    setPhoneError(null);
    
    if (text.length > 0 && !isValidPhoneNumber(text)) {
      setPhoneError('Please enter a valid 10-digit phone number');
    }
  };

  const hoursCount = parseInt(bookingData.bookingHours) || 2;

  // Get minimum hours based on cleaning type
  const getMinimumHours = (cleaningType: string): number => {
    switch (cleaningType) {
      case 'deep':
        return 3;
      case 'routine':
      default:
        return 2;
    }
  };

  const minimumHours = getMinimumHours(bookingData.cleaningType);

  const handleHoursDecrease = () => {
    if (hoursCount > minimumHours) {
      updateBookingData('bookingHours', (hoursCount - 1).toString());
    }
  };

  const handleHoursIncrease = () => {
    if (hoursCount < 8) {
      updateBookingData('bookingHours', (hoursCount + 1).toString());
    }
  };
  
  return (
    <PageContainer 
      title="Booking Details"
      subtitle="Contact information and service duration"
      scrollable
    >
      <View style={commonStyles.formGroup}>
        <Text style={commonStyles.formLabel}>Home Address *</Text>
        <TextInput
          style={[
            commonStyles.zipInput,
            bookingData.homeAddress && !isAddressValid && styles.invalidInput
          ]}
          placeholder="Enter your full address (e.g., 123 Main St, Apt 4B)"
          placeholderTextColor="#999"
          value={bookingData.homeAddress}
          onChangeText={handleAddressChange}
          multiline={true}
          numberOfLines={3}
        />
        {(addressError || (bookingData.homeAddress && !isAddressValid)) && (
          <Text style={styles.errorText}>
            {addressError || 'Please enter a complete address with street number and name'}
          </Text>
        )}
      </View>

      <View style={commonStyles.formGroup}>
        <Text style={commonStyles.formLabel}>Phone Number *</Text>
        <TextInput
          style={[
            commonStyles.zipInput,
            bookingData.phoneNumber && !isPhoneValid && styles.invalidInput
          ]}
          placeholder="(555) 123-4567"
          placeholderTextColor="#999"
          value={bookingData.phoneNumber}
          onChangeText={handlePhoneChange}
          keyboardType="phone-pad"
          maxLength={14} // Formatted phone number length
        />
        {(phoneError || (bookingData.phoneNumber && !isPhoneValid)) && (
          <Text style={styles.errorText}>
            {phoneError || 'Please enter a valid 10-digit phone number'}
          </Text>
        )}
      </View>

      {/* Hour counter with cleaner profile */}
      <View style={styles.hoursSection}>
        {selectedCleaner && (
          <TouchableOpacity 
            style={styles.cleanerProfileSection}
            onPress={onViewCleanerProfile}
            activeOpacity={0.8}
          >
            <View style={styles.cleanerProfileHeader}>
              <Image 
                source={selectedCleaner.profilePic}
                style={styles.cleanerProfileImage}
                resizeMode="cover"
              />
              <View style={styles.cleanerProfileInfo}>
                <Text style={styles.cleanerProfileName}>
                  Your Cleaner: {selectedCleaner.name}
                </Text>
                <View style={styles.cleanerProfileRating}>
                  <Text style={styles.cleanerRatingText}>
                    {'⭐'.repeat(Math.floor(selectedCleaner.rating))} {selectedCleaner.rating}
                  </Text>
                  {selectedCleaner.verified && (
                    <View style={styles.verifiedBadgeSmall}>
                      <Text style={styles.verifiedCheckmarkSmall}>✓</Text>
                    </View>
                  )}
                </View>
              </View>
              <Text style={styles.viewProfileArrow}>→</Text>
            </View>
          </TouchableOpacity>
        )}
        
        <Counter
          label={`Hours Needed (minimum ${minimumHours} hours)`}
          value={bookingData.bookingHours}
          onDecrease={handleHoursDecrease}
          onIncrease={handleHoursIncrease}
          canDecrease={hoursCount > minimumHours}
          canIncrease={hoursCount < 8}
        />
        <Text style={styles.hoursNote}>
          Estimated cost: ${(hoursCount * getHourlyRate(bookingData.cleaningType)).toFixed(0)} 
          ({bookingData.bookingHours} hours × ${getHourlyRate(bookingData.cleaningType)}/hour)
        </Text>
      </View>

      <View style={commonStyles.formGroup}>
        <Text style={commonStyles.formLabel}>Notes (optional)</Text>
        <TextInput
          style={commonStyles.zipInput}
          placeholder="Any special instructions or requests"
          placeholderTextColor="#999"
          value={bookingData.bookingNotes}
          onChangeText={(text) => updateBookingData('bookingNotes', text)}
          multiline={true}
          numberOfLines={4}
        />
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  invalidInput: {
    borderColor: '#FF6B6B',
    borderWidth: 2,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    marginTop: 8,
    marginLeft: 4,
  },
  hoursSection: {
    paddingTop: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  hoursNote: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
    paddingBottom: 10
  },
  // Counter styles matching SpaceSizePage
  counterContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  counterLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  counterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#00D4AA',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00D4AA',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  counterButtonDisabled: {
    backgroundColor: '#E5E5E5',
    shadowOpacity: 0,
    elevation: 0,
  },
  counterButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 24,
  },
  counterButtonTextDisabled: {
    color: '#999',
  },
  counterValueContainer: {
    minWidth: 80,
    height: 48,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  counterValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  cleanerProfileSection: {
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cleanerProfileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cleanerProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  cleanerProfileInfo: {
    flex: 1,
  },
  cleanerProfileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  cleanerProfileRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  cleanerRatingText: {
    fontSize: 16,
    color: '#FFD700', // Gold color for stars
  },
  viewProfileArrow: {
    fontSize: 24,
    color: '#999',
    marginLeft: 10,
  },
  verifiedBadgeSmall: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginLeft: 10,
  },
  verifiedCheckmarkSmall: {
    fontSize: 14,
    color: 'white',
  },
});