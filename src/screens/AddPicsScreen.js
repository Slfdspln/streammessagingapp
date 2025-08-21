import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import LinearGradient from 'react-native-linear-gradient';
import BottomStickyCTA from '../components/BottomStickyCTA';

const { width } = Dimensions.get('window');
const itemWidth = (width - 60) / 3;

const AddPicsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [selectedPics, setSelectedPics] = useState([
    { id: 1, uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330', selected: true },
    { id: 2, uri: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d', selected: true },
    { id: 3, uri: null, selected: false },
    { id: 4, uri: null, selected: false },
    { id: 5, uri: null, selected: false },
    { id: 6, uri: null, selected: false },
  ]);

  const handleRemovePic = id => {
    setSelectedPics(
      selectedPics.map(pic => (pic.id === id ? { ...pic, uri: null, selected: false } : pic))
    );
  };

  const handleAddPic = id => {
    // In a real app, this would open the image picker
    console.log('Add pic for id:', id);
  };

  const renderPicItem = item => {
    if (item.uri) {
      return (
        <View style={styles.picContainer} key={item.id}>
          <Image source={{ uri: item.uri }} style={styles.picImage} />
          <TouchableOpacity style={styles.removeButton} onPress={() => handleRemovePic(item.id)}>
            <Ionicons name="close" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <TouchableOpacity
          style={styles.emptyPicContainer}
          key={item.id}
          onPress={() => handleAddPic(item.id)}
        >
          <Ionicons name="add" size={30} color="#FF4B7F" />
        </TouchableOpacity>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top gradient bar */}
      <LinearGradient
        colors={['#FF655B', '#FF5864', '#FD297B']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />

      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back" size={28} color="#000" />
      </TouchableOpacity>

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          paddingBottom: 100, // Increased padding to account for bottom CTA
        }}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
      >
        {/* Title */}
        <Text style={styles.title}>Add your recent pics</Text>

        {/* Grid of pics */}
        <View style={styles.picsGrid}>{selectedPics.map(item => renderPicItem(item))}</View>

        {/* Pro tip */}
        <View style={styles.proTipContainer}>
          <View style={styles.proTipIconContainer}>
            <Text style={styles.proTipCount}>2 / 6</Text>
          </View>
          <Text style={styles.proTipText}>
            Pro tip: 4+ pics increases your chances of getting Liked.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom CTA using the new component */}
      <BottomStickyCTA label="Next" onPress={() => navigation.navigate('LifestyleQuestions')} />

      {/* Bottom indicator */}
      <View style={[styles.bottomIndicator, { marginBottom: insets.bottom }]} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerGradient: {
    height: 4,
    width: '100%',
    position: 'absolute',
    top: 0,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 15,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 100,
    marginLeft: 20,
    marginBottom: 30,
  },
  picsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  picContainer: {
    width: itemWidth,
    height: itemWidth,
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  picImage: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'white',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyPicContainer: {
    width: itemWidth,
    height: itemWidth,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  proTipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    marginLeft: 20,
  },
  proTipIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#FF4B7F',
  },
  proTipCount: {
    color: '#FF4B7F',
    fontWeight: 'bold',
  },
  proTipText: {
    color: '#666',
    fontSize: 16,
    flex: 1,
    paddingRight: 20,
  },
  // Bottom button styles removed as we're using BottomStickyCTA component
  bottomIndicator: {
    width: 60,
    height: 5,
    backgroundColor: '#000',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
});

export default AddPicsScreen;
