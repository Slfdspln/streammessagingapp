import React, { useEffect, useState } from 'react';
import { Channel, MessageList, MessageInput } from 'stream-chat-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

// Import auth context to get the Stream client
import { useAuth } from '../contexts/AuthContext';

// Import custom components
import { CustomMessage } from '../components/CustomMessage';
import CustomChatHeader from '../components/CustomChatHeader';

// This screen component is responsible for displaying the messages for a single channel.
export const ChannelScreen = ({ route, navigation }) => {
  const { channelId, channelName } = route.params;
  const { client } = useAuth();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the channel from the client using the channelId
    if (client && channelId) {
      const fetchChannel = async () => {
        try {
          const channel = client.channel('messaging', channelId);
          // Enable presence tracking for online status and last active times
          await channel.watch({ presence: true });
          setChannel(channel);
        } catch (error) {
          console.error('Error fetching channel:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchChannel();
    }
  }, [client, channelId]);

  if (loading || !channel) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#006AFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Channel
        channel={channel}
        Header={() => <CustomChatHeader onBackPress={() => navigation.goBack()} />}
      >
        {/* We are still using our custom message bubble */}
        <MessageList MessageSimple={CustomMessage} />

        {/* Use the standard MessageInput component from Stream with keyboard settings */}
        <MessageInput
          additionalTextInputProps={{
            autoFocus: true,
            blurOnSubmit: false,
            keyboardAppearance: 'light',
          }}
        />
      </Channel>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
