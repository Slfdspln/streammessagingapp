import React from 'react';
import { View, Image, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const SwipeCard = ({ imageUri, name, age, distance }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />

      {/* Gradient overlay at the bottom for text visibility */}
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.gradient}>
        <View style={styles.infoContainer}>
          <Text style={styles.nameText}>
            {name}, {age}
          </Text>
          <Text style={styles.distanceText}>{distance} miles away</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.9,
    height: height * 0.7,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '30%',
    justifyContent: 'flex-end',
    padding: 20,
  },
  infoContainer: {
    marginBottom: 20,
  },
  nameText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  distanceText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 5,
  },
});

export default SwipeCard;
