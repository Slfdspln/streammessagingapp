import * as SecureStore from 'expo-secure-store';

// Custom storage adapter for Supabase that uses SecureStore instead of AsyncStorage
export const secureStorageAdapter = {
  getItem: async (key) => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Error getting item from SecureStore:', error);
      return null;
    }
  },
  setItem: async (key, value) => {
    try {
      return await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('Error setting item in SecureStore:', error);
      return null;
    }
  },
  removeItem: async (key) => {
    try {
      return await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Error removing item from SecureStore:', error);
      return null;
    }
  },
};
