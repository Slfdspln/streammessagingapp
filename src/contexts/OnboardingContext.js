import React, { createContext, useState, useContext } from 'react';
import { useAuth } from './AuthContext';
import { createClient } from '@supabase/supabase-js';
import { secureStorageAdapter } from '../utils/secureStorage';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../utils/config';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: secureStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Create the context
const OnboardingContext = createContext();

// Custom hook to use the onboarding context
export const useOnboarding = () => {
  return useContext(OnboardingContext);
};

// Provider component
export const OnboardingProvider = ({ children }) => {
  const { user, completeOnboarding } = useAuth();

  // State to store all onboarding data
  const [onboardingData, setOnboardingData] = useState({
    firstName: '',
    lastName: '',
    birthdate: new Date(2000, 0, 1),
    gender: '',
    showGender: true,
    photos: [],
    interests: [],
  });

  // Update specific fields in the onboarding data
  const updateOnboardingData = newData => {
    setOnboardingData(prevData => ({
      ...prevData,
      ...newData,
    }));
  };

  // Submit all onboarding data and complete the process
  const submitOnboarding = async () => {
    try {
      if (!user) throw new Error('No authenticated user');

      // Format data for Supabase
      const profileData = {
        first_name: onboardingData.firstName,
        last_name: onboardingData.lastName,
        birth_date: onboardingData.birthdate.toISOString().split('T')[0],
        gender: onboardingData.gender,
        show_gender: onboardingData.showGender,
        interests: onboardingData.interests,
        photos: onboardingData.photos,
        onboarding_completed: true,
      };

      // Update the user's profile in Supabase
      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Call the completeOnboarding method from AuthContext to update local state
      await completeOnboarding();

      return true;
    } catch (error) {
      console.error('Error submitting onboarding data:', error);
      return false;
    }
  };

  // Value object to be provided to consumers
  const value = {
    onboardingData,
    updateOnboardingData,
    submitOnboarding,
  };

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
};

export default OnboardingProvider;
