import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Alert } from 'react-native';
import { supabase } from './supabase';

/**
 * Request media library permissions
 * @returns {Promise<boolean>} True if permission granted
 */
export const requestMediaPerms = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert(
      'Permission Required',
      'Please grant camera roll permissions to add photos.',
      [{ text: 'OK' }]
    );
    return false;
  }
  return true;
};

/**
 * Request camera permissions
 * @returns {Promise<boolean>} True if permission granted
 */
export const requestCameraPerms = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert(
      'Permission Required',
      'Please grant camera permissions to take photos.',
      [{ text: 'OK' }]
    );
    return false;
  }
  return true;
};

/**
 * Pick profile photos from the device library
 * @param {Object} options - Options for the picker
 * @param {number} options.selectionLimit - Maximum number of photos to select
 * @returns {Promise<Array>} Array of processed photo objects
 */
export async function pickProfilePhotos(options = {}) {
  try {
    const hasPermission = await requestMediaPerms();
    if (!hasPermission) return [];

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: options.selectionLimit || 5,
      allowsEditing: false,
      base64: false,           // Keep false to avoid memory issues
      quality: 1,              // We'll compress manually below
      exif: false,
    });

    if (result.canceled) return [];
    const assets = result.assets ?? [];
    if (!assets.length) return [];

    // Resize/compress to keep files small (<2–3 MB)
    const processed = [];
    for (const asset of assets) {
      const result = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: 1080 } }],         // Scale down; keeps aspect
        { compress: 0.85, format: ImageManipulator.SaveFormat.JPEG }
      );
      processed.push({
        uri: result.uri,
        name: asset.fileName ?? `photo_${Date.now()}.jpg`,
        type: 'image/jpeg',
      });
    }
    return processed;
  } catch (error) {
    console.error('Error picking images:', error);
    Alert.alert('Error', 'Failed to select images. Please try again.');
    return [];
  }
}

/**
 * Take a photo with the device camera
 * @returns {Promise<Object|null>} Processed photo object or null
 */
export async function takeProfilePhoto() {
  try {
    const hasPermission = await requestCameraPerms();
    if (!hasPermission) return null;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      base64: false,
      quality: 1,
      exif: false,
    });

    if (result.canceled || !result.assets || !result.assets.length) return null;
    
    const asset = result.assets[0];
    
    // Resize/compress the photo
    const processed = await ImageManipulator.manipulateAsync(
      asset.uri,
      [{ resize: { width: 1080 } }],
      { compress: 0.85, format: ImageManipulator.SaveFormat.JPEG }
    );
    
    return {
      uri: processed.uri,
      name: `camera_${Date.now()}.jpg`,
      type: 'image/jpeg',
    };
  } catch (error) {
    console.error('Error taking photo:', error);
    Alert.alert('Error', 'Failed to take photo. Please try again.');
    return null;
  }
}

/**
 * Upload a photo to Supabase Storage
 * @param {Object} file - File object with uri, name, and type
 * @returns {Promise<string>} Public URL of the uploaded file
 */
export async function uploadPhotoToSupabase(file) {
  try {
    if (!file || !file.uri) {
      throw new Error('Invalid file object');
    }
    
    const blob = await fetch(file.uri).then(r => r.blob());
    const path = `profiles/${Date.now()}_${file.name}`;

    const { error } = await supabase
      .storage
      .from('profile-photos')
      .upload(path, blob, { contentType: file.type, upsert: true });

    if (error) throw error;

    const { data } = supabase.storage.from('profile-photos').getPublicUrl(path);
    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw error;
  }
}

/**
 * Save profile photo URLs to user profile
 * @param {string[]} photoUrls - Array of photo URLs
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
export async function saveProfilePhotos(photoUrls, userId) {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    const { error } = await supabase
      .from('profiles')
      .update({ 
        photos: photoUrls,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
      
    if (error) throw error;
  } catch (error) {
    console.error('Error saving profile photos:', error);
    throw error;
  }
}
