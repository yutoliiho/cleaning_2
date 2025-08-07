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
      <Text style={commonStyles.optionTitle}>Routine Clean - $35/hr</Text>
      <Text style={commonStyles.optionDescription}>Regular maintenance cleaning for up keep</Text>
      <Text style={commonStyles.optionDescription}>  </Text>
      <Text style={commonStyles.optionDescription}>- home cleaning</Text>
      <Text style={commonStyles.optionDescription}>- office cleaning</Text>
      <Text style={commonStyles.optionDescription}>- etc.</Text>
    </TouchableOpacity>

    <TouchableOpacity 
      style={[commonStyles.optionCard, bookingData.cleaningType === 'deep' && commonStyles.selected]}
      onPress={() => updateBookingData('cleaningType', 'deep')}
    >
      <Text style={commonStyles.optionTitle}>Deep Clean - $45/hr</Text>
      <Text style={commonStyles.optionDescription}>One off thorough cleaning </Text>
      <Text style={commonStyles.optionDescription}>  </Text>
      <Text style={commonStyles.optionDescription}>- move-in/out</Text>
      <Text style={commonStyles.optionDescription}>- post-construction cleaning</Text>
      <Text style={commonStyles.optionDescription}>- etc.</Text>
    </TouchableOpacity>
  </PageContainer>
);