import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initialize the Supabase client with your Supabase URL and anon key
const supabaseUrl = 'https://mzfancltgkwbidxvcrzz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16ZmFuY2x0Z2t3YmlkeHZjcnp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MTAxOTgsImV4cCI6MjA2ODI4NjE5OH0.y6ZrWOIckoyPyrrfsDSF2yJxlfJqsrWKxnpU6rjHZW4';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
