import { supabase } from './supabase';
import { STORAGE_BUCKET } from './config';
import { Alert } from 'react-native';

/**
 * Test function to verify Supabase Storage upload functionality
 * @param {string} uri - Local image URI to test upload
 */
export async function testStorageUpload(uri) {
  try {
    const bucket = STORAGE_BUCKET;
    const file = { 
      uri, 
      name: `test_${Date.now()}.jpg`, 
      type: 'image/jpeg' 
    };
    
    console.log(`Testing upload to bucket: ${bucket}`);
    
    // Convert file URI to blob
    const blob = await fetch(file.uri).then(r => r.blob());
    const path = `profiles/test_${Date.now()}_${file.name}`;

    console.log(`Uploading to path: ${path}`);
    
    const { error: upErr } = await supabase.storage.from(bucket)
      .upload(path, blob, { contentType: file.type, upsert: true });
      
    if (upErr) {
      console.error('Upload error:', upErr);
      Alert.alert('Upload Error', `Failed to upload: ${upErr.message}`);
      return null;
    }

    const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
    console.log('Uploaded URL:', pub.publicUrl);
    Alert.alert('Upload Success', `File uploaded to: ${pub.publicUrl}`);
    
    return pub.publicUrl;
  } catch (e) {
    console.error('Upload test failed:', e);
    Alert.alert('Upload Test Failed', e.message || 'Unknown error');
    return null;
  }
}
