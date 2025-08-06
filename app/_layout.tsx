import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { LoadingScreen } from '@/components/LoadingScreen';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { BookingFlowProvider } from '@/hooks/useBookingFlow';
import { useColorScheme } from '@/hooks/useColorScheme';

function AppContent() {
  const colorScheme = useColorScheme();
  const { isLoading } = useAuth();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Always allow access to the app - authentication will be handled at checkout
  return (
    <BookingFlowProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </BookingFlowProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
