// pages/CleanersPage.tsx
import React from 'react';
import { View } from 'react-native';
import { CleanerCard } from '../components/CleanerCard';
import { PageContainer } from '../components/PageContainer';
import { BookingData, Cleaner } from '../types';

interface CleanersPageProps {
  bookingData: BookingData;
  cleaners: Cleaner[];
  onSelectCleaner?: (cleanerId: string) => void;
  onSelectTimeSlot?: (cleanerId: string, timeSlot: string) => void;
  onBack?: () => void;
  onBookNow?: () => void;
}

export const CleanersPage: React.FC<CleanersPageProps> = ({
  bookingData,
  cleaners,
  onSelectCleaner = () => {},
  onSelectTimeSlot = () => {},
  onBack,
  onBookNow
}) => (
  <PageContainer 
    title="Available Cleaners"
    subtitle={bookingData.timing === 'asap' ? 'Ready to clean today' : 'Available for your selected time'}
    scrollable
  >
    <View style={{ gap: 15 }}>
      {cleaners.map((cleaner) => (
        <CleanerCard
          key={cleaner.id}
          cleaner={cleaner}
          bookingData={bookingData}
          isSelected={bookingData.selectedCleaner === cleaner.id}
          onSelectCleaner={onSelectCleaner}
          onSelectTimeSlot={onSelectTimeSlot}
        />
      ))}
    </View>
  </PageContainer>
);

