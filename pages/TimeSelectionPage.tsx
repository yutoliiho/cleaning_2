import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NavigationButtons } from '../components/NavigationButtons';
import { PageContainer } from '../components/PageContainer';
import { BookingData } from '../types';

interface TimeSelectionPageProps {
  bookingData: BookingData;
  updateBookingData: (field: keyof BookingData, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const TimeSelectionPage: React.FC<TimeSelectionPageProps> = ({
  bookingData,
  updateBookingData,
  onNext,
  onBack
}) => {
  const hours = [
    { value: '8', display: '8 AM' },
    { value: '9', display: '9 AM' },
    { value: '10', display: '10 AM' },
    { value: '11', display: '11 AM' },
    { value: '12', display: '12 PM' },
    { value: '13', display: '1 PM' },
    { value: '14', display: '2 PM' },
    { value: '15', display: '3 PM' },
    { value: '16', display: '4 PM' },
    { value: '17', display: '5 PM' },
    { value: '18', display: '6 PM' }
  ];
  
  const minutes = [
    { value: '00', display: '00' },
    { value: '15', display: '15' },
    { value: '30', display: '30' },
    { value: '45', display: '45' }
  ];

  const selectedHourObj = hours.find(h => h.value === bookingData.selectedHour);
  const selectedMinuteObj = minutes.find(m => m.value === bookingData.selectedMinute);

  return (
    <PageContainer 
      title="Select Time"
      subtitle="Choose your preferred appointment time"
      scrollable
    >
      <View style={styles.timeDisplayContainer}>
        <Text style={styles.timeDisplayText}>
          {selectedHourObj && selectedMinuteObj 
            ? (() => {
                const hourNum = selectedHourObj.display.replace(' AM', '').replace(' PM', '');
                const ampm = selectedHourObj.display.includes('AM') ? 'AM' : 'PM';
                return `${hourNum}:${selectedMinuteObj.display} ${ampm}`;
              })()
            : '--:-- --'
          }
        </Text>
      </View>

      <View style={styles.timePickerContainer}>
        <View style={styles.timeColumn}>
          <Text style={styles.columnHeader}>Hour</Text>
          <ScrollView style={styles.timeColumnScroll} showsVerticalScrollIndicator={false}>
            {hours.map((hour) => (
              <TouchableOpacity
                key={hour.value}
                style={[
                  styles.timeOption,
                  bookingData.selectedHour === hour.value && styles.selectedTimeOption
                ]}
                onPress={() => updateBookingData('selectedHour', hour.value)}
              >
                <Text style={[
                  styles.timeOptionText,
                  bookingData.selectedHour === hour.value && styles.selectedTimeText
                ]}>
                  {hour.display}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.timeSeparator}>
          <Text style={styles.separatorText}>:</Text>
        </View>

        <View style={styles.timeColumn}>
          <Text style={styles.columnHeader}>Minute</Text>
          <ScrollView style={styles.timeColumnScroll} showsVerticalScrollIndicator={false}>
            {minutes.map((minute) => (
              <TouchableOpacity
                key={minute.value}
                style={[
                  styles.timeOption,
                  bookingData.selectedMinute === minute.value && styles.selectedTimeOption
                ]}
                onPress={() => updateBookingData('selectedMinute', minute.value)}
              >
                <Text style={[
                  styles.timeOptionText,
                  bookingData.selectedMinute === minute.value && styles.selectedTimeText
                ]}>
                  {minute.display}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      <NavigationButtons
        onBack={onBack}
        onNext={onNext}
        nextText="Complete"
        nextDisabled={!bookingData.selectedHour || !bookingData.selectedMinute}
      />
    </PageContainer>
  );
};

const timeStyles = StyleSheet.create({
  timeDisplayContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    alignItems: 'center',
  },
  timeDisplayText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#333',
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  timeColumn: {
    flex: 1,
    alignItems: 'center',
  },
  columnHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  timeColumnScroll: {
    maxHeight: 200,
  },
  timeOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedTimeOption: {
    backgroundColor: '#00D4AA',
    borderRadius: 12,
  },
  timeOptionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  selectedTimeText: {
    color: 'white',
  },
  timeSeparator: {
    paddingHorizontal: 10,
  },
  separatorText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});

const styles = { ...timeStyles };