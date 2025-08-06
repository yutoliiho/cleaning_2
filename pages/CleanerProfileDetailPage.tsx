// pages/CleanerProfileDetailPage.tsx
import { PageContainer } from '@/components/PageContainer';
import { BookingData, Cleaner } from '@/types';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { commonStyles } from '../styles/commonStyles';

interface CleanerProfileDetailPageProps {
  bookingData: BookingData;
  cleaners: Cleaner[];
  onSelectTimeSlot?: (cleanerId: string, timeSlot: string) => void;
  onBookAgain?: () => void;
}

export const CleanerProfileDetailPage: React.FC<CleanerProfileDetailPageProps> = ({
  bookingData,
  cleaners,
  onSelectTimeSlot,
  onBookAgain
}) => {
  const selectedCleaner = cleaners.find(c => c.id === bookingData.selectedCleaner);
  
  if (!selectedCleaner) {
    return null;
  }

  // Check if this is a confirmed appointment (coming from confirmation page)
  const isConfirmedBooking = (bookingData.timing === 'scheduled' && 
    bookingData.selectedDate && 
    bookingData.selectedHour && 
    bookingData.selectedMinute) ||
    (bookingData.timing === 'asap' && 
    bookingData.allowSubstitute === 'true' &&
    bookingData.selectedCleaner &&
    bookingData.selectedTimeSlot);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (hour: string, minute: string) => {
    const hourNum = parseInt(hour);
    const minuteNum = parseInt(minute);
    const hour12 = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minuteNum.toString().padStart(2, '0')} ${ampm}`;
  };

  const formatBookingHistoryDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const bookingHistory = selectedCleaner.bookingHistory || [];
  const hasBookingHistory = bookingHistory.length > 0;

  return (
    <PageContainer 
      title="Cleaner Profile"
      subtitle="Detailed information and reviews"
      scrollable={true}
    >
      <View style={styles.cleanerMainInfo}>
        <View style={styles.cleanerProfile}>
          <Image 
            source={selectedCleaner.profilePic}
            style={styles.cleanerProfilePic}
            resizeMode="cover"
          />
        </View>
        <View style={styles.cleanerDetails}>
          <View style={styles.cleanerNameRow}>
            <Text style={styles.cleanerName}>{selectedCleaner.name}</Text>
            {selectedCleaner.verified && (
              <View style={styles.verifiedBadgeInline}>
                <Text style={styles.verifiedCheckmark}>✓</Text>
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>
          <View style={styles.cleanerRatingContainer}>
            <Text style={styles.cleanerRating}>
              {'⭐'.repeat(Math.floor(selectedCleaner.rating))} {selectedCleaner.rating}
            </Text>
            <Text style={styles.cleanerReviews}>({selectedCleaner.reviews} reviews)</Text>
          </View>
        </View>
      </View>

      <View style={commonStyles.formGroup}>
        <Text style={commonStyles.formLabel}>About</Text>
        <Text style={styles.cleanerDescription}>
          Experienced cleaner with {selectedCleaner.reviews} completed bookings. Known for attention to detail and reliability.
        </Text>
      </View>

      {/* Booking History Section */}
      {hasBookingHistory && (
        <View style={commonStyles.formGroup}>
          <Text style={commonStyles.formLabel}>
            Your History with {selectedCleaner.name} ({bookingHistory.length} bookings)
          </Text>
          <View style={styles.bookingHistoryContainer}>
            {bookingHistory.map((booking, index) => (
              <View key={booking.bookingId} style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyDate}>
                    {formatBookingHistoryDate(booking.date)}
                  </Text>
                  <View style={styles.historyRating}>
                    <Text style={styles.historyRatingText}>
                      {'⭐'.repeat(booking.rating || 0)} {booking.rating || 'N/A'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.historyService}>{booking.cleaningType}</Text>
                {booking.review && (
                  <Text style={styles.historyReview}>"{booking.review}"</Text>
                )}
              </View>
            ))}
          </View>
          
          {/* Book Again Button */}
          <TouchableOpacity 
            style={styles.bookAgainButton}
            onPress={onBookAgain}
            activeOpacity={0.8}
          >
            <Text style={styles.bookAgainButtonText}>
              📅 Book {selectedCleaner.name} Again
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Show confirmed booking details for confirmed appointments */}
      {isConfirmedBooking && (
        <View style={commonStyles.formGroup}>
          <Text style={commonStyles.formLabel}>Your Confirmed Appointment</Text>
          <View style={styles.confirmedBookingCard}>
            {/* For scheduled appointments, show formatted date and time */}
            {bookingData.timing === 'scheduled' && bookingData.selectedDate && bookingData.selectedHour && bookingData.selectedMinute && (
              <>
                <View style={styles.confirmedBookingRow}>
                  <Text style={styles.confirmedLabel}>Date:</Text>
                  <Text style={styles.confirmedValue}>
                    {formatDate(bookingData.selectedDate)}
                  </Text>
                </View>
                <View style={styles.confirmedBookingRow}>
                  <Text style={styles.confirmedLabel}>Time:</Text>
                  <Text style={styles.confirmedValue}>
                    {formatTime(bookingData.selectedHour, bookingData.selectedMinute)}
                  </Text>
                </View>
              </>
            )}
            
            {/* For ASAP appointments, show the selected time slot */}
            {bookingData.timing === 'asap' && bookingData.selectedTimeSlot && (
              <View style={styles.confirmedBookingRow}>
                <Text style={styles.confirmedLabel}>Time:</Text>
                <Text style={styles.confirmedValue}>
                  {bookingData.selectedTimeSlot}
                </Text>
              </View>
            )}
            
            <View style={styles.confirmedBookingRow}>
              <Text style={styles.confirmedLabel}>Service:</Text>
              <Text style={styles.confirmedValue}>{bookingData.cleaningType}</Text>
            </View>
            <View style={styles.confirmedBookingRow}>
              <Text style={styles.confirmedLabel}>Location:</Text>
              <Text style={styles.confirmedValue}>{bookingData.neighborhood}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Show available time slots only for ASAP bookings */}
      {!isConfirmedBooking && (
        <View style={commonStyles.formGroup}>
          <Text style={commonStyles.formLabel}>Available Times</Text>
          <View style={styles.slotsWrapper}>
            {selectedCleaner.availableSlots.map((slot, index) => {
              const parts = slot.split(' ');
              const date = parts[0];
              const time = parts.slice(1).join(' ');
              
              return (
                <TouchableOpacity 
                  key={index} 
                  style={styles.timeSlotChip}
                  onPress={() => onSelectTimeSlot?.(selectedCleaner.id, slot)}
                >
                  <Text style={styles.timeSlotDate}>{date}</Text>
                  <Text style={styles.timeSlotTime}>{time}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  cleanerMainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cleanerProfile: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#eee',
    marginRight: 15,
  },
  cleanerProfilePic: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  cleanerDetails: {
    flex: 1,
  },
  cleanerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cleanerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  verifiedBadgeInline: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00D4AA',
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginLeft: 8,
  },
  verifiedCheckmark: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  verifiedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cleanerRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cleanerRating: {
    fontSize: 16,
    color: '#00D4AA',
    marginRight: 4,
  },
  cleanerReviews: {
    fontSize: 14,
    color: '#666',
  },
  cleanerDescription: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 20,
  },
  slotsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlotChip: {
    backgroundColor: '#00D4AA',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  timeSlotDate: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  timeSlotTime: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  confirmedBookingCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  confirmedBookingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 2,
  },
  confirmedLabel: {
    fontSize: 15,
    color: '#666',
    fontWeight: '600',
  },
  confirmedValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '700',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  bookingHistoryContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  historyCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyDate: {
    fontSize: 14,
    color: '#555',
    fontWeight: '600',
  },
  historyRating: {
    backgroundColor: '#00D4AA',
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  historyRatingText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  historyService: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginBottom: 8,
  },
  historyReview: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  bookAgainButton: {
    backgroundColor: '#00D4AA',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  bookAgainButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
