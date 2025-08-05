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
  onBack?: () => void;
}

export const CleanerProfileDetailPage: React.FC<CleanerProfileDetailPageProps> = ({
  bookingData,
  cleaners,
  onSelectTimeSlot,
  onBack
}) => {
  const selectedCleaner = cleaners.find(c => c.id === bookingData.selectedCleaner);
  
  if (!selectedCleaner) {
    return null;
  }

  return (
    <PageContainer 
      title="Cleaner Profile"
      subtitle="Detailed information and reviews"
      scrollable
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
});
