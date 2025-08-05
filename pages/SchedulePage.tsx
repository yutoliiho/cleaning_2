// pages/SchedulePage.tsx
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NavigationButtons } from '../components/NavigationButtons';
import { PageContainer } from '../components/PageContainer';
import { BookingData } from '../types';

const { width } = Dimensions.get('window');

interface SchedulePageProps {
  bookingData: BookingData;
  updateBookingData: (field: keyof BookingData, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const SchedulePage: React.FC<SchedulePageProps> = ({
  bookingData,
  updateBookingData,
  onNext,
  onBack
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

  const calendarWeeks = generateCalendarWeeks();
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <PageContainer 
      title="Select Date"
      subtitle={currentMonth}
      scrollable
    >
      <View style={styles.calendarContainer}>
        <View style={styles.calendarHeader}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <Text key={day} style={styles.calendarHeaderText}>{day}</Text>
          ))}
        </View>
        
        {calendarWeeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.calendarWeek}>
            {week.map((day) => (
              <TouchableOpacity
                key={day.date}
                style={[
                  styles.calendarDayCell,
                  bookingData.selectedDate === day.date && styles.selectedDayCell,
                  day.isPast && styles.pastDayCell
                ]}
                onPress={() => !day.isPast && updateBookingData('selectedDate', day.date)}
                disabled={day.isPast}
              >
                <Text style={[
                  styles.calendarDayNumber,
                  bookingData.selectedDate === day.date && styles.selectedDayText,
                  day.isPast && styles.pastDayText,
                  day.isToday && styles.todayText
                ]}>
                  {day.day}
                </Text>
                <Text style={[
                  styles.calendarMonthText,
                  bookingData.selectedDate === day.date && styles.selectedDayText,
                  day.isPast && styles.pastDayText
                ]}>
                  {day.month}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      <NavigationButtons
        onBack={onBack}
        onNext={onNext}
        nextDisabled={!bookingData.selectedDate}
      />
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
    marginHorizontal: 4,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  calendarHeaderText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  calendarWeek: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  calendarDayCell: {
    width: (width - 88) / 7,
    height: (width - 88) / 7,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
});
