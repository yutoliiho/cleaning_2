import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  zipInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
  },
  optionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selected: {
    backgroundColor: '#00D4AA',
    borderColor: '#00D4AA',
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 13,
    color: '#666',
  },
  formGroup: {
    // marginBottom: 32,
  },
  formLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 16,
  },
  dropdownContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  dropdownOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 20,
    minWidth: 80,
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedOption: {
    backgroundColor: '#00D4AA',
  },
  dropdownText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
  selectedText: {
    color: '#000',
    fontWeight: '600',
  },
  counterSection: {
    marginBottom: 32,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  counterLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  counterControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  counterBtn: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    backgroundColor: '#00D4AA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBtnText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  counterDisplay: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    minWidth: 50,
    alignItems: 'center',
  },
  counterNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  counterDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 16,
  },
});