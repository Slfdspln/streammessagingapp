import React, { useEffect, useState } from 'react';
import { Channel, MessageList, MessageInput, useChatContext } from 'stream-chat-react-native';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

// Import only the custom message component
import { CustomMessage } from '../components/CustomMessage';

// This screen component is responsible for displaying the messages for a single channel.
export const ChannelScreen = ({ route }) => {
  const { channelId } = route.params;
  const { client } = useChatContext();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the channel by ID when the component mounts
  useEffect(() => {
    const fetchChannel = async () => {
      try {
        // Get channel from client using the ID
        const channelResponse = client.channel('messaging', channelId);
        await channelResponse.watch();
        setChannel(channelResponse);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching channel:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchChannel();
  }, [channelId, client]);

  // Show loading state
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6B81" />
        <Text style={styles.loadingText}>Loading conversation...</Text>
      </View>
    );
  }

  // Show error state
  if (error || !channel) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error loading conversation</Text>
        <Text>{error}</Text>
      </View>
    );
  }

  // Show the channel when loaded
  return (
    <Channel channel={channel}>
      {/* We are still using our custom message bubble */}
      <MessageList 
        MessageSimple={CustomMessage} 
      />
      
      {/* Use the standard MessageInput component from Stream with keyboard settings */}
      <MessageInput
        additionalTextInputProps={{
          autoFocus: true,
          blurOnSubmit: false,
          keyboardAppearance: 'light',
        }}
      />
    </Channel>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: '#FF6B81',
    marginBottom: 10,
  },
});
