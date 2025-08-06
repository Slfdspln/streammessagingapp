import React, { useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import { ChannelList } from 'stream-chat-react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { CustomChannelPreview } from '../components/CustomChannelPreview';

// This screen component is responsible for displaying the list of conversations.
export const ChannelListScreen = ({ navigation }) => {
  const { user, streamClient, signOut } = useAuth();

  // Handle channel selection - this will be passed to the ChannelList
  const handleChannelSelect = useCallback(
    (channel) => {
      if (channel?.id) {
        console.log('Channel selected:', channel.id);
        navigation.navigate('ChannelScreen', { 
          channelId: channel.id,
          channelName: channel.data?.name || 'Chat'
        });
      } else {
        console.error('No channel id available');
      }
    },
    [navigation]
  );
  
  // Function to handle creating a new conversation
  const handleNewConversation = () => {
    navigation.navigate('NewConversation');
  };
  
  // Function to handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, {user?.email || 'User'}</Text>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
      
      <ChannelList
        filters={{
          members: { $in: [user?.id] },
          type: 'messaging',
        }}
        sort={{ last_message_at: -1 }}
        Preview={CustomChannelPreview}
        onSelect={handleChannelSelect}
      />
      
      <TouchableOpacity 
        style={styles.newConversationButton}
        onPress={handleNewConversation}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  welcomeText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  signOutButton: {
    padding: 8,
  },
  signOutText: {
    color: '#006AFF',
    fontWeight: '600',
  },
  newConversationButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#006AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
