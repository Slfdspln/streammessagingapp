import React from 'react';
import { Channel, MessageList, MessageInput } from 'stream-chat-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import only the custom message component
import { CustomMessage } from '../components/CustomMessage';

// This screen component is responsible for displaying the messages for a single channel.
export const ChannelScreen = ({ route }) => {
  const { channelId, channelName } = route.params;

  // Let the Stream SDK handle channel state and loading internally
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Channel channelId={channelId}>
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
    </SafeAreaView>
  );
};


