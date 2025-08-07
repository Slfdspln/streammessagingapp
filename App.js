import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { OverlayProvider, Chat } from 'stream-chat-react-native';
import { Text, View, StyleSheet, LogBox } from 'react-native';

// Import centralized Stream Chat client
import { client as streamChatClient } from './src/utils/chat';

// Import theme
import { datingAppTheme, streami18n } from './src/theme';

// Import auth and navigation
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { AppNavigator } from './src/navigation/AppNavigator';

// Ignore non-serializable navigation state warnings
LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

// This component accesses the auth context and conditionally renders the app
const AppContent = () => {
  const { user, isReady } = useAuth();
  
  // Wait until auth state is fully determined before rendering anything
  if (!isReady) {
    // You could return a splash screen here
    return null;
  }
  
  // If no user (not logged in), render the navigator without Chat provider
  // This will show auth screens based on the navigation logic
  if (!user) {
    return <AppNavigator />;
  }
  
  // Only wrap with Chat provider when user is logged in and auth is ready
  // Using the centralized streamChatClient from utils/chat.js
  return (
    <OverlayProvider i18nInstance={streami18n} style={datingAppTheme}>
      <Chat client={streamChatClient}>
        <AppNavigator />
      </Chat>
    </OverlayProvider>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
