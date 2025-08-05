import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface NavigationButtonsProps {
  onBack?: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextText?: string;
  showBack?: boolean;
  showNext?: boolean;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onBack,
  onNext,
  nextDisabled = false,
  nextText = 'Continue',
  showBack = true,
  showNext = true
}) => (
  <View style={[styles.buttonContainer, !showBack && styles.centeredContainer]}>
    {showBack && onBack && (
      <TouchableOpacity style={[styles.backBtn, !showNext && styles.fullWidth]} onPress={onBack}>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    )}
    
    {showNext && (
      <TouchableOpacity 
        style={[styles.continueBtn, nextDisabled && styles.disabled, !showBack && styles.fullWidth]}
        onPress={onNext}
        disabled={nextDisabled}
      >
        <Text style={styles.continueText}>{nextText}</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 40,
  },
  centeredContainer: {
    justifyContent: 'center',
  },
  backBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    flex: 1,
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
  fullWidth: {
    alignSelf: 'center',
    minWidth: 200,
    maxWidth: 280,
    flex: 0,
  },
  disabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  continueText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});