import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';

// Auth Screens
import { LoginScreen } from '../screens/LoginScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { AuthLoadingScreen } from '../screens/AuthLoadingScreen';

// App Screens
import { ChannelListScreen } from '../screens/ChannelListScreen';
import { ChannelScreen } from '../screens/ChannelScreen';
import { NewConversationScreen } from '../screens/NewConversationScreen';

const Stack = createNativeStackNavigator();

// Common header styles for app screens
const appHeaderStyle = {
  headerStyle: {
    backgroundColor: '#006AFF',
  },
  headerTintColor: '#fff',
};

export const AppNavigator = () => {
  const { user, loading } = useAuth();
  
  // Show loading screen while authentication state is being determined
  if (loading) {
    return <AuthLoadingScreen />;
  }
  
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          // App screens - available after login
          <>
            <Stack.Screen 
              name="ChannelList" 
              component={ChannelListScreen} 
              options={{ 
                title: 'Conversations',
                ...appHeaderStyle
              }}
            />
            <Stack.Screen 
              name="ChannelScreen" 
              component={ChannelScreen} 
              options={({ route }) => ({ 
                title: route.params?.channelName || 'Chat',
                ...appHeaderStyle
              })}
            />
            <Stack.Screen 
              name="NewConversation" 
              component={NewConversationScreen} 
              options={{ 
                title: 'New Conversation',
                ...appHeaderStyle
              }}
            />
          </>
        ) : (
          // Auth screens
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="SignUp" 
              component={SignUpScreen} 
              options={{ headerShown: false }} 
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
