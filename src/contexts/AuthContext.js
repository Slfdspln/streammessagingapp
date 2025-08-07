import React, { createContext, useState, useEffect, useContext } from 'react';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import centralized Stream Chat client
import { client as streamChatClient } from '../utils/chat';

// Initialize Supabase client
const supabaseUrl = 'https://mzfancltgkwbidxvcrzz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16ZmFuY2x0Z2t3YmlkeHZjcnp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MTAxOTgsImV4cCI6MjA2ODI4NjE5OH0.y6ZrWOIckoyPyrrfsDSF2yJxlfJqsrWKxnpU6rjHZW4';
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
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
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
});

// Create the auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for an existing session on load
  useEffect(() => {
    const loadSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          await connectStreamChat(session);
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user || null);
        
        if (event === 'SIGNED_IN' && session?.user) {
          await connectStreamChat(session);
        } else if (event === 'SIGNED_OUT') {
          await disconnectStreamChat();
        }
      }
    );
    
    // Clean up subscription
    return () => {
      subscription?.unsubscribe();
    };
  }, []);
  
  // Connect to Stream Chat with a token from our Edge Function
  const connectStreamChat = async (session) => {
    try {
      // Call our Edge Function to get a Stream token
      const { data, error } = await supabase.functions.invoke('stream-generate-token', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      
      if (error) throw error;
      
      // Connect to Stream Chat with the token
      await streamChatClient.connectUser(
        {
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email,
          email: session.user.email,
        },
        data.token
      );
    } catch (error) {
      console.error('Error connecting to Stream Chat:', error.message);
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
    signUp,
    signIn,
    signOut,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
