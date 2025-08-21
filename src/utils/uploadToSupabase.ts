import { supabase } from './supabase';
import { STORAGE_BUCKET } from './config';

export async function uploadPhotoToSupabase(file: {uri:string; name:string; type:string}) {
  // Convert file URI to blob
  const blob = await fetch(file.uri).then(r => r.blob());
  const path = `profiles/${Date.now()}_${file.name}`;

  const { error } = await supabase
    .storage
    .from(STORAGE_BUCKET)
    .upload(path, blob, { contentType: file.type, upsert: true });

  if (error) throw error;

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl; // or get a signed URL if your bucket is private
}
