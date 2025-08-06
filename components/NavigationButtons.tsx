import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface NavigationButtonsProps {
  onBack?: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextText?: string;
  showBack?: boolean;
  showNext?: boolean;
  isPaymentPage?: boolean;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onBack,
  onNext,
  nextDisabled = false,
  nextText = 'Continue',
  showBack = true,
  showNext = true,
  isPaymentPage = false
}) => (
  <View style={styles.buttonContainer}>
    {showBack && onBack && (
      <TouchableOpacity 
        style={isPaymentPage ? styles.backBtnPayment : styles.backBtn} 
        onPress={onBack}
      >
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    )}
    
    {showNext && (
      <TouchableOpacity 
        style={[
          isPaymentPage ? styles.paymentBtn : styles.continueBtn, 
          nextDisabled && (isPaymentPage ? styles.paymentBtnDisabled : styles.disabled)
        ]}
        onPress={onNext}
        disabled={nextDisabled}
      >
        <Text style={isPaymentPage ? styles.paymentText : styles.continueText}>
          {nextText}
        </Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 0,
    marginBottom: 0,
    justifyContent: 'space-between',
  },
  backBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    flex: 0.3,
  },
  backText: {
    color: '#333',
    fontSize: 18,
    fontWeight: '600',
  },
  continueBtn: {
    backgroundColor: '#00D4AA',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    flex: 1,
  },
  disabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  continueText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  backBtnPayment: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    flex: 0.3,
  },
  paymentBtn: {
    backgroundColor: '#00D4AA',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    flex: 1.7,
    shadowColor: '#00D4AA',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  paymentText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  paymentBtnDisabled: {
    backgroundColor: '#E5E5E5',
    shadowOpacity: 0,
    elevation: 0,
  },
});