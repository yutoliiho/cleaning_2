import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { PageContainer } from '../components/PageContainer';
import { commonStyles } from '../styles/commonStyles';
import { BookingData, Cleaner } from '../types';

interface PaymentPageProps {
  bookingData: BookingData;
  updateBookingData: (field: keyof BookingData, value: string) => void;
  cleaners: Cleaner[];
  onNext?: () => void;
  onBack?: () => void;
  onPaymentProcess?: (processPayment: () => Promise<boolean>) => void;
  isProcessing?: boolean;
  canPay?: boolean;
}

export const PaymentPage: React.FC<PaymentPageProps> = ({
  bookingData,
  updateBookingData,
  cleaners,
  onNext,
  onBack,
  onPaymentProcess,
  isProcessing = false,
  canPay = false
}) => {
  const selectedCleaner = cleaners.find(c => c.id === bookingData.selectedCleaner);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Calculate total cost
  const hoursCount = parseInt(bookingData.bookingHours) || 2;
  const hourlyRate = 35;
  const subtotal = hoursCount * hourlyRate;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const handleCvvChange = (text: string) => {
    if (text.length <= 4) {
      updateBookingData('cvv', text);
      setErrors(prev => ({ ...prev, cvv: '' }));
    }
  };

  const validatePaymentInfo = useCallback(() => {
    const newErrors: {[key: string]: string} = {};

    if (!bookingData.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }

    const cardNumber = bookingData.cardNumber.replace(/\s/g, '');
    if (!cardNumber || cardNumber.length < 13 || cardNumber.length > 19) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }

    if (!bookingData.expiryDate || bookingData.expiryDate.length !== 5) {
      newErrors.expiryDate = 'Please enter MM/YY format';
    } else {
      const [month, year] = bookingData.expiryDate.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiryDate = 'Invalid month';
      } else if (parseInt(year) < currentYear || 
                (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiryDate = 'Card has expired';
      }
    }

    if (!bookingData.cvv || bookingData.cvv.length < 3) {
      newErrors.cvv = 'Please enter a valid CVV';
    }

    if (!bookingData.billingAddress.trim()) {
      newErrors.billingAddress = 'Billing address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [bookingData.cardholderName, bookingData.cardNumber, bookingData.expiryDate, bookingData.cvv, bookingData.billingAddress, setErrors]);

  const handlePayment = useCallback(async (): Promise<boolean> => {
    if (!validatePaymentInfo()) {
      return false;
    }

    // setIsProcessing(true); // This state is now managed by the parent
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mark payment as completed
      updateBookingData('paymentCompleted', 'true');
      
      // Call onNext to proceed to confirmation
      if (onNext) {
        onNext();
      }
      return true; // Indicate success
    } catch (error) {
      Alert.alert(
        'Payment Failed',
        'There was an error processing your payment. Please try again.',
        [{ text: 'OK' }]
      );
      return false; // Indicate failure
    } finally {
      // setIsProcessing(false); // This state is now managed by the parent
    }
  }, [onNext, updateBookingData, validatePaymentInfo]);

  // Expose payment processing function to parent
  React.useEffect(() => {
    if (onPaymentProcess) {
      onPaymentProcess(handlePayment);
    }
  }, [onPaymentProcess, handlePayment]);

  // Format card number as user types
  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ') : cleaned;
  };

  // Format expiry date as MM/YY
  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (text: string) => {
    const formatted = formatCardNumber(text.replace(/\s/g, ''));
    if (formatted.replace(/\s/g, '').length <= 16) {
      updateBookingData('cardNumber', formatted);
      setErrors(prev => ({ ...prev, cardNumber: '' }));
    }
  };

  const handleExpiryChange = (text: string) => {
    const formatted = formatExpiryDate(text);
    updateBookingData('expiryDate', formatted);
    setErrors(prev => ({ ...prev, expiryDate: '' }));
  };

  return (
    <>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <PageContainer 
          title="Payment"
          subtitle="Secure payment for your cleaning service"
          scrollable
        >
          {/* Order Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Service:</Text>
              <Text style={styles.summaryValue}>{bookingData.cleaningType}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Hours:</Text>
              <Text style={styles.summaryValue}>{bookingData.bookingHours} hours</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Rate:</Text>
              <Text style={styles.summaryValue}>${hourlyRate}/hour</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax (8%):</Text>
              <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>

          {/* Payment Method Selection */}
          <View style={commonStyles.formGroup}>
            <Text style={commonStyles.formLabel}>Payment Method</Text>
            <TouchableOpacity
              style={[
                styles.paymentOption,
                bookingData.paymentMethod === 'card' && styles.selectedPaymentOption
              ]}
              onPress={() => updateBookingData('paymentMethod', 'card')}
            >
              <Text style={styles.paymentOptionText}>💳 Credit/Debit Card</Text>
              {bookingData.paymentMethod === 'card' && (
                <Text style={styles.selectedIndicator}>✓</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Card Details */}
          {bookingData.paymentMethod === 'card' && (
            <>
              <View style={commonStyles.formGroup}>
                <Text style={commonStyles.formLabel}>Cardholder Name *</Text>
                <TextInput
                  style={[
                    commonStyles.zipInput,
                    errors.cardholderName && styles.invalidInput
                  ]}
                  placeholder="John Doe"
                  placeholderTextColor="#999"
                  value={bookingData.cardholderName}
                  onChangeText={(text) => {
                    updateBookingData('cardholderName', text);
                    setErrors(prev => ({ ...prev, cardholderName: '' }));
                  }}
                />
                {errors.cardholderName && (
                  <Text style={styles.errorText}>{errors.cardholderName}</Text>
                )}
              </View>

              <View style={commonStyles.formGroup}>
                <Text style={commonStyles.formLabel}>Card Number *</Text>
                <TextInput
                  style={[
                    commonStyles.zipInput,
                    errors.cardNumber && styles.invalidInput
                  ]}
                  placeholder="1234 5678 9012 3456"
                  placeholderTextColor="#999"
                  value={bookingData.cardNumber}
                  onChangeText={handleCardNumberChange}
                  keyboardType="numeric"
                  maxLength={19}
                />
                {errors.cardNumber && (
                  <Text style={styles.errorText}>{errors.cardNumber}</Text>
                )}
              </View>

              <View style={styles.cardRow}>
                <View style={[commonStyles.formGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={commonStyles.formLabel}>Expiry Date *</Text>
                  <TextInput
                    style={[
                      commonStyles.zipInput,
                      errors.expiryDate && styles.invalidInput
                    ]}
                    placeholder="MM/YY"
                    placeholderTextColor="#999"
                    value={bookingData.expiryDate}
                    onChangeText={handleExpiryChange}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                  {errors.expiryDate && (
                    <Text style={styles.errorText}>{errors.expiryDate}</Text>
                  )}
                </View>

                <View style={[commonStyles.formGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={commonStyles.formLabel}>CVV *</Text>
                  <TextInput
                    style={[
                      commonStyles.zipInput,
                      errors.cvv && styles.invalidInput
                    ]}
                    placeholder="123"
                    placeholderTextColor="#999"
                    value={bookingData.cvv}
                    onChangeText={handleCvvChange}
                    keyboardType="numeric"
                    secureTextEntry
                    maxLength={4}
                  />
                  {errors.cvv && (
                    <Text style={styles.errorText}>{errors.cvv}</Text>
                  )}
                </View>
              </View>

              <View style={commonStyles.formGroup}>
                <Text style={commonStyles.formLabel}>Billing Address *</Text>
                <TextInput
                  style={[
                    commonStyles.zipInput,
                    errors.billingAddress && styles.invalidInput
                  ]}
                  placeholder="123 Main St, City, State 12345"
                  placeholderTextColor="#999"
                  value={bookingData.billingAddress}
                  onChangeText={(text) => {
                    updateBookingData('billingAddress', text);
                    setErrors(prev => ({ ...prev, billingAddress: '' }));
                  }}
                  multiline={true}
                  numberOfLines={3}
                />
                {errors.billingAddress && (
                  <Text style={styles.errorText}>{errors.billingAddress}</Text>
                )}
              </View>

              {/* Security Notice */}
              <View style={styles.securityNotice}>
                <Text style={styles.securityText}>
                  🔒 Your payment information is secure and encrypted
                </Text>
              </View>
              
              {/* Extra spacing for keyboard avoidance */}
              <View style={styles.extraSpacing} />
            </>
          )}
        </PageContainer>
      </KeyboardAvoidingView>

      {/* Loading Overlay */}
      {isProcessing && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContent}>
            <View style={styles.loadingSpinner}>
              <ActivityIndicator size="large" color="#00D4AA" />
            </View>
            <Text style={styles.loadingText}>Processing Payment...</Text>
            <Text style={styles.loadingSubtext}>Please wait while we securely verify your payment details</Text>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
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
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00D4AA',
  },
  paymentOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedPaymentOption: {
    backgroundColor: '#00D4AA',
    borderColor: '#00D4AA',
  },
  paymentOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  selectedIndicator: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  cardRow: {
    flexDirection: 'row',
  },
  invalidInput: {
    borderColor: '#FF6B6B',
    borderWidth: 2,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    marginTop: 8,
    marginLeft: 4,
  },
  paymentButton: {
    backgroundColor: '#00D4AA',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#00D4AA',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  paymentButtonDisabled: {
    backgroundColor: '#E5E5E5',
    shadowOpacity: 0,
    elevation: 0,
  },
  paymentButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  securityNotice: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 26,
    paddingHorizontal: 20,
  },
  securityText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    width: '85%',
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  loadingSpinner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 212, 170, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'rgba(0, 212, 170, 0.2)',
  },
  loadingText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginTop: 20,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  extraSpacing: {
    height: 100, // Adjust as needed for extra space
  },
}); 