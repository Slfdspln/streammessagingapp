import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PhotoOptionsSection = () => {
  const [photos, setPhotos] = useState([
    { id: '1', uri: null },
    { id: '2', uri: null },
    { id: '3', uri: null },
    { id: '4', uri: null },
    { id: '5', uri: null },
    { id: '6', uri: null },
  ]);

  const handleAddPhoto = id => {
    // In a real app, this would open the image picker
    console.log(`Add photo to slot ${id}`);

    // For demo purposes, let's simulate adding a photo
    const updatedPhotos = photos.map(photo =>
      photo.id === id
        ? {
            ...photo,
            uri:
              'https://randomuser.me/api/portraits/men/' + Math.floor(Math.random() * 100) + '.jpg',
          }
        : photo
    );

    setPhotos(updatedPhotos);
  };

  const handleRemovePhoto = id => {
    const updatedPhotos = photos.map(photo => (photo.id === id ? { ...photo, uri: null } : photo));

    setPhotos(updatedPhotos);
  };

  const renderPhotoItem = ({ item }) => (
    <View style={styles.photoContainer}>
      {item.uri ? (
        <View style={styles.photoWrapper}>
          <Image source={{ uri: item.uri }} style={styles.photo} />
          <TouchableOpacity style={styles.removeButton} onPress={() => handleRemovePhoto(item.id)}>
            <Ionicons name="close-circle" size={24} color="#FF5864" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.addPhotoButton} onPress={() => handleAddPhoto(item.id)}>
          <Ionicons name="add" size={40} color="#999" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>PHOTOS</Text>

      <View style={styles.photoGrid}>
        <FlatList
          data={photos}
          renderItem={renderPhotoItem}
          keyExtractor={item => item.id}
          numColumns={3}
          scrollEnabled={false}
        />
      </View>

      <View style={styles.infoContainer}>
        <Ionicons name="information-circle-outline" size={20} color="#666" />
        <Text style={styles.infoText}>
          Add at least 2 photos to continue. Photos with your face clearly visible get more matches.
        </Text>
      </View>

      <TouchableOpacity style={styles.smartPhotoOption}>
        <View style={styles.smartPhotoLeft}>
          <Ionicons name="sparkles" size={20} color="#FF5864" style={styles.icon} />
          <View>
            <Text style={styles.smartPhotoTitle}>Smart Photos</Text>
            <Text style={styles.smartPhotoDescription}>
              Automatically choose your best photo first
            </Text>
          </View>
        </View>
        <Switch
          trackColor={{ false: '#DDDDDD', true: '#FF5864' }}
          thumbColor={'#FFFFFF'}
          ios_backgroundColor="#DDDDDD"
          value={true}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 8,
    borderBottomColor: '#F5F5F5',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  photoGrid: {
    marginBottom: 16,
  },
  photoContainer: {
    width: '33.33%',
    aspectRatio: 1,
    padding: 4,
  },
  photoWrapper: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  addPhotoButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderStyle: 'dashed',
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'white',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  smartPhotoOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  smartPhotoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  smartPhotoTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  smartPhotoDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});

export default PhotoOptionsSection;
