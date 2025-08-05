import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { PageContainer } from '../components/PageContainer';
import { commonStyles } from '../styles/commonStyles';
import { BookingData, Cleaner } from '../types';

interface BookingPageProps {
  bookingData: BookingData;
  updateBookingData: (field: keyof BookingData, value: string) => void;
  cleaners: Cleaner[];
  onNext?: () => void;
  onBack?: () => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({
  bookingData,
  updateBookingData,
  cleaners,
  onNext,
  onBack
}) => {
  const selectedCleaner = cleaners.find(c => c.id === bookingData.selectedCleaner);
  
  return (
    <PageContainer 
      title="Booking Details"
      subtitle="How many hours and contact information"
      scrollable
    >
      <View style={commonStyles.formGroup}>
        <Text style={commonStyles.formLabel}>Hours Needed (minimum 2 hours)</Text>
        <View style={commonStyles.counterSection}>
          <View style={commonStyles.counterRow}>
            <Text style={commonStyles.counterLabel}>Hours</Text>
            <View style={commonStyles.counterControls}>
              <TouchableOpacity
                style={commonStyles.counterBtn}
                onPress={() => {
                  const current = parseInt(bookingData.bookingHours) || 2;
                  if (current > 2) {
                    updateBookingData('bookingHours', (current - 1).toString());
                  }
                }}
              >
                <Text style={commonStyles.counterBtnText}>−</Text>
              </TouchableOpacity>
              <View style={commonStyles.counterDisplay}>
                <Text style={commonStyles.counterNumber}>{bookingData.bookingHours}</Text>
              </View>
              <TouchableOpacity
                style={commonStyles.counterBtn}
                onPress={() => {
                  const current = parseInt(bookingData.bookingHours) || 2;
                  if (current < 8) {
                    updateBookingData('bookingHours', (current + 1).toString());
                  }
                }}
              >
                <Text style={commonStyles.counterBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <View style={commonStyles.formGroup}>
        <Text style={commonStyles.formLabel}>Home Address</Text>
        <TextInput
          style={commonStyles.zipInput}
          placeholder="Enter your full address"
          placeholderTextColor="#999"
          value={bookingData.homeAddress}
          onChangeText={(text) => updateBookingData('homeAddress', text)}
          multiline={true}
          numberOfLines={3}
        />
      </View>

      <View style={commonStyles.formGroup}>
        <Text style={commonStyles.formLabel}>Phone Number</Text>
        <TextInput
          style={commonStyles.zipInput}
          placeholder="Enter your phone number"
          placeholderTextColor="#999"
          value={bookingData.phoneNumber}
          onChangeText={(text) => updateBookingData('phoneNumber', text)}
          keyboardType="phone-pad"
        />
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