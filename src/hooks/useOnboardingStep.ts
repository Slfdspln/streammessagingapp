import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../utils/supabase';
import { useOnboarding } from '../contexts/OnboardingContext';

export type OnboardingStep = 
  | 'welcome' 
  | 'name' 
  | 'basics' 
  | 'photos' 
  | 'auth' 
  | 'interests' 
  | 'review' 
  | 'done';

const ONBOARDING_STEP_KEY = '@onboarding_step';

/**
 * Hook to track and manage onboarding progress
 */
export const useOnboardingStep = () => {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [loading, setLoading] = useState(true);
  const { onboardingData } = useOnboarding();

  // Load step from storage on mount
  useEffect(() => {
    const loadStep = async () => {
      try {
        // Check if user is already authenticated
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // If authenticated, check if onboarding is complete
          const { data } = await supabase
            .from('profiles')
            .select('onboarding_completed')
            .eq('id', user.id)
            .single();
            
          if (data?.onboarding_completed) {
            setStep('done');
            setLoading(false);
            return;
          }
          
          // If authenticated but onboarding not complete, determine step based on profile data
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (profile) {
            if (profile.interests && profile.interests.length > 0) {
              setStep('review');
            } else if (profile.photos && profile.photos.length > 0) {
              setStep('interests');
            } else if (profile.birth_date) {
              setStep('photos');
            } else if (profile.first_name) {
              setStep('basics');
            } else {
              setStep('name');
            }
          }
        } else {
          // Not authenticated, check local progress
          const savedStep = await AsyncStorage.getItem(ONBOARDING_STEP_KEY);
          if (savedStep) {
            setStep(savedStep as OnboardingStep);
          }
        }
      } catch (error) {
        console.error('Error loading onboarding step:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadStep();
  }, []);

  // Save step to storage whenever it changes
  const updateStep = async (newStep: OnboardingStep) => {
    try {
      await AsyncStorage.setItem(ONBOARDING_STEP_KEY, newStep);
      setStep(newStep);
    } catch (error) {
      console.error('Error saving onboarding step:', error);
    }
  };

  // Map step to screen name for navigation
  const mapStepToScreen = (step: OnboardingStep): string => {
    switch (step) {
      case 'welcome': return 'Welcome';
      case 'name': return 'NameBirthday';
      case 'basics': return 'Gender';
      case 'photos': return 'OnboardingPhotos';
      case 'auth': return 'AuthEmail';
      case 'interests': return 'Interests';
      case 'review': return 'Review';
      case 'done': return 'Main';
      default: return 'Welcome';
    }
  };

  // Determine if we can proceed to the next step based on data
  const canProceedToNextStep = (): boolean => {
    switch (step) {
      case 'welcome':
        return true;
      case 'name':
        return !!onboardingData.firstName && !!onboardingData.lastName;
      case 'basics':
        return !!onboardingData.birthdate && !!onboardingData.gender;
      case 'photos':
        return onboardingData.photos.length > 0;
      case 'auth':
        return true; // This is handled by auth flow
      case 'interests':
        return onboardingData.interests.length > 0;
      case 'review':
        return true;
      default:
        return false;
    }
  };

  // Get the next step in the flow
  const getNextStep = (): OnboardingStep => {
    switch (step) {
      case 'welcome': return 'name';
      case 'name': return 'basics';
      case 'basics': return 'photos';
      case 'photos': return 'auth';
      case 'auth': return 'interests';
      case 'interests': return 'review';
      case 'review': return 'done';
      default: return 'welcome';
    }
  };

  // Proceed to next step if possible
  const proceedToNextStep = async (): Promise<boolean> => {
    if (canProceedToNextStep()) {
      const nextStep = getNextStep();
      await updateStep(nextStep);
      return true;
    }
    return false;
  };

  return {
    step,
    loading,
    updateStep,
    mapStepToScreen,
    canProceedToNextStep,
    proceedToNextStep,
  };
};

export default useOnboardingStep;
