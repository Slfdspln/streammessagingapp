import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../utils/supabase';
import { saveName, saveBasics, savePhotoUrls, saveInterests } from '../api/profile';

// Constants for local storage
const ONBOARDING_DATA_KEY = '@onboarding_data';

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
  
  // Load onboarding data from local storage on mount
  useEffect(() => {
    const loadOnboardingData = async () => {
      try {
        const savedData = await AsyncStorage.getItem(ONBOARDING_DATA_KEY);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          
          // Convert string date back to Date object
          if (parsedData.birthdate) {
            parsedData.birthdate = new Date(parsedData.birthdate);
          }
          
          setOnboardingData(parsedData);
        }
      } catch (error) {
        console.error('Error loading onboarding data:', error);
      }
    };
    
    loadOnboardingData();
  }, []);

  // Update specific fields in the onboarding data and save to local storage
  const updateOnboardingData = async (newData) => {
    const updatedData = {
      ...onboardingData,
      ...newData,
    };
    
    setOnboardingData(updatedData);
    
    try {
      // Save to local storage (stringify Date objects)
      const dataToSave = {
        ...updatedData,
        birthdate: updatedData.birthdate?.toISOString(),
      };
      
      await AsyncStorage.setItem(ONBOARDING_DATA_KEY, JSON.stringify(dataToSave));
      
      // If user is authenticated, also save to Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await syncToSupabase(updatedData, newData);
      }
    } catch (error) {
      console.error('Error saving onboarding data:', error);
    }
  };
  
  // Sync specific updated fields to Supabase
  const syncToSupabase = async (fullData, updatedFields) => {
    try {
      // Check which fields were updated and call appropriate API
      if (updatedFields.firstName || updatedFields.lastName) {
        await saveName(fullData.firstName, fullData.lastName);
      }
      
      if (updatedFields.birthdate || updatedFields.gender || updatedFields.showGender) {
        await saveBasics({
          birthdate: fullData.birthdate?.toISOString().split('T')[0],
          gender: fullData.gender,
          show_gender: fullData.showGender,
        });
      }
      
      if (updatedFields.photos) {
        await savePhotoUrls(fullData.photos);
      }
      
      if (updatedFields.interests) {
        await saveInterests(fullData.interests);
      }
    } catch (error) {
      console.error('Error syncing to Supabase:', error);
    }
  };

  // Submit all onboarding data and complete the process
  const submitOnboarding = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
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
        .upsert({ id: user.id, ...profileData })
        .select();

      if (profileError) throw profileError;

      // Call the completeOnboarding method from AuthContext to update local state
      await completeOnboarding();
      
      // Clear local storage onboarding data
      await AsyncStorage.removeItem(ONBOARDING_DATA_KEY);

      return true;
    } catch (error) {
      console.error('Error submitting onboarding data:', error);
      return false;
    }
  };
  
  // Clear onboarding data
  const clearOnboardingData = async () => {
    try {
      await AsyncStorage.removeItem(ONBOARDING_DATA_KEY);
      setOnboardingData({
        firstName: '',
        lastName: '',
        birthdate: new Date(2000, 0, 1),
        gender: '',
        showGender: true,
        photos: [],
        interests: [],
      });
    } catch (error) {
      console.error('Error clearing onboarding data:', error);
    }
  };

  // Value object to be provided to consumers
  const value = {
    onboardingData,
    updateOnboardingData,
    submitOnboarding,
    clearOnboardingData,
  };

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
};

export default OnboardingProvider;
