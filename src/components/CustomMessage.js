import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useMessageContext } from 'stream-chat-react-native';

// This is our custom component to render a single message.
export const CustomMessage = () => {
  // The useMessageContext hook gives us access to all the message data
  const { message, isMyMessage } = useMessageContext();

  return (
    <View
      style={[
        styles.container,
        // Apply different styles if the message is ours or theirs
        isMyMessage ? styles.myMessageContainer : styles.theirMessageContainer,
      ]}
    >
      <Text style={isMyMessage ? styles.myMessageText : styles.theirMessageText}>
        {message.text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 5,
    maxWidth: '80%',
  },
  myMessageContainer: {
    backgroundColor: '#FF6B81', // Our custom rose color
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5, // iMessage-style tail
  },
  theirMessageContainer: {
    backgroundColor: '#F5F5F5', // Our custom light grey color
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 5, // iMessage-style tail
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  theirMessageText: {
    color: '#2E2E2E',
  },
});
