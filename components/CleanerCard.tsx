import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BookingData, Cleaner } from '../types';

interface CleanerCardProps {
  cleaner: Cleaner;
  bookingData: BookingData;
  isSelected: boolean;
  onSelectCleaner: (cleanerId: string) => void;
  onSelectTimeSlot: (cleanerId: string, timeSlot: string) => void;
}

export const CleanerCard: React.FC<CleanerCardProps> = ({
  cleaner,
  bookingData,
  isSelected,
  onSelectCleaner,
  onSelectTimeSlot
}) => (
  <TouchableOpacity 
    style={[styles.cleanerCard, isSelected && styles.selectedCleanerCard]}
    onPress={() => onSelectCleaner(cleaner.id)}
  >
    <View style={styles.cleanerMainInfo}>
      <View style={styles.cleanerProfile}>
        <Image 
          source={cleaner.profilePic}
          style={styles.cleanerProfilePic}
          resizeMode="cover"
        />
      </View>

      <View style={styles.cleanerDetails}>
        <View style={styles.cleanerNameRow}>
          <Text style={styles.cleanerName}>{cleaner.name}</Text>
          {cleaner.verified && (
            <View style={styles.verifiedBadgeInline}>
              <Text style={styles.verifiedCheckmark}>✓</Text>
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}
        </View>
        
        <View style={styles.cleanerRatingContainer}>
          <Text style={styles.cleanerRating}>
            {'⭐'.repeat(Math.floor(cleaner.rating))} {cleaner.rating}
          </Text>
          <Text style={styles.cleanerReviews}>({cleaner.reviews} reviews)</Text>
        </View>
      </View>
    </View>

    <View style={styles.cleanerAvailabilityContainer}>
      <View style={styles.slotsWrapper}>
        {cleaner.availableSlots.map((slot, index) => {
          const parts = slot.split(' ');
          const date = parts[0];
          const time = parts.slice(1).join(' ');
          
          return (
            <TouchableOpacity 
              key={index} 
              style={styles.timeSlotChip}
              onPress={(e) => {
                e.stopPropagation();
                onSelectTimeSlot(cleaner.id, slot);
              }}
            >
              <Text style={styles.timeSlotDate}>{date}</Text>
              <Text style={styles.timeSlotTime}>{time}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  cleanerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  selectedCleanerCard: {
    borderColor: '#00D4AA',
    borderWidth: 2,
  },
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
  cleanerAvailabilityContainer: {
    flexDirection: 'column',
    gap: 8,
    marginTop: 8,
    alignItems: 'flex-start',
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