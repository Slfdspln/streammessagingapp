import React, { createContext, useState, useEffect, useContext } from 'react';
import { createClient } from '@supabase/supabase-js';
import { secureStorageAdapter } from '../utils/secureStorage';
import { StreamChat } from 'stream-chat';

// Import environment variables from config
import { SUPABASE_URL, SUPABASE_ANON_KEY, STREAM_CHAT_API_KEY } from '../utils/config';

// Initialize Stream Chat client directly in AuthContext
const streamChatClient = StreamChat.getInstance(STREAM_CHAT_API_KEY);

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: secureStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Create the auth context
export const AuthContext = createContext({
  user: null,
  session: null,
  isReady: false,
  loading: true,
  client: null, // Stream Chat client
  isOnboarded: false, // Track if user has completed onboarding
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  completeOnboarding: async () => {}, // Mark onboarding as complete
  checkOnboardingStatus: async () => {}, // Check if user has completed onboarding
});

// Create the auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);

  // Check for an existing session on load
  useEffect(() => {
    const loadSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;

        setSession(session);
        setUser(session?.user || null);

        if (session?.user) {
          await connectStreamChat(session);
          // Check onboarding status when user is authenticated
          await checkOnboardingStatus(session.user.id);
        }
      } catch (error) {
        console.error('Error loading session:', error.message);
      } finally {
        setLoading(false);
        setIsReady(true);
      }
    };

    loadSession();

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user || null);

      if (event === 'SIGNED_IN' && session?.user) {
        await connectStreamChat(session);
        await checkOnboardingStatus(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        await disconnectStreamChat();
      }
    });

    // Clean up subscription
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Connect to Stream Chat with a token from our Edge Function
  const connectStreamChat = async session => {
    try {
      // Call our Edge Function to get a secure Stream token
      const { data, error } = await supabase.functions.invoke('stream-generate-token', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (error) {
        console.error('Error getting Stream Chat token from Edge Function:', error.message);
        throw new Error(`Failed to get secure token: ${error.message}`);
      }

      if (!data || !data.token) {
        console.error('Invalid response from Edge Function: Missing token');
        throw new Error('Invalid token response from server');
      }

      // Connect to Stream Chat with the token from Edge Function
      await streamChatClient.connectUser(
        {
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email,
          email: session.user.email,
        },
        data.token
      );
      console.log('Connected to Stream Chat using secure token');
    } catch (error) {
      console.error('Error connecting to Stream Chat:', error.message);
      // Show an alert or handle the error appropriately in your UI
      // We don't fall back to insecure methods - better to fail securely
    }
  };

  // Disconnect from Stream Chat
  const disconnectStreamChat = async () => {
    try {
      if (streamChatClient.userID) {
        await streamChatClient.disconnectUser();
      }
    } catch (error) {
      console.error('Error disconnecting from Stream Chat:', error.message);
    }
  };

  // Check if user has completed onboarding
  const checkOnboardingStatus = async userId => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', userId)
        .single();

      if (error) throw error;

      setIsOnboarded(data?.onboarding_completed || false);
      return data?.onboarding_completed || false;
    } catch (error) {
      console.error('Error checking onboarding status:', error.message);
      return false;
    }
  };

  // Mark onboarding as complete
  const completeOnboarding = async () => {
    try {
      if (!user) throw new Error('No authenticated user');

      const { error } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id);

      if (error) throw error;

      setIsOnboarded(true);
      return { error: null };
    } catch (error) {
      console.error('Error completing onboarding:', error.message);
      return { error };
    }
  };

  // Sign up with email and password
  const signUp = async (email, password, fullName) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      await disconnectStreamChat();
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      return { error: null };
    } catch (error) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Auth context value
  const value = {
    user,
    userId: user?.id,
    session,
    isReady,
    loading,
    isOnboarded,
    client: streamChatClient, // Expose the Stream Chat client
    signUp,
    signIn,
    signOut,
    checkOnboardingStatus,
    completeOnboarding,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
