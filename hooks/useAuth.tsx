import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { AuthState, User } from '../types';

// Dummy user data for testing
const DUMMY_USER: User = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@email.com',
  profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  phoneNumber: '+1 (555) 123-4567',
  defaultAddress: '123 Main St, New York, NY 10001',
  defaultLocation: 'New York, NY',
  language: 'English',
  theme: 'system',
  notifications: {
    push: true,
    email: true,
    sms: false,
  },
  paymentMethods: [
    {
      id: '1',
      type: 'card',
      cardNumber: '4567',
      expiryDate: '12/25',
      cardholderName: 'John Doe',
      isDefault: true,
    }
  ],
  addresses: [
    {
      id: '1',
      label: 'Home',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      isDefault: true,
    },
    {
      id: '2',
      label: 'Work',
      address: '456 Office Blvd',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      isDefault: false,
    }
  ],
  createdAt: '2024-01-15T10:00:00Z',
  lastLoginAt: new Date().toISOString(),
};

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  continueAsGuest: (guestData: { name: string; email: string; phoneNumber?: string }) => Promise<void>;
  convertGuestToUser: (password: string) => Promise<boolean>;
  requireAuth: () => boolean; // Returns true if user needs to authenticate
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';
const GUEST_DATA_KEY = 'guest_data';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    isGuest: false,
    guestData: undefined,
  });

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);
      const guestData = await AsyncStorage.getItem(GUEST_DATA_KEY);
      
      if (token && userData) {
        // User is authenticated
        const user = JSON.parse(userData);
        setAuthState({
          isAuthenticated: true,
          user,
          isLoading: false,
          isGuest: false,
          guestData: undefined,
        });
      } else if (guestData) {
        // User is a guest
        const guest = JSON.parse(guestData);
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          isGuest: true,
          guestData: guest,
        });
      } else {
        // New user - no authentication required, can browse freely
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          isGuest: false,
          guestData: undefined,
        });
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      // On error, allow free browsing
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        isGuest: false,
        guestData: undefined,
      });
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email && password) {
        const updatedUser = {
          ...DUMMY_USER,
          email,
          lastLoginAt: new Date().toISOString(),
        };

        await AsyncStorage.setItem(AUTH_TOKEN_KEY, 'dummy_token_123');
        await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));
        await AsyncStorage.removeItem(GUEST_DATA_KEY); // Clear guest data
        
        setAuthState({
          isAuthenticated: true,
          user: updatedUser,
          isLoading: false,
          isGuest: false,
          guestData: undefined,
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_DATA_KEY, GUEST_DATA_KEY]);
      
      // After logout, user can still browse the app freely
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        isGuest: false,
        guestData: undefined,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const continueAsGuest = async (guestData: { name: string; email: string; phoneNumber?: string }): Promise<void> => {
    try {
      await AsyncStorage.setItem(GUEST_DATA_KEY, JSON.stringify(guestData));
      
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        isGuest: true,
        guestData,
      });
    } catch (error) {
      console.error('Guest checkout error:', error);
    }
  };

  const convertGuestToUser = async (password: string): Promise<boolean> => {
    try {
      if (!authState.guestData) return false;
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser = {
        ...DUMMY_USER,
        name: authState.guestData.name,
        email: authState.guestData.email,
        phoneNumber: authState.guestData.phoneNumber,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(AUTH_TOKEN_KEY, 'dummy_token_123');
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(newUser));
      await AsyncStorage.removeItem(GUEST_DATA_KEY);
      
      setAuthState({
        isAuthenticated: true,
        user: newUser,
        isLoading: false,
        isGuest: false,
        guestData: undefined,
      });
      
      return true;
    } catch (error) {
      console.error('Convert guest to user error:', error);
      return false;
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<void> => {
    try {
      if (authState.user) {
        const updatedUser = { ...authState.user, ...userData };
        await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));
        
        setAuthState({
          ...authState,
          user: updatedUser,
        });
      }
    } catch (error) {
      console.error('Update user error:', error);
    }
  };

  const requireAuth = (): boolean => {
    // Only require auth when specifically needed (this function is mainly for checkout flow)
    // Users can browse the app freely without being authenticated or guests
    return false; // Changed from: !authState.isAuthenticated && !authState.isGuest
  };

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    updateUser,
    continueAsGuest,
    convertGuestToUser,
    requireAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 