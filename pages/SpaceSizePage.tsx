import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { PageContainer } from '../components/PageContainer';
import { commonStyles } from '../styles/commonStyles';
import { BookingData } from '../types';

interface SpaceSizePageProps {
  bookingData: BookingData;
  updateBookingData: (field: keyof BookingData, value: string) => void;
  onNext?: () => void;
  onBack?: () => void;
}

export const SpaceSizePage: React.FC<SpaceSizePageProps> = ({
  bookingData,
  updateBookingData,
  onNext,
  onBack
}) => (
  <PageContainer 
    title="How many bedrooms and bathrooms are there?"
    scrollable
  >
    <View style={commonStyles.counterSection}>
      <View style={commonStyles.counterRow}>
        <Text style={commonStyles.counterLabel}>Bedrooms</Text>
        <View style={commonStyles.counterControls}>
          <TouchableOpacity
            style={commonStyles.counterBtn}
            onPress={() => {
              const current = parseInt(bookingData.bedrooms) || 0;
              if (current > 0) {
                updateBookingData('bedrooms', (current - 1).toString());
              }
            }}
          >
            <Text style={commonStyles.counterBtnText}>−</Text>
          </TouchableOpacity>
          <View style={commonStyles.counterDisplay}>
            <Text style={commonStyles.counterNumber}>{bookingData.bedrooms || '0'}</Text>
          </View>
          <TouchableOpacity
            style={commonStyles.counterBtn}
            onPress={() => {
              const current = parseInt(bookingData.bedrooms) || 0;
              if (current < 10) {
                updateBookingData('bedrooms', (current + 1).toString());
              }
            }}
          >
            <Text style={commonStyles.counterBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={commonStyles.counterDivider} />

      <View style={commonStyles.counterRow}>
        <Text style={commonStyles.counterLabel}>Bathrooms</Text>
        <View style={commonStyles.counterControls}>
          <TouchableOpacity
            style={commonStyles.counterBtn}
            onPress={() => {
              const current = parseFloat(bookingData.bathrooms) || 0;
              if (current > 0) {
                const newValue = current >= 1 ? current - 0.5 : 0;
                updateBookingData('bathrooms', newValue.toString());
              }
            }}
          >
            <Text style={commonStyles.counterBtnText}>−</Text>
          </TouchableOpacity>
          <View style={commonStyles.counterDisplay}>
            <Text style={commonStyles.counterNumber}>{bookingData.bathrooms || '0'}</Text>
          </View>
          <TouchableOpacity
            style={commonStyles.counterBtn}
            onPress={() => {
              const current = parseFloat(bookingData.bathrooms) || 0;
              if (current < 10) {
                const newValue = current + 0.5;
                updateBookingData('bathrooms', newValue.toString());
              }
            }}
          >
            <Text style={commonStyles.counterBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>

    <View style={commonStyles.formGroup}>
      <Text style={commonStyles.formLabel}>Square Footage (approximate)</Text>
      <View style={commonStyles.dropdownContainer}>
        {['Under 1,200 sq ft', 'Under 3,000 sq ft', '3,000+ sq ft'].map((option) => (
          <TouchableOpacity
            key={option}
            style={[commonStyles.dropdownOption, bookingData.squareFootage === option && commonStyles.selectedOption]}
            onPress={() => updateBookingData('squareFootage', option)}
          >
            <Text style={[commonStyles.dropdownText, bookingData.squareFootage === option && commonStyles.selectedText]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  </PageContainer>
);
