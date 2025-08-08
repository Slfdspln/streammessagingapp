import React, { useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import { ChannelList } from 'stream-chat-react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { CustomChannelPreview } from '../components/CustomChannelPreview';

// This screen component is responsible for displaying the list of conversations.
export const ChannelListScreen = ({ navigation }) => {
  const { user, client, signOut } = useAuth();

  // Handle channel selection - this will be passed to the ChannelList
  const handleChannelSelect = useCallback(
    channel => {
      if (channel?.id) {
        console.log('Channel selected:', channel.id);
        navigation.navigate('ChannelScreen', {
          channelId: channel.id,
          channelName: channel.data?.name || 'Chat',
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

  // Separator component for channel list items
  const ItemSeparator = () => <View style={styles.separator} />;

  // Empty state component for when there are no channels
  const EmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Ionicons name="chatbubble-outline" size={50} color="#ccc" />
      <Text style={styles.emptyStateTitle}>No conversations yet</Text>
      <Text style={styles.emptyStateText}>Start one by tapping the new message icon below!</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ChannelList
        filters={{
          members: { $in: [user?.id] },
          type: 'messaging',
        }}
        sort={{ last_message_at: -1 }}
        options={{
          // Enable presence tracking for online status and last active times
          presence: true,
          state: true,
          watch: true,
        }}
        Preview={CustomChannelPreview}
        onSelect={handleChannelSelect}
        ItemSeparatorComponent={ItemSeparator}
        EmptyStateIndicator={EmptyState}
      />

      <TouchableOpacity style={styles.newConversationButton} onPress={handleNewConversation}>
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
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginLeft: 80, // Indent it to align with the text
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 15,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    maxWidth: '80%',
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
