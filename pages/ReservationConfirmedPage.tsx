import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PageContainer } from '../components/PageContainer';
import { BookingData, Cleaner } from '../types';

interface ReservationConfirmedPageProps {
  bookingData: BookingData;
  cleaners: Cleaner[];
  onViewCleanerProfile: () => void;
  onNext?: () => void;
}

export const ReservationConfirmedPage: React.FC<ReservationConfirmedPageProps> = ({
  bookingData,
  cleaners,
  onViewCleanerProfile,
  onNext
}) => {
  const selectedCleaner = cleaners.find(c => c.id === bookingData.selectedCleaner);
  
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

  return (
    <PageContainer 
      title="Reservation Confirmed!"
      subtitle="Your cleaning has been scheduled"
      scrollable
    >
      <View style={styles.container}>
        {/* Success Icon */}
        <View style={styles.successIcon}>
          <Text style={styles.successEmoji}>✅</Text>
        </View>

        {/* Booking Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Service:</Text>
            <Text style={styles.summaryValue}>{bookingData.cleaningType}</Text>
          </View>

          {/* For scheduled appointments, show separate date and time */}
          {bookingData.timing === 'scheduled' && bookingData.selectedDate && bookingData.selectedHour && bookingData.selectedMinute && (
            <>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Date:</Text>
                <Text style={styles.summaryValue}>
                  {formatDate(bookingData.selectedDate)}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Time:</Text>
                <Text style={styles.summaryValue}>
                  {formatTime(bookingData.selectedHour, bookingData.selectedMinute)}
                </Text>
              </View>
            </>
          )}

          {/* For ASAP appointments, show the selected time slot */}
          {bookingData.timing === 'asap' && bookingData.selectedTimeSlot && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Time:</Text>
              <Text style={styles.summaryValue}>
                {bookingData.selectedTimeSlot}
              </Text>
            </View>
          )}

          {/* Fallback if no time information is available */}
          {!((bookingData.timing === 'scheduled' && bookingData.selectedDate && bookingData.selectedHour && bookingData.selectedMinute) || 
              (bookingData.timing === 'asap' && bookingData.selectedTimeSlot)) && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Time:</Text>
              <Text style={styles.summaryValue}>Not selected</Text>
            </View>
          )}

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Location:</Text>
            <Text style={styles.summaryValue}>{bookingData.neighborhood}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Space:</Text>
            <Text style={styles.summaryValue}>
              {bookingData.bedrooms} bed, {bookingData.bathrooms} bath • {bookingData.squareFootage}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Duration:</Text>
            <Text style={styles.summaryValue}>{bookingData.bookingHours} hours</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Cost:</Text>
            <Text style={styles.summaryValue}>
              ${(parseInt(bookingData.bookingHours) * 35 * 1.08).toFixed(2)}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Payment:</Text>
            <Text style={[styles.summaryValue, styles.paidStatus]}>✓ Paid</Text>
          </View>
        </View>

        {/* Assigned Cleaner Card */}
        {selectedCleaner && (
          <View style={styles.cleanerCard}>
            <Text style={styles.cleanerCardTitle}>Your Assigned Cleaner</Text>
            
            <TouchableOpacity 
              style={styles.cleanerProfile}
              onPress={onViewCleanerProfile}
              activeOpacity={0.8}
            >
              <View style={styles.cleanerMainInfo}>
                <Image 
                  source={selectedCleaner.profilePic}
                  style={styles.cleanerProfilePic}
                  resizeMode="cover"
                />
                
                <View style={styles.cleanerDetails}>
                  <View style={styles.cleanerNameRow}>
                    <Text style={styles.cleanerName}>{selectedCleaner.name}</Text>
                    {selectedCleaner.verified && (
                      <View style={styles.verifiedBadge}>
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
              
              <View style={styles.viewProfileButton}>
                <Text style={styles.viewProfileText}>View Profile →</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Next Steps */}
        <View style={styles.nextStepsCard}>
          <Text style={styles.nextStepsTitle}>What's Next?</Text>
          <View style={styles.nextStepsList}>
            <View style={styles.nextStepItem}>
              <Text style={styles.nextStepNumber}>1</Text>
              <Text style={styles.nextStepText}>You'll receive a confirmation text/email shortly</Text>
            </View>
            <View style={styles.nextStepItem}>
              <Text style={styles.nextStepNumber}>2</Text>
              <Text style={styles.nextStepText}>Your cleaner will contact you 30 minutes before arrival</Text>
            </View>
            <View style={styles.nextStepItem}>
              <Text style={styles.nextStepNumber}>3</Text>
              <Text style={styles.nextStepText}>Enjoy your sparkling clean space!</Text>
            </View>
          </View>
        </View>
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 24,
    paddingBottom: 40,
  },
  successIcon: {
    alignItems: 'center',
    marginBottom: 16,
  },
  successEmoji: {
    fontSize: 64,
  },
  summaryCard: {
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
  summaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    flex: 1,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
  paidStatus: {
    color: '#00D4AA', // Green color for paid status
  },
  cleanerCard: {
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
  cleanerCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  cleanerProfile: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  cleanerMainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cleanerProfilePic: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  cleanerDetails: {
    flex: 1,
  },
  cleanerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cleanerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginRight: 8,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00D4AA',
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  verifiedCheckmark: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 2,
  },
  verifiedText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cleanerRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cleanerRating: {
    fontSize: 14,
    color: '#00D4AA',
    marginRight: 4,
  },
  cleanerReviews: {
    fontSize: 12,
    color: '#666',
  },
  viewProfileButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  viewProfileText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00D4AA',
  },
  nextStepsCard: {
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
  nextStepsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  nextStepsList: {
    gap: 16,
  },
  nextStepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  nextStepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#00D4AA',
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
  },
  nextStepText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    paddingTop: 2,
  },
}); 