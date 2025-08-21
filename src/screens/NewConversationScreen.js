import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export const NewConversationScreen = ({ navigation }) => {
  const [channelName, setChannelName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { user, client } = useAuth();

  const handleCreateChannel = async () => {
    if (!channelName.trim()) {
      Alert.alert('Error', 'Please enter a conversation name');
      return;
    }

    setIsLoading(true);

    try {
      // Create a unique channel ID
      const channelId = `${user.id}-${Date.now()}`;

      // Create a new channel with just the current user
      const channel = client.channel('messaging', channelId, {
        name: channelName,
        members: [user.id],
        created_by_id: user.id,
      });

      await channel.create();

      // Navigate to the new channel
      navigation.navigate('ChannelScreen', {
        channelId: channel.id,
        channelName: channel.data.name,
      });
    } catch (error) {
      console.error('Error creating channel:', error);
      Alert.alert('Error', 'Failed to create conversation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>New Conversation</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Conversation Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter a name for this conversation"
            value={channelName}
            onChangeText={setChannelName}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleCreateChannel} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Conversation</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    height: 50,
    backgroundColor: '#006AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
