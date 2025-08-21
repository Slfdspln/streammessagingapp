import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useChannelContext } from 'stream-chat-react-native';
import LinearGradient from 'react-native-linear-gradient';
import dayjs from 'dayjs';

const CustomChatHeader = ({ onBackPress }) => {
  const { channel } = useChannelContext();

  // Get the other user in a 1-on-1 channel
  const members = Object.values(channel.state.members);
  const otherUser = members.find(m => m.user.id !== channel.client.userID)?.user;

  const isOnline = otherUser?.online;
  const lastActive = otherUser?.last_active ? dayjs(otherUser.last_active) : null;
  const activeRecently = !isOnline && lastActive && dayjs().diff(lastActive, 'minute') <= 30;

  const renderStatusDot = () => {
    if (isOnline) {
      return <View style={[styles.statusDot, { backgroundColor: '#4CAF50' }]} />;
    }
    if (activeRecently) {
      return (
        <LinearGradient
          colors={['#4CAF50', '#888']} // Green to gray
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.statusDot}
        />
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={onBackPress}>
        <Text style={styles.backText}>‹</Text>
      </TouchableOpacity>

      {/* Avatar + Dot */}
      <View style={styles.avatarWrapper}>
        {otherUser?.image && <Image source={{ uri: otherUser.image }} style={styles.avatar} />}
        {(isOnline || activeRecently) && <View style={styles.onlineDot}>{renderStatusDot()}</View>}
      </View>

      {/* Name + Status */}
      <View>
        <Text style={styles.name}>{otherUser?.name || 'Unknown User'}</Text>
        <Text style={styles.status}>
          {isOnline ? 'Online' : activeRecently ? 'Active recently' : 'Offline'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#007bff',
  },
  backText: {
    color: 'white',
    fontSize: 28,
    marginRight: 10,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#007bff',
    overflow: 'hidden',
  },
  statusDot: {
    flex: 1,
    borderRadius: 6,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  status: {
    fontSize: 12,
    color: 'white',
    opacity: 0.8,
  },
});

export default CustomChatHeader;
