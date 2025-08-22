import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar } from 'stream-chat-react-native';
import { useNavigation } from '@react-navigation/native';

// This is our custom component to render a single conversation preview in the list.
export const CustomChannelPreview = props => {
  // Props directly provided by ChannelList when used as Preview
  const { channel, latestMessagePreview } = props;

  // Get navigation directly
  const navigation = useNavigation();

  // Make the entire component clickable
  const handlePress = () => {
    console.log('Channel pressed:', channel.id);

    // Navigate directly without relying on onSelect
    navigation.navigate('ChannelScreen', { channelId: channel.id });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      {/* The Avatar component is a pre-built component from Stream */}
      <Avatar
        image={channel.data.image || undefined}
        name={
          channel.data.name ||
          Object.values(channel.state.members)
            .map(m => m.user.name)
            .join(', ')
        }
        size={60}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {/* If the channel has a name, use it, otherwise show member names */}
          {channel.data.name ||
            Object.values(channel.state.members)
              .map(m => m.user.name)
              .join(', ')}
        </Text>
        <Text style={styles.preview} numberOfLines={1}>
          {latestMessagePreview?.messageObject?.text ?? 'No messages yet'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5', // Our light grey color
    backgroundColor: 'white', // Add background color to show it's touchable
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2E2E2E', // Our soft black color
    marginBottom: 3,
  },
  preview: {
    fontSize: 14,
    color: '#8A8A8A', // A muted grey for the preview text
  },
});
