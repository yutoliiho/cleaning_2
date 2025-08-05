import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PageContainer } from '../components/PageContainer';
import { commonStyles } from '../styles/commonStyles';
import { BookingData, Cleaner } from '../types';

interface ReservationPendingPageProps {
  bookingData: BookingData;
  updateBookingData: (field: keyof BookingData, value: string) => void;
  cleaners: Cleaner[];
  onConfirm?: () => void;
  onBack?: () => void;
}

export const ReservationPendingPage: React.FC<ReservationPendingPageProps> = ({
  bookingData,
  updateBookingData,
  cleaners,
  onConfirm,
  onBack
}) => {
  const selectedCleaner = cleaners.find(c => c.id === bookingData.selectedCleaner);
  
  return (
    <PageContainer 
      title="Reservation Pending"
      subtitle="We're waiting for cleaner confirmation"
      scrollable
    >
      <View style={styles.pendingContainer}>
        <Text style={styles.pendingIcon}>⏳</Text>
        <Text style={styles.pendingMessage}>
          We are waiting for {selectedCleaner?.name} to confirm your appointment for {bookingData.selectedTimeSlot}.
        </Text>
      </View>

      <View style={styles.bookingSummary}>
        <Text style={styles.summaryTitle}>Booking Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Cleaner:</Text>
          <Text style={styles.summaryValue}>{selectedCleaner?.name}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Time:</Text>
          <Text style={styles.summaryValue}>{bookingData.selectedTimeSlot}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Duration:</Text>
          <Text style={styles.summaryValue}>{bookingData.bookingHours} hours</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Service:</Text>
          <Text style={styles.summaryValue}>{bookingData.cleaningType} Clean</Text>
        </View>
      </View>

      <View style={styles.substituteSection}>
        <Text style={styles.substituteQuestion}>
          If {selectedCleaner?.name} is not available, are you okay with us matching you with another verified cleaner during the same time slot?
        </Text>
        
        <TouchableOpacity 
          style={[commonStyles.optionCard, bookingData.allowSubstitute === 'true' && commonStyles.selected]}
          onPress={() => updateBookingData('allowSubstitute', 'true')}
        >
          <Text style={commonStyles.optionTitle}>Yes, find me another cleaner</Text>
          <Text style={commonStyles.optionDescription}>We'll match you with another highly-rated, verified cleaner</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[commonStyles.optionCard, bookingData.allowSubstitute === 'false' && commonStyles.selected]}
          onPress={() => updateBookingData('allowSubstitute', 'false')}
        >
          <Text style={commonStyles.optionTitle}>No, I only want this cleaner</Text>
          <Text style={commonStyles.optionDescription}>We'll wait for {selectedCleaner?.name} to confirm or reschedule</Text>
        </TouchableOpacity>
      </View>

    </PageContainer>
  );
};

const pendingStyles = StyleSheet.create({
  pendingContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    alignItems: 'center',
  },
  pendingIcon: {
    fontSize: 60,
    color: '#00D4AA',
    marginBottom: 16,
  },
  pendingMessage: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
  },
  bookingSummary: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  substituteSection: {
    marginTop: 20,
  },
  substituteQuestion: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

// Merge styles for ReservationPendingPage
const styles = { ...pendingStyles };