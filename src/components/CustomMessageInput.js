import React, { useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {
  useMessageInputContext,
  MessageInput,
  FileUploadPreview,
  ImageUploadPreview,
} from 'stream-chat-react-native';
import { Ionicons } from '@expo/vector-icons';

// This is our custom component for the message input bar styled like iOS Messages.
export const CustomMessageInput = () => {
  // Create a custom Input component that will be used by MessageInput
  const CustomInputComponent = () => {
    const {
      sendMessage,
      text,
      imageUploads,
      fileUploads,
      onChange,
      additionalTextInputProps,
      resetInput,
    } = useMessageInputContext();

    // Create a ref for the text input to auto-focus
    const inputRef = useRef(null);

    // Auto-focus the input when the component mounts
    useEffect(() => {
      // Short delay to ensure the keyboard shows up properly
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 300);

      return () => clearTimeout(timer);
    }, []);

    // Function to handle sending messages with proper Stream integration
    const handleSendMessage = async () => {
      try {
        if (!text) return;

        console.log('Attempting to send message:', text);

        // Use Stream's sendMessage function for proper backend integration
        const result = await sendMessage();
        console.log('Message sent successfully:', result);

        // Reset the input after sending
        resetInput();

        // Force keyboard to stay open after sending
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 100);
      } catch (error) {
        console.error('Error sending message:', error);
        alert('Failed to send message. Please try again.');
      }
    };

    // Check if the send button should be enabled
    const isDisabled = !text && !imageUploads?.length && !fileUploads?.length;

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.container}>
          {/* Display file uploads if any */}
          {fileUploads?.length > 0 && <FileUploadPreview />}

          {/* Display image uploads if any */}
          {imageUploads?.length > 0 && <ImageUploadPreview />}

          <View style={styles.inputRow}>
            {/* Camera button */}
            <TouchableOpacity style={styles.attachButton}>
              <Ionicons name="camera-outline" size={24} color="#007AFF" />
            </TouchableOpacity>

            {/* Message input field - using native TextInput for better control */}
            <View style={styles.inputContainer}>
              <TextInput
                ref={inputRef}
                value={text}
                onChangeText={onChange}
                placeholder="iMessage"
                placeholderTextColor="#8E8E93"
                multiline
                style={styles.inputField}
                maxHeight={100}
                returnKeyType="default"
                keyboardAppearance="light"
                autoCorrect={true}
                spellCheck={true}
                autoCapitalize="sentences"
                {...additionalTextInputProps}
              />
            </View>

            {/* Send button - iOS style with proper Stream integration */}
            <TouchableOpacity
              activeOpacity={0.7}
              disabled={isDisabled}
              onPress={() => {
                if (!isDisabled) {
                  console.log('Sending message:', text);
                  handleSendMessage();
                }
              }}
              style={[styles.sendButton, isDisabled && styles.disabledSendButton]}
            >
              <View style={[styles.sendButtonContainer, !isDisabled && styles.activeSendButton]}>
                <Ionicons name="arrow-up" size={20} color={isDisabled ? '#C7C7CC' : '#FFFFFF'} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  };

  // Return the MessageInput component with our custom Input component
  return (
    <MessageInput
      Input={CustomInputComponent}
      // Ensure we're using the default handlers from Stream
      doSendMessageRequest={async (channelId, message) => {
        try {
          console.log('Sending message to channel:', channelId, message);
          return message;
        } catch (error) {
          console.error('Error in doSendMessageRequest:', error);
          throw error;
        }
      }}
    />
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    width: '100%',
  },
  container: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#F2F2F2', // iOS keyboard background color
    borderTopWidth: 0.5,
    borderTopColor: '#CCCCCC',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attachButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    borderWidth: 0,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 6,
    minHeight: 36,
    maxHeight: 100,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  inputField: {
    fontSize: 17, // iOS default font size
    color: '#000000',
    padding: 0,
    paddingTop: 0,
    paddingBottom: 0,
    minHeight: 20,
    maxHeight: 100,
    textAlignVertical: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  sendButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  sendButtonContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeSendButton: {
    backgroundColor: '#0056b3', // Darker blue for pressed state
    transform: [{ scale: 0.95 }], // Slight scale down for pressed effect
  },
  disabledSendButton: {
    opacity: 0.5,
  },
});
