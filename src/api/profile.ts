import { supabase } from '../utils/supabase';
import { uploadPhotoToSupabase } from '../utils/uploadToSupabase';

/**
 * Upsert profile data to Supabase
 * @param patch Object containing profile fields to update
 * @returns Promise that resolves when the operation completes
 */
export async function upsertProfile(patch: Record<string, any>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in');
  
  const row = { 
    id: user.id, 
    ...patch, 
    updated_at: new Date().toISOString() 
  };
  
  const { error } = await supabase
    .from('profiles')
    .upsert(row, { onConflict: 'id' });
    
  if (error) throw error;
  return true;
}

/**
 * Save name to profile
 */
export const saveName = async (firstName: string, lastName: string) => 
  upsertProfile({ first_name: firstName, last_name: lastName });

/**
 * Save basics (birthdate, location) to profile
 */
export const saveBasics = async (data: { 
  birthdate?: string; 
  city?: string;
  gender?: string;
  show_gender?: boolean;
}) => upsertProfile(data);

/**
 * Upload photos and save URLs to profile
 */
export const savePhotos = async (photoFiles: Array<{uri: string; name: string; type: string}>) => {
  const photoUrls: string[] = [];
  
  for (const photoFile of photoFiles) {
    const publicUrl = await uploadPhotoToSupabase(photoFile);
    photoUrls.push(publicUrl);
  }
  
  return upsertProfile({ photos: photoUrls });
};

/**
 * Save photo URLs directly to profile (when already uploaded)
 */
export const savePhotoUrls = async (photoUrls: string[]) => 
  upsertProfile({ photos: photoUrls });

/**
 * Save interests to profile
 */
export const saveInterests = async (interests: string[]) => 
  upsertProfile({ interests });

/**
 * Mark onboarding as complete
 */
export const markOnboardingComplete = async () => 
  upsertProfile({ onboarding_completed: true });

/**
 * Get current profile data
 */
export const getProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
    
  if (error) throw error;
  return data;
};
