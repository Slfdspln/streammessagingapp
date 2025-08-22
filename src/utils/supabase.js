import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { secureStorageAdapter } from './secureStorage';
import EncryptedStorage from 'react-native-encrypted-storage';

// Import environment variables from config
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';

// Create encrypted storage adapter for Supabase auth (no size limit)
const encryptedStorage = {
  getItem: (key) => EncryptedStorage.getItem(key),
  setItem: (key, value) => EncryptedStorage.setItem(key, value),
  removeItem: (key) => EncryptedStorage.removeItem(key),
};

// Create a single supabase client for interacting with your database
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: encryptedStorage, // Use encrypted storage for auth (handles large session objects)
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
