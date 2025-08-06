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

export const AppNavigator = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <AuthLoadingScreen />;
  }
  
  return (
    <NavigationContainer>
      {user ? (
        <Stack.Navigator>
          <Stack.Screen 
            name="ChannelList" 
            component={ChannelListScreen} 
            options={{ 
              title: 'Conversations',
              headerStyle: {
                backgroundColor: '#006AFF',
              },
              headerTintColor: '#fff',
            }}
          />
          <Stack.Screen 
            name="ChannelScreen" 
            component={ChannelScreen} 
            options={({ route }) => ({ 
              title: route.params?.channelName || 'Chat',
              headerStyle: {
                backgroundColor: '#006AFF',
              },
              headerTintColor: '#fff',
            })}
          />
          <Stack.Screen 
            name="NewConversation" 
            component={NewConversationScreen} 
            options={{ 
              title: 'New Conversation',
              headerStyle: {
                backgroundColor: '#006AFF',
              },
              headerTintColor: '#fff',
            }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};
