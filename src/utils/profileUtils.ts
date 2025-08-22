import { supabase } from './supabase';

export async function saveProfilePhotos(photoUrls: string[], userId: string) {
  const { error } = await supabase
    .from('profiles')
    .update({
      photos: photoUrls,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) throw error;
  return true;
}
