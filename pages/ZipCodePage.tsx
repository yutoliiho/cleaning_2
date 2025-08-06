import React, { useState } from 'react';
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { PageContainer } from '../components/PageContainer';
import { commonStyles } from '../styles/commonStyles';
import { BookingData } from '../types';
import { isValidZipCode, lookupNeighborhood } from '../utils/zipCodeUtils';

interface ZipCodePageProps {
  bookingData: BookingData;
  updateBookingData: (field: keyof BookingData, value: string) => void;
  onNext?: () => void;
}

export const ZipCodePage: React.FC<ZipCodePageProps> = ({
  bookingData,
  updateBookingData,
  onNext
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [neighborhoodError, setNeighborhoodError] = useState<string | null>(null);

  // Check if current zip code is valid
  const isZipValid = isValidZipCode(bookingData.zipCode);

  // Handle zip code input change
  const handleZipCodeChange = async (text: string) => {
    // Update zip code
    updateBookingData('zipCode', text);
    
    // Clear previous neighborhood data
    updateBookingData('neighborhood', '');
    setNeighborhoodError(null);

    // If zip code is valid (5 digits), look up neighborhood
    if (isValidZipCode(text)) {
      setIsLoading(true);
      try {
        const neighborhood = await lookupNeighborhood(text);
        if (neighborhood) {
          updateBookingData('neighborhood', neighborhood);
        } else {
          setNeighborhoodError('We don\'t service this area yet');
        }
      } catch (error) {
        setNeighborhoodError('Unable to verify location');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <PageContainer 
          title="What's your zip code?"
          subtitle="We'll find cleaners available in your area"
        >
          <TextInput
            style={[
              commonStyles.zipInput,
              bookingData.zipCode && !isZipValid && styles.invalidInput
            ]}
            placeholder="Enter zip code"
            placeholderTextColor="#999"
            value={bookingData.zipCode}
            onChangeText={handleZipCodeChange}
            keyboardType="numeric"
            maxLength={5}
            autoFocus={true}
            blurOnSubmit={false}
            onBlur={Keyboard.dismiss}
          />
          
          {/* Validation feedback */}
          {bookingData.zipCode && !isZipValid && (
            <Text style={styles.errorText}>
              Please enter a valid 5-digit zip code
            </Text>
          )}
          
          {/* Loading indicator */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#00D4AA" />
              <Text style={styles.loadingText}>Looking up location...</Text>
            </View>
          )}
          
          {/* Neighborhood display */}
          {bookingData.neighborhood && !isLoading && (
            <Text style={styles.neighborhoodText}>
              📍 {bookingData.neighborhood}
            </Text>
          )}
          
          {/* Service area error */}
          {neighborhoodError && !isLoading && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                {neighborhoodError}
              </Text>
            </View>
          )}
          
          <TouchableOpacity 
            style={[
              styles.continueButton,
              (!isZipValid || !bookingData.neighborhood || isLoading) && styles.disabledButton
            ]}
            onPress={onNext}
            disabled={!isZipValid || !bookingData.neighborhood || isLoading}
          >
            <Text style={[
              styles.continueButtonText,
              (!isZipValid || !bookingData.neighborhood || isLoading) && styles.disabledButtonText
            ]}>
              Continue
            </Text>
          </TouchableOpacity>
        </PageContainer>
      </Pressable>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  continueButton: {
    backgroundColor: '#00D4AA',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  disabledButtonText: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  invalidInput: {
    borderColor: '#FF6B6B',
    borderWidth: 2,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 8,
  },
  loadingText: {
    color: '#00D4AA',
    fontSize: 14,
    marginLeft: 8,
  },
  neighborhoodText: {
    color: '#00D4AA',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 12,
  },
  errorContainer: {
    // backgroundColor: 'rgba(255, 107, 107, 0.1)',
    // borderRadius: 12,
    // padding: 12,
    // marginTop: 12,
    // borderWidth: 1,
    // borderColor: 'rgba(255, 107, 107, 0.3)',
  },
});
