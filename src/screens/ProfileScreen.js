import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import BottomStickyCTA from '../components/BottomStickyCTA';

export const ProfileScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    bio: '',
    looking_for: '',
    location: '',
    birthdate: '',
    gender: '',
    interests: [],
    avatar_url: '',
  });

  // Fetch user profile data from Supabase
  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const createInitialProfile = async () => {
    try {
      // Get user metadata from auth
      const { data: userData } = await supabase.auth.getUser();

      // Create initial profile with basic info
      const initialProfile = {
        id: user.id,
        name:
          userData?.user?.user_metadata?.full_name || userData?.user?.email?.split('@')[0] || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        bio: '',
        age: null,
        looking_for: '',
        location: '',
        birthdate: '',
        gender: '',
        interests: [],
        avatar_url: '',
      };

      console.log('Creating initial profile with data:', initialProfile);

      const { data, error } = await supabase.from('profiles').upsert(initialProfile).select();

      if (error) {
        console.error('Error creating initial profile:', error);
        return;
      }

      console.log('Profile created successfully:', data);

      // Set the profile state with initial values
      setProfile({
        name: initialProfile.name,
        age: '',
        bio: '',
        looking_for: '',
        location: '',
        birthdate: '',
        gender: '',
        interests: [],
        avatar_url: '',
      });

      console.log('Created initial profile');
    } catch (error) {
      console.error('Error in createInitialProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);

      // Check if we have a user object with an ID
      if (!user || !user.id) {
        console.log('No user ID available, using fallback profile');
        setProfile({
          name: 'Demo User',
          age: '25',
          bio: 'This is a demo profile while we connect to the database.',
          looking_for: 'Chatting',
          location: 'App World',
          birthdate: '2000-01-01',
          gender: '',
          interests: [],
          avatar_url: '',
        });
        setLoading(false);
        return;
      }

      // Fetch profile data from profiles table
      const response = await supabase.from('profiles').select('*').eq('id', user.id).single();

      // VITAL CHECK: Handle errors or no data found
      if (response.error) {
        console.error('Error fetching profile:', response.error);

        // If the profile doesn't exist, create a new one
        if (response.error.code === 'PGRST116') {
          // PostgreSQL error for 'no rows returned'
          await createInitialProfile();
          return;
        }

        // For other errors, use a fallback profile
        setProfile({
          name: user.email?.split('@')[0] || 'User',
          age: '',
          bio: 'Profile information will be available once connected.',
          looking_for: '',
          location: '',
          birthdate: '',
          gender: '',
          interests: [],
          avatar_url: '',
        });
        return;
      }

      // Check if data exists before trying to access it
      if (!response.data) {
        console.error('No profile data returned from Supabase');
        await createInitialProfile();
        return;
      }

      // Data exists and is safe to use
      const data = response.data;
      console.log('Profile data fetched successfully:', data);

      setProfile({
        name: data.name || '',
        age: data.age ? data.age.toString() : '',
        bio: data.bio || '',
        looking_for: data.looking_for || '',
        location: data.location || '',
        birthdate: data.birthdate || '',
        gender: data.gender || '',
        interests: Array.isArray(data.interests) ? data.interests : [],
        avatar_url: data.avatar_url || '',
      });
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      // Provide a fallback profile for any unexpected errors
      setProfile({
        name: user?.email?.split('@')[0] || 'User',
        age: '',
        bio: 'An error occurred while loading your profile.',
        looking_for: '',
        location: '',
        birthdate: '',
        gender: '',
        interests: [],
        avatar_url: '',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      // Client-side validation for required fields
      if (!profile.name || profile.name.trim() === '') {
        Alert.alert('Incomplete Profile', 'Please enter your name to continue.');
        return;
      }

      if (!profile.birthdate || profile.birthdate.trim() === '') {
        Alert.alert('Incomplete Profile', 'Please enter your date of birth to continue.');
        return;
      }

      if (!profile.bio || profile.bio.trim() === '') {
        Alert.alert('Incomplete Profile', 'Please enter a short bio to continue.');
        return;
      }

      // Validate birthdate format (YYYY-MM-DD)
      const birthdateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!birthdateRegex.test(profile.birthdate)) {
        Alert.alert('Invalid Format', 'Please enter your date of birth in YYYY-MM-DD format.');
        return;
      }

      setUpdating(true);

      // Prepare profile data for update
      const profileData = {
        id: user.id,
        name: profile.name.trim(),
        age: profile.age ? parseInt(profile.age) : null,
        bio: profile.bio.trim(),
        looking_for: profile.looking_for.trim(),
        location: profile.location.trim(),
        birthdate: profile.birthdate.trim(),
        gender: profile.gender.trim(),
        interests: Array.isArray(profile.interests) ? profile.interests : [],
        avatar_url: profile.avatar_url ? profile.avatar_url.trim() : '',
        updated_at: new Date().toISOString(),
      };

      console.log('Updating profile with data:', profileData);

      // Use upsert with select to get the updated data back
      const { data, error } = await supabase.from('profiles').upsert(profileData).select();

      if (error) {
        Alert.alert('Error', 'Failed to update profile');
        console.error('Error updating profile:', error);
        return;
      }

      console.log('Profile updated successfully:', data);

      // Verify the update was successful by fetching the profile again
      await fetchProfile();

      Alert.alert('Success', 'Profile updated successfully');
      setEditMode(false);
    } catch (error) {
      console.error('Error in updateProfile:', error);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#006AFF" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView
        style={styles.container}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          paddingBottom: insets.bottom + 120, // Increased padding to account for bottom CTA
        }}
        scrollIndicatorInsets={{ bottom: insets.bottom + 56 }}
      >
        <View style={styles.header}>
          <View style={styles.profileIcon}>
            <Text style={styles.profileInitial}>
              {profile.name ? profile.name[0].toUpperCase() : user.email[0].toUpperCase()}
            </Text>
          </View>
          <Text style={styles.name}>{profile.name || user.email?.split('@')[0]}</Text>

          {!editMode && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate('ProfileEdit')}
            >
              <Ionicons name="pencil" size={20} color="#006AFF" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.profileContent}>
          {editMode ? (
            // Edit mode form
            <>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={profile.name}
                  onChangeText={text => setProfile({ ...profile, name: text })}
                  placeholder="Enter your name"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Age</Text>
                <TextInput
                  style={styles.input}
                  value={profile.age}
                  onChangeText={text => setProfile({ ...profile, age: text })}
                  placeholder="Enter your age"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Date of Birth</Text>
                <TextInput
                  style={styles.input}
                  value={profile.birthdate}
                  onChangeText={text => setProfile({ ...profile, birthdate: text })}
                  placeholder="YYYY-MM-DD"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Bio</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={profile.bio}
                  onChangeText={text => setProfile({ ...profile, bio: text })}
                  placeholder="Tell us about yourself"
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Looking For</Text>
                <TextInput
                  style={styles.input}
                  value={profile.looking_for}
                  onChangeText={text => setProfile({ ...profile, looking_for: text })}
                  placeholder="What are you looking for?"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Gender</Text>
                <TextInput
                  style={styles.input}
                  value={profile.gender}
                  onChangeText={text => setProfile({ ...profile, gender: text })}
                  placeholder="Your gender"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Location</Text>
                <TextInput
                  style={styles.input}
                  value={profile.location}
                  onChangeText={text => setProfile({ ...profile, location: text })}
                  placeholder="Where are you located?"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Interests (comma separated)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={Array.isArray(profile.interests) ? profile.interests.join(', ') : ''}
                  onChangeText={text => {
                    const interestsArray = text
                      .split(',')
                      .map(item => item.trim())
                      .filter(item => item !== '');
                    setProfile({ ...profile, interests: interestsArray });
                  }}
                  placeholder="Your interests (e.g. hiking, reading, cooking)"
                  multiline
                  numberOfLines={2}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Avatar URL</Text>
                <TextInput
                  style={styles.input}
                  value={profile.avatar_url}
                  onChangeText={text => setProfile({ ...profile, avatar_url: text })}
                  placeholder="URL to your profile picture"
                />
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setEditMode(false);
                    fetchProfile(); // Reset to original data
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={updateProfile}
                  disabled={updating}
                >
                  {updating ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          ) : (
            // View mode
            <>
              {/* Complete Your Profile button is now moved outside the ScrollView */}

              <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>Age</Text>
                <Text style={styles.infoValue}>{profile.age || 'Not specified'}</Text>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>Date of Birth</Text>
                <Text style={styles.infoValue}>{profile.birthdate || 'Not specified'}</Text>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>Bio</Text>
                <Text style={styles.infoValue}>{profile.bio || 'No bio added yet'}</Text>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>Looking For</Text>
                <Text style={styles.infoValue}>{profile.looking_for || 'Not specified'}</Text>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>Gender</Text>
                <Text style={styles.infoValue}>{profile.gender || 'Not specified'}</Text>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{profile.location || 'Not specified'}</Text>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>Interests</Text>
                <Text style={styles.infoValue}>
                  {Array.isArray(profile.interests) && profile.interests.length > 0
                    ? profile.interests.join(', ')
                    : 'Not specified'}
                </Text>
              </View>

              {profile.avatar_url && (
                <View style={styles.infoSection}>
                  <Text style={styles.infoLabel}>Profile Picture</Text>
                  <Text style={styles.infoValue}>{profile.avatar_url}</Text>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>

      {!editMode && (
        <BottomStickyCTA
          label="Complete Your Profile"
          onPress={() => navigation.navigate('AddPics')}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#006AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileInitial: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  editButtonText: {
    color: '#006AFF',
    marginLeft: 5,
    fontSize: 16,
  },
  profileContent: {
    padding: 20,
  },
  infoSection: {
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 18,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#006AFF',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#eee',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
  },
  // Removed unused figma button styles as we're now using BottomStickyCTA component
});
