import Constants from 'expo-constants';

// Load environment variables from Constants.expoConfig.extra
// These will be populated from app.json and .env files via app.config.js
const getEnv = () => {
  // For Expo Go and development
  if (Constants.expoConfig?.extra) {
    return Constants.expoConfig.extra;
  }

  // Fallback for production builds or if extra is not available
  return {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    streamChatApiKey: process.env.STREAM_CHAT_API_KEY,
    appEnv: process.env.APP_ENV || 'production',
  };
};

// Export environment variables
export const ENV = getEnv();

// Export specific variables for easier imports
export const SUPABASE_URL = ENV.supabaseUrl;
export const SUPABASE_ANON_KEY = ENV.supabaseAnonKey;
export const STREAM_CHAT_API_KEY = ENV.streamChatApiKey;
export const APP_ENV = ENV.appEnv;

// Helper function to check if we're in development mode
export const isDev = () => APP_ENV === 'development';
