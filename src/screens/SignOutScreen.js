import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export const SignOutScreen = () => {
  const { signOut } = useAuth();

  // Automatically sign out when this screen is loaded
  useEffect(() => {
    const performSignOut = async () => {
      try {
        await signOut();
      } catch (error) {
        console.error('Error signing out:', error);
      }
    };

    performSignOut();
  }, [signOut]);

  // Show a loading indicator while signing out
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#006AFF" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
