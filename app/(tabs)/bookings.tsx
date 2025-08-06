import { useBookingFlow } from '@/hooks/useBookingFlow';
import { ConfirmedBooking } from '@/types';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getCleaners } from '../../data/cleaners';
import { BookingDetailPage } from '../../pages/BookingDetailPage';

export default function BookingsScreen() {
  const { confirmedBookings, addSampleBookings, setBookingDetailActive } = useBookingFlow();
  const [selectedBooking, setSelectedBooking] = useState<ConfirmedBooking | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (hour: string, minute: string) => {
    if (!hour || !minute) return '';
    const hourNum = parseInt(hour);
    const minuteNum = parseInt(minute);
    const hour12 = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minuteNum.toString().padStart(2, '0')} ${ampm}`;
  };

  const formatBookingTime = (booking: ConfirmedBooking) => {
    const { bookingData } = booking;
    
    if (bookingData.timing === 'scheduled' && bookingData.selectedDate && bookingData.selectedHour && bookingData.selectedMinute) {
      return `${formatDate(bookingData.selectedDate)} at ${formatTime(bookingData.selectedHour, bookingData.selectedMinute)}`;
    } else if (bookingData.timing === 'asap' && bookingData.selectedTimeSlot) {
      return `ASAP - ${bookingData.selectedTimeSlot}`;
    }
    return 'Time TBD';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#00D4AA';
      case 'pending': return '#FFA500';
      case 'completed': return '#4CAF50';
      case 'cancelled': return '#FF6B6B';
      default: return '#999';
    }
  };

  const handleCleanerPress = (booking: ConfirmedBooking) => {
    setSelectedBooking(booking);
    setBookingDetailActive(true);
  };

  const handleBackFromDetail = () => {
    setSelectedBooking(null);
    setBookingDetailActive(false);
  };

  // If a booking is selected, show the detail page
  if (selectedBooking) {
    // Get cleaners data to pass to the detail page
    const cleaners = getCleaners(selectedBooking.bookingData.timing, selectedBooking.bookingData);
    
    return (
      <BookingDetailPage
        bookingData={selectedBooking.bookingData}
        cleaners={cleaners}
        onBack={handleBackFromDetail}
      />
    );
  }

  const renderBookingCard = (booking: ConfirmedBooking) => (
    <TouchableOpacity key={booking.id} style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <Text style={styles.bookingTitle}>{booking.bookingData.cleaningType}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
          <Text style={styles.statusText}>{booking.status.toUpperCase()}</Text>
        </View>
      </View>
      
      {/* Cleaner Profile Section */}
      <TouchableOpacity 
        style={styles.cleanerSection}
        onPress={() => handleCleanerPress(booking)}
        activeOpacity={0.7}
      >
        <Image 
          source={booking.cleaner.profilePic}
          style={styles.cleanerProfileImage}
          resizeMode="cover"
        />
        <View style={styles.cleanerInfo}>
          <View style={styles.cleanerNameRow}>
            <Text style={styles.cleanerName}>{booking.cleaner.name}</Text>
            {booking.cleaner.verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓</Text>
              </View>
            )}
          </View>
          <View style={styles.cleanerRatingRow}>
            <Text style={styles.cleanerRating}>
              {'⭐'.repeat(Math.floor(booking.cleaner.rating))} {booking.cleaner.rating}
            </Text>
            <Text style={styles.bookingHistory}>
              {booking.cleaner.bookingHistory?.length || 0} previous bookings
            </Text>
          </View>
        </View>
        <Text style={styles.viewProfileArrow}>→</Text>
      </TouchableOpacity>
      
      <View style={styles.bookingDetails}>
        <Text style={styles.bookingTime}>📅 {formatBookingTime(booking)}</Text>
        <Text style={styles.bookingLocation}>📍 {booking.bookingData.neighborhood}</Text>
        {booking.bookingData.homeAddress && (
          <Text style={styles.bookingAddress}>{booking.bookingData.homeAddress}</Text>
        )}
        <Text style={styles.bookingHours}>⏱️ {booking.bookingData.bookingHours} hours</Text>
      </View>
      
      <View style={styles.bookingFooter}>
        <Text style={styles.bookingId}>Booking #{booking.id.slice(-6)}</Text>
        <Text style={styles.confirmedDate}>
          Confirmed {new Date(booking.confirmedAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <Text style={styles.headerSubtitle}>
          {confirmedBookings.length} {confirmedBookings.length === 1 ? 'booking' : 'bookings'}
        </Text>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {confirmedBookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🧹</Text>
            <Text style={styles.emptyStateTitle}>No bookings yet</Text>
            <Text style={styles.emptyStateSubtitle}>
              Your confirmed cleaning appointments will appear here
            </Text>
            
            {/* Development button to add sample bookings */}
            <TouchableOpacity 
              style={styles.sampleButton}
              onPress={addSampleBookings}
            >
              <Text style={styles.sampleButtonText}>Add Sample Bookings (Dev)</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.bookingsList}>
            {confirmedBookings
              .sort((a, b) => new Date(b.confirmedAt).getTime() - new Date(a.confirmedAt).getTime())
              .map(renderBookingCard)}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  bookingsList: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 100,
  },
  bookingCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  cleanerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cleanerProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  cleanerInfo: {
    flex: 1,
  },
  cleanerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  cleanerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  verifiedBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  verifiedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  cleanerRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cleanerRating: {
    fontSize: 14,
    color: '#555',
    marginRight: 8,
  },
  bookingHistory: {
    fontSize: 14,
    color: '#999',
  },
  viewProfileArrow: {
    fontSize: 24,
    color: '#999',
    marginLeft: 10,
  },
  bookingDetails: {
    marginBottom: 16,
  },
  bookingTime: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  bookingLocation: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  bookingAddress: {
    fontSize: 14,
    color: '#777',
    marginLeft: 16,
  },
  bookingHours: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  bookingId: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  confirmedDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  sampleButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  sampleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
