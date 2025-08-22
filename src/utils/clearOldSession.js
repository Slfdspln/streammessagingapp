import * as SecureStore from 'expo-secure-store';
import { SUPABASE_URL } from './config';

/**
 * Utility to clear the old Supabase session from SecureStore
 * Run this once after switching to EncryptedStorage to prevent SecureStore warnings
 */
export const clearOldSupabaseSession = async () => {
  try {
    // Extract project reference from Supabase URL
    // Format: https://[PROJECT_REF].supabase.co
    const projectRef = SUPABASE_URL.match(/https:\/\/([^.]+)/)?.[1];
    
    if (!projectRef) {
      console.warn('Could not extract project reference from Supabase URL');
      return;
    }
    
    // The key format Supabase uses for storing auth session
    const sessionKey = `sb-${projectRef}-auth-token`;
    
    // Delete the old session from SecureStore
    await SecureStore.deleteItemAsync(sessionKey);
    console.log('Successfully cleared old Supabase session from SecureStore');
  } catch (error) {
    console.error('Error clearing old Supabase session:', error);
  }
};
