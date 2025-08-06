import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="white" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#667eea',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 16,
    fontWeight: '600',
  },
}); 