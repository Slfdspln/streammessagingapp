import Constants from 'expo-constants';

// Load environment variables from Constants.expoConfig.extra
// These will be populated from app.json and .env files via app.config.js
const getEnv = () => {
  // For Expo Go and development
  const extra = Constants.expoConfig?.extra || {};
  
  return {
    supabaseUrl: extra.SUPABASE_URL,
    supabaseAnonKey: extra.SUPABASE_ANON_KEY,
    streamChatApiKey: extra.STREAM_CHAT_API_KEY,
    appEnv: extra.APP_ENV || 'production',
    storageBucket: extra.STORAGE_BUCKET || 'profile-photos',
  };
};

// Export environment variables
export const ENV = getEnv();

// Export specific variables for easier imports
export const SUPABASE_URL = ENV.supabaseUrl;
export const SUPABASE_ANON_KEY = ENV.supabaseAnonKey;
export const STREAM_CHAT_API_KEY = ENV.streamChatApiKey;
export const APP_ENV = ENV.appEnv;
export const STORAGE_BUCKET = ENV.storageBucket;

// Log environment variables for debugging
if (APP_ENV === 'development') {
  console.log('Environment variables loaded:', { 
    SUPABASE_URL, 
    SUPABASE_ANON_KEY: SUPABASE_ANON_KEY ? '***' : undefined, 
    STREAM_CHAT_API_KEY: STREAM_CHAT_API_KEY ? '***' : undefined,
    APP_ENV,
    STORAGE_BUCKET
  });
}

// Helper function to check if we're in development mode
export const isDev = () => APP_ENV === 'development';
