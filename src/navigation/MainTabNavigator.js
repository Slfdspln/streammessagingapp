import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity } from 'react-native';
import { ChannelListScreen } from '../screens/ChannelListScreen';
import DiscoverScreen from '../screens/DiscoverScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Chats') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Discover') {
            iconName = focused ? 'people' : 'people-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#006CFF',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#006AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Chats" 
        component={ChannelListScreen} 
        options={({ navigation }) => ({
          headerTitle: 'Conversations',
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => navigation.navigate('SignOut')}
              style={{ marginRight: 15 }}
            >
              <Ionicons name="log-out-outline" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        })}
      />
      <Tab.Screen 
        name="Discover" 
        component={DiscoverScreen} 
        options={{ headerTitle: 'Discover Users' }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
