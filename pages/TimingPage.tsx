import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PageContainer } from '../components/PageContainer';
import { BookingData } from '../types';

const { width } = Dimensions.get('window');

interface TimingPageProps {
  bookingData: BookingData;
  updateBookingData: (field: keyof BookingData, value: string) => void;
  onNext?: () => void;
  onBack?: () => void;
  onSkipToCleaners?: () => void;
}

export const TimingPage: React.FC<TimingPageProps> = ({
  bookingData,
  updateBookingData,
  onNext,
  onBack,
  onSkipToCleaners
}) => {
  const generateCalendarWeeks = () => {
    const today = new Date();
    const weeks = [];
    
    for (let week = 0; week < 4; week++) {
      const weekDays = [];
      for (let day = 0; day < 7; day++) {
        const date = new Date(today);
        date.setDate(today.getDate() + (week * 7) + day);
        
        weekDays.push({
          date: date.toISOString().split('T')[0],
          day: date.getDate(),
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
          isToday: date.toDateString() === today.toDateString(),
          isPast: date < today
        });
      }
      weeks.push(weekDays);
    }
    return weeks;
  };

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
    { value: '0', display: '00' },
    { value: '15', display: '15' },
    { value: '30', display: '30' },
    { value: '45', display: '45' }
  ];

  const calendarWeeks = generateCalendarWeeks();
  const isScheduledComplete = bookingData.timing === 'scheduled' && 
    bookingData.selectedDate && bookingData.selectedHour && bookingData.selectedMinute;

  return (
    <PageContainer 
      title="When would you like your cleaning?"
      scrollable
    >
      <View style={styles.timingOptions}>
        <TouchableOpacity
          style={[styles.timingOption, bookingData.timing === 'asap' && styles.selectedOption]}
          onPress={() => updateBookingData('timing', 'asap')}
        >
          <Text style={[styles.timingText, bookingData.timing === 'asap' && styles.selectedText]}>
            ASAP (Today)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.timingOption, bookingData.timing === 'scheduled' && styles.selectedOption]}
          onPress={() => updateBookingData('timing', 'scheduled')}
        >
          <Text style={[styles.timingText, bookingData.timing === 'scheduled' && styles.selectedText]}>
            Schedule for Later
          </Text>
        </TouchableOpacity>
      </View>

      {bookingData.timing === 'scheduled' && (
        <>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <View style={styles.calendarContainer}>
            {calendarWeeks.map((week, weekIndex) => (
              <View key={weekIndex} style={styles.calendarWeek}>
                {week.map((day) => (
                  <TouchableOpacity
                    key={day.date}
                    style={[
                      styles.calendarDay,
                      day.isPast && styles.pastDay,
                      bookingData.selectedDate === day.date && styles.selectedDay
                    ]}
                    onPress={() => !day.isPast && updateBookingData('selectedDate', day.date)}
                    disabled={day.isPast}
                  >
                    <Text style={[
                      styles.dayWeekday,
                      day.isPast && styles.pastText,
                      bookingData.selectedDate === day.date && styles.selectedDayText
                    ]}>
                      {day.weekday}
                    </Text>
                    <Text style={[
                      styles.dayNumber,
                      day.isPast && styles.pastText,
                      bookingData.selectedDate === day.date && styles.selectedDayText
                    ]}>
                      {day.day}
                    </Text>
                    <Text style={[
                      styles.dayMonth,
                      day.isPast && styles.pastText,
                      bookingData.selectedDate === day.date && styles.selectedDayText
                    ]}>
                      {day.month}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Select Time</Text>
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
        </>
      )}
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  timingOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  timingOption: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#eee',
  },
  timingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  selectedOption: {
    borderColor: '#00D4AA',
    borderWidth: 2,
  },
  selectedText: {
    color: '#00D4AA',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 16,
    marginTop: 32,
  },
  calendarContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  calendarHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    flex: 1,
  },
  calendarWeek: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  calendarDay: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 2,
  },
  calendarDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 2,
  },
  selectedDayCell: {
    backgroundColor: '#00D4AA',
  },
  pastDayCell: {
    opacity: 0.5,
  },
  calendarDayNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  calendarMonthText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  selectedDayText: {
    color: 'white',
  },
  pastDayText: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  todayText: {
    fontWeight: 'bold',
  },
  timeDisplayContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
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
    marginBottom: 16,
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
    justifyContent: 'center',
  },
  separatorText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  dayWeekday: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  dayMonth: {
    fontSize: 14,
    color: '#666',
  },
  pastDay: {
    opacity: 0.5,
  },
  pastText: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  selectedDay: {
    backgroundColor: '#00D4AA',
  },
});