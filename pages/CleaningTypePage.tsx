import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { PageContainer } from '../components/PageContainer';
import { commonStyles } from '../styles/commonStyles';
import { BookingData } from '../types';

interface CleaningTypePageProps {
  bookingData: BookingData;
  updateBookingData: (field: keyof BookingData, value: string) => void;
  onNext?: () => void;
  onBack?: () => void;
}

export const CleaningTypePage: React.FC<CleaningTypePageProps> = ({
  bookingData,
  updateBookingData,
  onNext,
  onBack
}) => (
  <PageContainer title="What type of cleaning do you need?">
    <TouchableOpacity 
      style={[commonStyles.optionCard, bookingData.cleaningType === 'routine' && commonStyles.selected]}
      onPress={() => updateBookingData('cleaningType', 'routine')}
    >
      <Text style={commonStyles.optionTitle}>Routine Clean</Text>
      <Text style={commonStyles.optionDescription}>Regular maintenance cleaning for upkeep</Text>
    </TouchableOpacity>

    <TouchableOpacity 
      style={[commonStyles.optionCard, bookingData.cleaningType === 'deep' && commonStyles.selected]}
      onPress={() => updateBookingData('cleaningType', 'deep')}
    >
      <Text style={commonStyles.optionTitle}>Deep Clean</Text>
      <Text style={commonStyles.optionDescription}>Thorough cleaning for move-in/out or spring cleaning</Text>
    </TouchableOpacity>
  </PageContainer>
);