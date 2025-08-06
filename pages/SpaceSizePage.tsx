import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PageContainer } from '../components/PageContainer';
import { commonStyles } from '../styles/commonStyles';
import { BookingData } from '../types';

interface SpaceSizePageProps {
  bookingData: BookingData;
  updateBookingData: (field: keyof BookingData, value: string) => void;
  onNext?: () => void;
  onBack?: () => void;
}

const Counter: React.FC<{
  label: string;
  value: string;
  onDecrease: () => void;
  onIncrease: () => void;
  canDecrease: boolean;
  canIncrease: boolean;
}> = ({ label, value, onDecrease, onIncrease, canDecrease, canIncrease }) => (
  <View style={styles.counterContainer}>
    <Text style={styles.counterLabel}>{label}</Text>
    <View style={styles.counterRow}>
      <TouchableOpacity
        style={[
          styles.counterButton,
          !canDecrease && styles.counterButtonDisabled
        ]}
        onPress={onDecrease}
        disabled={!canDecrease}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.counterButtonText,
          !canDecrease && styles.counterButtonTextDisabled
        ]}>−</Text>
      </TouchableOpacity>
      
      <View style={styles.counterValueContainer}>
        <Text style={styles.counterValue}>{value}</Text>
      </View>
      
      <TouchableOpacity
        style={[
          styles.counterButton,
          !canIncrease && styles.counterButtonDisabled
        ]}
        onPress={onIncrease}
        disabled={!canIncrease}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.counterButtonText,
          !canIncrease && styles.counterButtonTextDisabled
        ]}>+</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export const SpaceSizePage: React.FC<SpaceSizePageProps> = ({
  bookingData,
  updateBookingData,
  onNext,
  onBack
}) => {
  const bedroomCount = parseInt(bookingData.bedrooms) || 0;
  const bathroomCount = parseFloat(bookingData.bathrooms) || 0;

  const handleBedroomDecrease = () => {
    if (bedroomCount > 0) {
      updateBookingData('bedrooms', (bedroomCount - 1).toString());
    }
  };

  const handleBedroomIncrease = () => {
    if (bedroomCount < 10) {
      updateBookingData('bedrooms', (bedroomCount + 1).toString());
    }
  };

  const handleBathroomDecrease = () => {
    if (bathroomCount > 0) {
      const newValue = bathroomCount >= 1 ? bathroomCount - 0.5 : 0;
      updateBookingData('bathrooms', newValue.toString());
    }
  };

  const handleBathroomIncrease = () => {
    if (bathroomCount < 10) {
      const newValue = bathroomCount + 0.5;
      updateBookingData('bathrooms', newValue.toString());
    }
  };

  return (
    <PageContainer 
      title="Size of the space"
      subtitle="This helps us estimate cleaning time and cost"
      scrollable
    >
      <View style={styles.countersContainer}>
        <Counter
          label="Bedrooms"
          value={bookingData.bedrooms || '0'}
          onDecrease={handleBedroomDecrease}
          onIncrease={handleBedroomIncrease}
          canDecrease={bedroomCount > 0}
          canIncrease={bedroomCount < 10}
        />
        
        <Counter
          label="Bathrooms"
          value={bookingData.bathrooms || '0'}
          onDecrease={handleBathroomDecrease}
          onIncrease={handleBathroomIncrease}
          canDecrease={bathroomCount > 0}
          canIncrease={bathroomCount < 10}
        />
      </View>

      <View style={commonStyles.formGroup}>
        <Text style={commonStyles.formLabel}>Square Footage (approximate)</Text>
        <View style={commonStyles.dropdownContainer}>
          {['Under 1,200 sq ft', 'Under 3,000 sq ft', '3,000+ sq ft'].map((option) => (
            <TouchableOpacity
              key={option}
              style={[commonStyles.dropdownOption, bookingData.squareFootage === option && commonStyles.selectedOption]}
              onPress={() => updateBookingData('squareFootage', option)}
              activeOpacity={0.8}
            >
              <Text style={[commonStyles.dropdownText, bookingData.squareFootage === option && commonStyles.selectedText]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  countersContainer: {
    marginBottom: 32,
    gap: 24,
  },
  counterContainer: {
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
  counterLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  counterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#00D4AA',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00D4AA',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  counterButtonDisabled: {
    backgroundColor: '#E5E5E5',
    shadowOpacity: 0,
    elevation: 0,
  },
  counterButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 24,
  },
  counterButtonTextDisabled: {
    color: '#999',
  },
  counterValueContainer: {
    minWidth: 80,
    height: 48,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  counterValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
});
