import React, { useState } from 'react';
import { View, StyleSheet, PanResponder, Animated, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import SwipeCard from '../components/SwipeCard';

// Sample data - replace with your actual data source
const DEMO_PROFILES = [
  {
    id: '1',
    name: 'Sarah',
    age: 28,
    distance: 3,
    imageUri:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
  },
  {
    id: '2',
    name: 'Michael',
    age: 32,
    distance: 5,
    imageUri:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
  },
  {
    id: '3',
    name: 'Jessica',
    age: 26,
    distance: 7,
    imageUri:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
  },
];

const SwipeScreen = () => {
  const [profiles, setProfiles] = useState(DEMO_PROFILES);
  const position = new Animated.ValueXY();
  const rotate = position.x.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: ['-30deg', '0deg', '30deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [25, 150],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-150, -25],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const nextCardOpacity = position.x.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: [1, 0.5, 1],
    extrapolate: 'clamp',
  });

  const nextCardScale = position.x.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: [1, 0.8, 1],
    extrapolate: 'clamp',
  });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > 120) {
        swipeRight();
      } else if (gesture.dx < -120) {
        swipeLeft();
      } else {
        resetPosition();
      }
    },
  });

  const swipeLeft = () => {
    Animated.timing(position, {
      toValue: { x: -500, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      handleSwipe();
    });
  };

  const swipeRight = () => {
    Animated.timing(position, {
      toValue: { x: 500, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      handleSwipe();
    });
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 4,
      useNativeDriver: false,
    }).start();
  };

  const handleSwipe = () => {
    position.setValue({ x: 0, y: 0 });
    setProfiles(currentProfiles => currentProfiles.slice(1));
  };

  const renderCards = () => {
    if (profiles.length === 0) {
      return (
        <View style={styles.noMoreCardsContainer}>
          <Text style={styles.noMoreCardsText}>No more profiles to show!</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={() => setProfiles(DEMO_PROFILES)}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return profiles
      .map((profile, index) => {
        if (index === 0) {
          return (
            <Animated.View
              key={profile.id}
              style={[
                styles.animatedCardContainer,
                {
                  transform: [
                    { translateX: position.x },
                    { translateY: position.y },
                    { rotate: rotate },
                  ],
                },
              ]}
              {...panResponder.panHandlers}
            >
              <Animated.View style={[styles.likeContainer, { opacity: likeOpacity }]}>
                <Text style={styles.likeText}>LIKE</Text>
              </Animated.View>
              <Animated.View style={[styles.nopeContainer, { opacity: nopeOpacity }]}>
                <Text style={styles.nopeText}>NOPE</Text>
              </Animated.View>
              <SwipeCard
                imageUri={profile.imageUri}
                name={profile.name}
                age={profile.age}
                distance={profile.distance}
              />
            </Animated.View>
          );
        }

        if (index === 1) {
          return (
            <Animated.View
              key={profile.id}
              style={[
                styles.animatedCardContainer,
                {
                  opacity: nextCardOpacity,
                  transform: [{ scale: nextCardScale }],
                },
              ]}
            >
              <SwipeCard
                imageUri={profile.imageUri}
                name={profile.name}
                age={profile.age}
                distance={profile.distance}
              />
            </Animated.View>
          );
        }

        return null;
      })
      .reverse();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
      </View>

      <View style={styles.cardContainer}>{renderCards()}</View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={swipeLeft}>
          <Ionicons name="close-circle" size={60} color="#FF4C68" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={swipeRight}>
          <Ionicons name="heart-circle" size={60} color="#4CD964" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedCardContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 15,
  },
  button: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeContainer: {
    position: 'absolute',
    top: 50,
    right: 40,
    zIndex: 1000,
    transform: [{ rotate: '30deg' }],
  },
  likeText: {
    borderWidth: 2,
    borderColor: '#4CD964',
    color: '#4CD964',
    fontSize: 32,
    fontWeight: 'bold',
    padding: 10,
    borderRadius: 10,
  },
  nopeContainer: {
    position: 'absolute',
    top: 50,
    left: 40,
    zIndex: 1000,
    transform: [{ rotate: '-30deg' }],
  },
  nopeText: {
    borderWidth: 2,
    borderColor: '#FF4C68',
    color: '#FF4C68',
    fontSize: 32,
    fontWeight: 'bold',
    padding: 10,
    borderRadius: 10,
  },
  noMoreCardsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMoreCardsText: {
    fontSize: 18,
    color: '#555',
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: '#006AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SwipeScreen;
