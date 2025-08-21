import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';
import { useOnboarding } from '../../contexts/OnboardingContext';

const InterestsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useAuth();
  const { onboardingData, updateOnboardingData, submitOnboarding } = useOnboarding();
  const [selectedInterests, setSelectedInterests] = useState(onboardingData.interests || []);
  const [saving, setSaving] = useState(false);

  const MIN_INTERESTS = 3;
  const MAX_INTERESTS = 10;

  // List of potential interests
  const interestsList = [
    'Travel',
    'Fitness',
    'Music',
    'Reading',
    'Cooking',
    'Photography',
    'Hiking',
    'Movies',
    'Art',
    'Dancing',
    'Gaming',
    'Yoga',
    'Coffee',
    'Wine',
    'Foodie',
    'Outdoors',
    'Tech',
    'Fashion',
    'Sports',
    'Concerts',
    'Pets',
    'Meditation',
    'Cycling',
    'Running',
    'Baking',
    'Painting',
    'Writing',
    'Volunteering',
    'Languages',
    'Podcasts',
    'Brunch',
    'Karaoke',
    'Festivals',
    'Beach',
    'Camping',
    'Comedy',
  ];

  const toggleInterest = interest => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(item => item !== interest));
    } else {
      if (selectedInterests.length < MAX_INTERESTS) {
        setSelectedInterests([...selectedInterests, interest]);
      }
    }
  };

  const handleComplete = async () => {
    if (selectedInterests.length < MIN_INTERESTS) {
      Alert.alert(
        'Select Interests',
        `Please select at least ${MIN_INTERESTS} interests to continue.`
      );
      return;
    }

    setSaving(true);

    try {
      // Update interests in context
      updateOnboardingData({
        interests: selectedInterests,
      });

      // Submit all onboarding data
      const success = await submitOnboarding();

      if (success) {
        // Navigate to main app
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      } else {
        throw new Error('Failed to complete onboarding');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      Alert.alert('Error', 'Failed to complete onboarding. Please try again.', [{ text: 'OK' }]);
      setSaving(false);
    }
  };

  const isButtonEnabled = selectedInterests.length >= MIN_INTERESTS;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: '100%' }]} />
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>What are you into?</Text>
        <Text style={styles.subtitle}>
          Select at least {MIN_INTERESTS} interests to help us find your perfect matches
        </Text>

        <View style={styles.interestCountContainer}>
          <Text style={styles.interestCount}>
            {selectedInterests.length}/{MAX_INTERESTS}
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.interestsContainer}
          showsVerticalScrollIndicator={false}
        >
          {interestsList.map(interest => (
            <TouchableOpacity
              key={interest}
              style={[
                styles.interestChip,
                selectedInterests.includes(interest) && styles.selectedChip,
              ]}
              onPress={() => toggleInterest(interest)}
              disabled={
                !selectedInterests.includes(interest) && selectedInterests.length >= MAX_INTERESTS
              }
            >
              <Text
                style={[
                  styles.interestText,
                  selectedInterests.includes(interest) && styles.selectedInterestText,
                ]}
              >
                {interest}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Complete Button */}
      <View style={[styles.buttonContainer, { paddingBottom: insets.bottom || 16 }]}>
        <TouchableOpacity
          style={[styles.completeButton, (!isButtonEnabled || saving) && styles.disabledButton]}
          onPress={handleComplete}
          disabled={!isButtonEnabled || saving}
        >
          <LinearGradient
            colors={isButtonEnabled ? ['#FF655B', '#FF5864', '#FD297B'] : ['#cccccc', '#bbbbbb']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Complete</Text>
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
  interestCountContainer: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  interestCount: {
    fontSize: 14,
    color: '#666',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 20,
  },
  interestChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
    marginBottom: 12,
  },
  selectedChip: {
    backgroundColor: 'rgba(255, 75, 127, 0.1)',
    borderWidth: 1,
    borderColor: '#FF4B7F',
  },
  interestText: {
    fontSize: 14,
    color: '#333',
  },
  selectedInterestText: {
    color: '#FF4B7F',
    fontWeight: '500',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  completeButton: {
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

export default InterestsScreen;
