import React, { useEffect, useRef } from 'react';
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
  const scrollViewRef = useRef<ScrollView>(null);
  const dateTimeRef = useRef<View>(null);

  // Auto-scroll to date & time section when "Schedule for Later" is selected
  useEffect(() => {
    if (bookingData.timing === 'scheduled') {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: 350, animated: true });
      }, 100);
    }
  }, [bookingData.timing]);

  const generateCalendarWeeks = () => {
    const today = new Date();
    const weeks = [];
    
    for (let week = 0; week < 3; week++) {
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

  // Generate time slots in 30-minute intervals
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time24 = `${hour}:${minute.toString().padStart(2, '0')}`;
        const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayTime = `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
        
        slots.push({
          value: time24,
          display: displayTime,
          hour: hour.toString(),
          minute: minute.toString()
        });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();
  const calendarWeeks = generateCalendarWeeks();
  const isScheduledComplete = bookingData.timing === 'scheduled' && 
    bookingData.selectedDate && bookingData.selectedHour && bookingData.selectedMinute;

  const handleTimeSlotSelect = (slot: any) => {
    updateBookingData('selectedHour', slot.hour);
    updateBookingData('selectedMinute', slot.minute);
  };

  const getSelectedTimeDisplay = () => {
    if (bookingData.selectedHour && bookingData.selectedMinute) {
      const hour = parseInt(bookingData.selectedHour);
      const minute = parseInt(bookingData.selectedMinute);
      const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
    }
    return null;
  };

  return (
    <PageContainer 
      title="When would you like your cleaning?"
      subtitle="Choose the timing that works best for you"
      scrollable={true}
      scrollViewRef={scrollViewRef}
    >
      <View style={styles.contentWrapper}>
        <View style={styles.timingOptions}>
          <TouchableOpacity
            style={[styles.timingCard, bookingData.timing === 'asap' && styles.selectedTimingCard]}
            onPress={() => updateBookingData('timing', 'asap')}
            activeOpacity={0.8}
          >
            <View style={styles.timingCardIcon}>
              <Text style={styles.timingCardEmoji}>⚡</Text>
            </View>
            <Text style={[styles.timingCardTitle, bookingData.timing === 'asap' && styles.selectedTimingText]}>
              ASAP
            </Text>
            <Text style={[styles.timingCardDescription, bookingData.timing === 'asap' && styles.selectedTimingDescription]}>
              Get cleaned as soon as today
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.timingCard, bookingData.timing === 'scheduled' && styles.selectedTimingCard]}
            onPress={() => updateBookingData('timing', 'scheduled')}
            activeOpacity={0.8}
          >
            <View style={styles.timingCardIcon}>
              <Text style={styles.timingCardEmoji}>📅</Text>
            </View>
            <Text style={[styles.timingCardTitle, bookingData.timing === 'scheduled' && styles.selectedTimingText]}>
              Schedule for Later
            </Text>
            <Text style={[styles.timingCardDescription, bookingData.timing === 'scheduled' && styles.selectedTimingDescription]}>
              Pick a specific date and time
            </Text>
          </TouchableOpacity>
        </View>

        {bookingData.timing === 'scheduled' && (
          <View ref={dateTimeRef} style={styles.dateTimeSection}>
            <View style={styles.sectionContainer}>
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
                        activeOpacity={0.7}
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
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Select Time</Text>
              {getSelectedTimeDisplay() && (
                <View style={styles.selectedTimeDisplay}>
                  <Text style={styles.selectedTimeText}>🕐 {getSelectedTimeDisplay()}</Text>
                </View>
              )}
              <View style={styles.timeGridContainer}>
                <View style={styles.timeGrid}>
                  {timeSlots.map((slot) => {
                    const isSelected = bookingData.selectedHour === slot.hour && bookingData.selectedMinute === slot.minute;
                    return (
                      <TouchableOpacity
                        key={slot.value}
                        style={[
                          styles.timeSlot,
                          isSelected && styles.selectedTimeSlot
                        ]}
                        onPress={() => handleTimeSlotSelect(slot)}
                        activeOpacity={0.7}
                      >
                        <Text style={[
                          styles.timeSlotText,
                          isSelected && styles.selectedTimeSlotText
                        ]}>
                          {slot.display}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  contentWrapper: {
    flex: 1,
    paddingBottom: 120,
  },
  timingOptions: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  timingCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedTimingCard: {
    backgroundColor: '#00D4AA',
    borderColor: '#00D4AA',
  },
  timingCardIcon: {
    marginBottom: 12,
  },
  timingCardEmoji: {
    fontSize: 32,
  },
  timingCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  selectedTimingText: {
    color: 'white',
  },
  timingCardDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  selectedTimingDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  dateTimeSection: {
    gap: 24,
  },
  sectionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  calendarContainer: {
    gap: 8,
  },
  calendarWeek: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 4,
  },
  calendarDay: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  selectedDay: {
    backgroundColor: '#00D4AA',
    borderColor: '#00D4AA',
  },
  pastDay: {
    opacity: 0.4,
    backgroundColor: '#F1F3F4',
  },
  dayWeekday: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 2,
  },
  dayMonth: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  selectedDayText: {
    color: 'white',
  },
  pastText: {
    color: '#999',
  },
  selectedTimeDisplay: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#00D4AA',
    alignItems: 'center',
  },
  selectedTimeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#00D4AA',
  },
  timeGridContainer: {
    // Removed maxHeight: 300 to allow full display of all time slots
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  timeSlot: {
    width: '30%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    marginBottom: 8,
  },
  selectedTimeSlot: {
    backgroundColor: '#00D4AA',
    borderColor: '#00D4AA',
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  selectedTimeSlotText: {
    color: 'white',
  },
});