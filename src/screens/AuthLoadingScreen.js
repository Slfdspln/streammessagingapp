import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export const AuthLoadingScreen = () => {
  const { loading } = useAuth();

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
