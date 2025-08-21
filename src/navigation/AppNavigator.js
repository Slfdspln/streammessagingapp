import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';

// Auth Screens
import { LoginScreen } from '../screens/LoginScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { AuthLoadingScreen } from '../screens/AuthLoadingScreen';
import { SignOutScreen } from '../screens/SignOutScreen';

// App Screens
import { ChannelScreen } from '../screens/ChannelScreen';
import { NewConversationScreen } from '../screens/NewConversationScreen';

// Figma Screens
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
      <OnboardingStack.Screen name="Interests" component={InterestsScreen} />
    </OnboardingStack.Navigator>
  );
};

export const AppNavigator = () => {
  const { user, loading, isOnboarded } = useAuth();

  // Show loading screen while authentication state is being determined
  if (loading) {
    return <AuthLoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          // User is authenticated
          isOnboarded ? (
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
            // User needs to complete onboarding
            <Stack.Screen
              name="Onboarding"
              component={OnboardingNavigator}
              options={{ headerShown: false }}
            />
          )
        ) : (
          // Auth screens - user is not authenticated
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
