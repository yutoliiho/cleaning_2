import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => (
  <View style={styles.progressContainer}>
    <View style={styles.progressBar}>
      <View 
        style={[styles.progressFill, { width: `${(currentStep / totalSteps) * 100}%` }]} 
      />
    </View>
    <Text style={styles.progressText}>Step {currentStep} of {totalSteps}</Text>
  </View>
);

const styles = StyleSheet.create({
  progressContainer: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00D4AA',
    borderRadius: 2,
  },
  progressText: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
});