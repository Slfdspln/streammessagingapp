import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

const BottomStickyCTA: React.FC<Props> = ({ label, onPress, disabled = false }) => {
  const { bottom } = useSafeAreaInsets();
  const inset = Math.max(bottom, 16); // at least 16pt padding

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.container,
        {
          paddingBottom: inset, // <-- key: clears the home indicator
        },
      ]}
    >
      <Pressable
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [styles.button, { opacity: pressed ? 0.9 : 1 }]}
      >
        <LinearGradient
          colors={['#FF655B', '#FF5864', '#FD297B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <Text style={styles.buttonText}>{label}</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: 'transparent',
  },
  button: {
    borderRadius: 28,
    overflow: 'hidden',
  },
  gradient: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 17,
  },
});

export default BottomStickyCTA;
