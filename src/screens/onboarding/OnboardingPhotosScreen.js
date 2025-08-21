import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { pickProfilePhotos } from '../../utils/pickImages';
import { uploadPhotoToSupabase } from '../../utils/uploadToSupabase';
import { saveProfilePhotos } from '../../utils/profileUtils';
import { supabase } from '../../utils/supabase';

const OnboardingPhotosScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [photos, setPhotos] = useState(onboardingData.photos || []);
  const [uploading, setUploading] = useState(false);

  const MAX_PHOTOS = 6;

  const pickImage = async index => {
    try {
      // Use our hardened photo picker function
      const selectedPhotos = await pickProfilePhotos();
      
      if (selectedPhotos.length === 0) return;
      
      const selectedPhoto = selectedPhotos[0];
      
      // If replacing an existing photo
      if (index !== undefined && index < photos.length) {
        const newPhotos = [...photos];
        newPhotos[index] = selectedPhoto.uri;
        setPhotos(newPhotos);
      } else {
        // Adding a new photo
        if (photos.length >= MAX_PHOTOS) {
          Alert.alert('Maximum Photos', `You can only add up to ${MAX_PHOTOS} photos.`);
          return;
        }
        setPhotos([...photos, selectedPhoto.uri]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const removePhoto = index => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };

  const handleContinue = async () => {
    if (photos.length < 1) {
      Alert.alert('Add Photos', 'Please add at least one photo to continue.');
      return;
    }

    // Save photos to context and upload to Supabase Storage
    setUploading(true);

    try {
      // First save to context (temporary storage while completing onboarding)
      updateOnboardingData({ photos });
      
      const photoUrls = [];
      
      // Convert local URIs to file objects for upload
      const photoFiles = photos.map((uri, index) => ({
        uri,
        name: `photo_${index}_${Date.now()}.jpg`,
        type: 'image/jpeg'
      }));
      
      // Upload each photo to Supabase Storage
      for (const photoFile of photoFiles) {
        const publicUrl = await uploadPhotoToSupabase(photoFile);
        photoUrls.push(publicUrl);
      }
      
      // Save the public URLs to the user's profile
      if (user?.id && photoUrls.length > 0) {
        await saveProfilePhotos(photoUrls, user.id);
      }

      // Navigate to next screen
      navigation.navigate('Interests');
    } catch (error) {
      console.error('Error saving photos:', error);
      Alert.alert('Error', 'Failed to save photos. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const renderPhotoSlots = () => {
    const slots = [];

    // Render existing photos
    for (let i = 0; i < photos.length; i++) {
      slots.push(
        <View key={`photo-${i}`} style={styles.photoContainer}>
          <Image 
            source={{ uri: photos[i] }} 
            style={styles.photo} 
            resizeMode="cover"
          />
          <TouchableOpacity style={styles.editButton} onPress={() => pickImage(i)}>
            <MaterialIcons name="edit" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.removeButton} onPress={() => removePhoto(i)}>
            <MaterialIcons name="close" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      );
    }

    // Render empty slots
    if (photos.length < MAX_PHOTOS) {
      slots.push(
        <TouchableOpacity
          key="add-photo"
          style={styles.addPhotoContainer}
          onPress={() => pickImage()}
        >
          <MaterialIcons name="add-photo-alternate" size={32} color="#FF4B7F" />
          <Text style={styles.addPhotoText}>Add Photo</Text>
        </TouchableOpacity>
      );

      // Add remaining empty slots
      for (let i = photos.length + 1; i < MAX_PHOTOS; i++) {
        slots.push(
          <View key={`empty-${i}`} style={styles.emptyPhotoContainer}>
            <MaterialIcons name="photo" size={32} color="#E0E0E0" />
          </View>
        );
      }
    }

    return slots;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color="#000" />
          </TouchableOpacity>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progress, { width: '75%' }]} />
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Add your best photos</Text>
          <Text style={styles.subtitle}>
            Add at least 1 photo to continue. You can add up to 6 photos.
          </Text>

          <View style={styles.photosGrid}>{renderPhotoSlots()}</View>

          <Text style={styles.tip}>
            Tip: Photos where your face is clearly visible tend to get more matches!
          </Text>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={[styles.buttonContainer, { paddingBottom: insets.bottom || 16 }]}>
        <TouchableOpacity
          style={[styles.continueButton, (photos.length < 1 || uploading) && styles.disabledButton]}
          onPress={handleContinue}
          disabled={photos.length < 1 || uploading}
        >
          <LinearGradient
            colors={photos.length >= 1 ? ['#FF655B', '#FF5864', '#FD297B'] : ['#cccccc', '#bbbbbb']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {uploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Continue</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  progressContainer: {
    flex: 1,
    marginLeft: 16,
    marginRight: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
  },
  progress: {
    height: '100%',
    backgroundColor: '#FF4B7F',
    borderRadius: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  photoContainer: {
    width: '48%',
    aspectRatio: 0.8,
    borderRadius: 12,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  editButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoContainer: {
    width: '48%',
    aspectRatio: 0.8,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FF4B7F',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    color: '#FF4B7F',
    marginTop: 8,
    fontWeight: '500',
  },
  emptyPhotoContainer: {
    width: '48%',
    aspectRatio: 0.8,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tip: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  continueButton: {
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
  },
  disabledButton: {
    opacity: 0.7,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default OnboardingPhotosScreen;
