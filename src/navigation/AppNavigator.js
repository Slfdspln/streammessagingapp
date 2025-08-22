import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import useOnboardingStep from '../hooks/useOnboardingStep';

// Loading Screen
import { AuthLoadingScreen } from '../screens/AuthLoadingScreen';

// App Screens
import { ChannelScreen } from '../screens/ChannelScreen';
import { NewConversationScreen } from '../screens/NewConversationScreen';
import { SignOutScreen } from '../screens/SignOutScreen';

// Profile Screens
import AddPicsScreen from '../screens/AddPicsScreen';
import LifestyleQuestionsScreen from '../screens/LifestyleQuestionsScreen';
import RelationshipGoalsScreen from '../screens/RelationshipGoalsScreen';
import ProfileEditScreen from '../screens/ProfileEditScreen';

// Onboarding Screens
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import NameBirthdayScreen from '../screens/onboarding/NameBirthdayScreen';
import GenderScreen from '../screens/onboarding/GenderScreen';
import InterestsScreen from '../screens/onboarding/InterestsScreen';
import OnboardingPhotosScreen from '../screens/onboarding/OnboardingPhotosScreen';
import OnboardingAuthScreen from '../screens/onboarding/OnboardingAuthScreen';
import OnboardingReviewScreen from '../screens/onboarding/OnboardingReviewScreen';

// Import the MainTabNavigator
import MainTabNavigator from './MainTabNavigator';

const Stack = createNativeStackNavigator();
const OnboardingStack = createNativeStackNavigator();

// Common header styles for app screens
const appHeaderStyle = {
  headerStyle: {
    backgroundColor: '#006AFF',
  },
  headerTintColor: '#fff',
};

// Onboarding navigator component
const OnboardingNavigator = () => {
  return (
    <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
      <OnboardingStack.Screen name="Welcome" component={OnboardingScreen} />
      <OnboardingStack.Screen name="NameBirthday" component={NameBirthdayScreen} />
      <OnboardingStack.Screen name="Gender" component={GenderScreen} />
      <OnboardingStack.Screen name="OnboardingPhotos" component={OnboardingPhotosScreen} />
      <OnboardingStack.Screen name="AuthEmail" component={OnboardingAuthScreen} />
      <OnboardingStack.Screen name="Interests" component={InterestsScreen} />
      <OnboardingStack.Screen name="Review" component={OnboardingReviewScreen} />
    </OnboardingStack.Navigator>
  );
};

export const AppNavigator = () => {
  const { user, loading, isOnboarded } = useAuth();
  const { step, loading: stepLoading, mapStepToScreen } = useOnboardingStep();
  
  // Show loading screen while states are being determined
  if (loading || stepLoading) {
    return <AuthLoadingScreen />;
  }
  
  // Determine if user has completed onboarding
  const onboardingComplete = step === 'done' || (user && isOnboarded);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {onboardingComplete ? (
          // User has completed onboarding - show main app
          <>
            <Stack.Screen
              name="Main"
              component={MainTabNavigator}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="ChannelScreen"
              component={ChannelScreen}
              options={({ route }) => ({
                title: route.params?.channelName || 'Chat',
                ...appHeaderStyle,
              })}
            />
            <Stack.Screen
              name="NewConversation"
              component={NewConversationScreen}
              options={{
                title: 'New Conversation',
                ...appHeaderStyle,
              }}
            />
            <Stack.Screen
              name="SignOut"
              component={SignOutScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="AddPics"
              component={AddPicsScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="LifestyleQuestions"
              component={LifestyleQuestionsScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="RelationshipGoals"
              component={RelationshipGoalsScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="ProfileEdit"
              component={ProfileEditScreen}
              options={{
                headerShown: false,
              }}
            />
          </>
        ) : (
          // User needs to complete onboarding - show onboarding flow first
          <Stack.Screen
            name="Onboarding"
            component={OnboardingNavigator}
            options={{ headerShown: false }}
            initialParams={{ initialRouteName: mapStepToScreen(step) }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
