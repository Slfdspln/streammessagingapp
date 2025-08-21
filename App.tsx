import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { OverlayProvider, Chat } from 'stream-chat-react-native';
import { StreamChat } from 'stream-chat';
import { StyleSheet, LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Import theme
import { datingAppTheme, streami18n } from './src/theme';

// Import auth and navigation
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import OnboardingProvider from './src/contexts/OnboardingContext';
import { AppNavigator } from './src/navigation/AppNavigator';

// Import Stream Chat types
import { AppStreamChatGenerics } from './src/types/stream-chat';

// Ignore non-serializable navigation state warnings
LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);

export default function App(): React.ReactElement {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <OnboardingProvider>
            <AppContent />
          </OnboardingProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

// This component accesses the auth context and conditionally renders the app
const AppContent = (): React.ReactElement => {
  const { user, isReady, client } = useAuth();

  // Wait until auth state is fully determined before rendering anything
  if (!isReady) {
    // You could return a splash screen here
    return null as unknown as React.ReactElement;
  }

  // If no user (not logged in), render the navigator without Chat provider
  // This will show auth screens based on the navigation logic
  if (!user) {
    return <AppNavigator />;
  }

  // Only wrap with Chat provider when user is logged in and auth is ready
  // Using the client from AuthContext
  if (!client) {
    // Handle case where client is not initialized
    return <AppNavigator />;
  }

  return (
    <OverlayProvider i18nInstance={streami18n}>
      <Chat client={client}>
        <AppNavigator />
      </Chat>
    </OverlayProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
