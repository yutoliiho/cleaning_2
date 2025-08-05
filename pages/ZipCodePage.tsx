import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { PageContainer } from '../components/PageContainer';
import { commonStyles } from '../styles/commonStyles';
import { BookingData } from '../types';

interface ZipCodePageProps {
  bookingData: BookingData;
  updateBookingData: (field: keyof BookingData, value: string) => void;
  onNext?: () => void;
}

export const ZipCodePage: React.FC<ZipCodePageProps> = ({
  bookingData,
  updateBookingData,
  onNext
}) => (
  <PageContainer 
    title="What's your zip code?"
    subtitle="We'll find cleaners available in your area"
  >
    <TextInput
      style={commonStyles.zipInput}
      placeholder="Enter zip code"
      placeholderTextColor="#999"
      value={bookingData.zipCode}
      onChangeText={(text) => updateBookingData('zipCode', text)}
      keyboardType="numeric"
      maxLength={5}
      autoFocus={true}
      blurOnSubmit={false}
    />
    
    <TouchableOpacity 
      style={[
        styles.continueButton,
        !bookingData.zipCode && styles.disabledButton
      ]}
      onPress={onNext}
      disabled={!bookingData.zipCode}
    >
      <Text style={[
        styles.continueButtonText,
        !bookingData.zipCode && styles.disabledButtonText
      ]}>
        Continue
      </Text>
    </TouchableOpacity>
  </PageContainer>
);

const styles = StyleSheet.create({
  continueButton: {
    backgroundColor: '#00D4AA',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginTop: 0, // Remove margin to place directly below input
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
});
