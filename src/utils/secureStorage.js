import * as SecureStore from 'expo-secure-store';

// Maximum size for SecureStore items (2KB limit)
const MAX_SECURESTORE_BYTES = 2048;

// Helper to calculate byte length of a string
const byteLength = (str) => new Blob([str]).size;

// Custom storage adapter for Supabase that uses SecureStore instead of AsyncStorage
// Now with size guard to prevent storing large objects in SecureStore
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
      // Check if value exceeds SecureStore's 2KB limit
      if (byteLength(value) > MAX_SECURESTORE_BYTES) {
        console.warn(
          `Value for key "${key}" exceeds SecureStore's 2KB limit. ` +
          `Use EncryptedStorage for large values. Size: ${byteLength(value)} bytes`
        );
        return null; // Don't attempt to store oversized items
      }
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
