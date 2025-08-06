import { useAuth } from '@/hooks/useAuth';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface CheckoutAuthModalProps {
  visible: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
  onGuestContinue: () => void;
}

export const CheckoutAuthModal: React.FC<CheckoutAuthModalProps> = ({
  visible,
  onClose,
  onAuthSuccess,
  onGuestContinue,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'guest'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, continueAsGuest, convertGuestToUser } = useAuth();

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setPhoneNumber('');
    setIsLoading(false);
    setShowPassword(false);
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        resetForm();
        onAuthSuccess();
      } else {
        Alert.alert('Login Failed', 'Invalid credentials. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      // For demo, we'll just log them in with the provided email
      const success = await login(email, password);
      if (success) {
        resetForm();
        onAuthSuccess();
        Alert.alert('Success', 'Account created successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during sign up. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestCheckout = async () => {
    if (!name || !email) {
      Alert.alert('Error', 'Please enter your name and email to continue as guest');
      return;
    }

    setIsLoading(true);
    try {
      await continueAsGuest({ name, email, phoneNumber });
      resetForm();
      onGuestContinue();
    } catch (error) {
      Alert.alert('Error', 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderSignInForm = () => (
    <>
      <Text style={styles.title}>Sign In</Text>
      <Text style={styles.subtitle}>Sign in to your account to continue</Text>

      <View style={styles.inputContainer}>
        <MaterialIcons name="email" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="lock" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <MaterialIcons 
            name={showPassword ? "visibility" : "visibility-off"} 
            size={20} 
            color="#666" 
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
        onPress={handleSignIn}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Text style={styles.primaryButtonText}>Sign In</Text>
        )}
      </TouchableOpacity>

      <View style={styles.switchModeContainer}>
        <Text style={styles.switchModeText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => setMode('signup')}>
          <Text style={styles.switchModeLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderSignUpForm = () => (
    <>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Create an account to save your preferences</Text>

      <View style={styles.inputContainer}>
        <MaterialIcons name="person" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="email" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="phone" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Phone Number (optional)"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="lock" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <MaterialIcons 
            name={showPassword ? "visibility" : "visibility-off"} 
            size={20} 
            color="#666" 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="lock" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          placeholderTextColor="#999"
        />
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
        onPress={handleSignUp}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Text style={styles.primaryButtonText}>Create Account</Text>
        )}
      </TouchableOpacity>

      <View style={styles.switchModeContainer}>
        <Text style={styles.switchModeText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => setMode('signin')}>
          <Text style={styles.switchModeLink}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderGuestForm = () => (
    <>
      <Text style={styles.title}>Continue as Guest</Text>
      <Text style={styles.subtitle}>Enter your details to complete your booking</Text>

      <View style={styles.inputContainer}>
        <MaterialIcons name="person" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="email" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="phone" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Phone Number (optional)"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          placeholderTextColor="#999"
        />
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
        onPress={handleGuestCheckout}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Text style={styles.primaryButtonText}>Continue as Guest</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.guestNote}>
        You can create an account after completing your booking to save your preferences and track your orders.
      </Text>
    </>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            {mode === 'signin' && renderSignInForm()}
            {mode === 'signup' && renderSignUpForm()}
            {mode === 'guest' && renderGuestForm()}
          </View>

          {mode !== 'guest' && (
            <View style={styles.guestOption}>
              <Text style={styles.orText}>OR</Text>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => setMode('guest')}
              >
                <Text style={styles.secondaryButtonText}>Continue as Guest</Text>
              </TouchableOpacity>
            </View>
          )}

          {mode === 'guest' && (
            <View style={styles.authOptions}>
              <Text style={styles.orText}>OR</Text>
              <View style={styles.authButtonsRow}>
                <TouchableOpacity
                  style={[styles.secondaryButton, styles.halfWidth]}
                  onPress={() => setMode('signin')}
                >
                  <Text style={styles.secondaryButtonText}>Sign In</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.secondaryButton, styles.halfWidth]}
                  onPress={() => setMode('signup')}
                >
                  <Text style={styles.secondaryButtonText}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 4,
  },
  primaryButton: {
    backgroundColor: '#00D4AA',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#00D4AA',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#999',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00D4AA',
  },
  secondaryButtonText: {
    color: '#00D4AA',
    fontSize: 16,
    fontWeight: '600',
  },
  switchModeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  switchModeText: {
    color: '#666',
    fontSize: 16,
  },
  switchModeLink: {
    color: '#00D4AA',
    fontSize: 16,
    fontWeight: '600',
  },
  guestOption: {
    alignItems: 'center',
    marginBottom: 20,
  },
  authOptions: {
    alignItems: 'center',
    marginBottom: 20,
  },
  orText: {
    color: '#999',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  authButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  halfWidth: {
    flex: 1,
  },
  guestNote: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 20,
  },
}); 