import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { OverlayProvider } from 'stream-chat-react-native';
import { Text, View, StyleSheet } from 'react-native';

// Import theme
import { datingAppTheme, streami18n } from './src/theme';

// Import auth and navigation
import { AuthProvider } from './src/contexts/AuthContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <OverlayProvider i18nInstance={streami18n} style={datingAppTheme}>
          <AppNavigator />
        </OverlayProvider>
      </AuthProvider>
    </SafeAreaProvider>
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
