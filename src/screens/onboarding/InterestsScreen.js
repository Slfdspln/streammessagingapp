import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../../contexts/AuthContext';
import { useOnboarding } from '../../contexts/OnboardingContext';

const InterestsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useAuth();
  const { onboardingData, updateOnboardingData, submitOnboarding } = useOnboarding();
  const [selectedInterests, setSelectedInterests] = useState(onboardingData.interests || []);
  const [saving, setSaving] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Fade in animation for content
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease)
    }).start();
  }, []);

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

  // Animate button press
  const animateButtonPress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }),
    ]).start();
  };

  const toggleInterest = interest => {
    // Provide haptic feedback
    Haptics.impactAsync(
      selectedInterests.includes(interest) 
        ? Haptics.ImpactFeedbackStyle.Light 
        : Haptics.ImpactFeedbackStyle.Medium
    );
    
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(item => item !== interest));
    } else {
      if (selectedInterests.length < MAX_INTERESTS) {
        setSelectedInterests([...selectedInterests, interest]);
      } else {
        // Vibrate to indicate max selection reached
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    }
  };

  const handleComplete = async () => {
    if (selectedInterests.length < MIN_INTERESTS) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert(
        'Select Interests',
        `Please select at least ${MIN_INTERESTS} interests to continue.`
      );
      return;
    }
    
    // Animate button press
    animateButtonPress();
    
    // Provide haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setSaving(true);

    try {
      // Update interests in context
      updateOnboardingData({
        interests: selectedInterests,
      });

      // Submit all onboarding data
      const success = await submitOnboarding();

      if (success) {
        // Success haptic feedback
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        // Navigate to review screen
        navigation.navigate('Review');
      } else {
        throw new Error('Failed to complete onboarding');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
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

      <Animated.View 
        style={[styles.content, { opacity: fadeAnim }]}
      >
        <Text style={styles.title}>What are you into?</Text>
        <Text style={styles.subtitle}>
          Select at least {MIN_INTERESTS} interests to help us find your perfect matches
        </Text>

        <View style={styles.interestCountContainer}>
          <Text style={[
            styles.interestCount,
            selectedInterests.length >= MAX_INTERESTS && styles.maxInterestsReached
          ]}>
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
      </Animated.View>

      {/* Complete Button */}
      <View style={[styles.buttonContainer, { paddingBottom: insets.bottom || 16 }]}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '100%' }}>
          <TouchableOpacity
            style={[styles.completeButton, (!isButtonEnabled || saving) && styles.disabledButton]}
            onPress={handleComplete}
            disabled={!isButtonEnabled || saving}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={isButtonEnabled ? ['#FF655B', '#FF5864', '#FD297B'] : ['#cccccc', '#bbbbbb']}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {saving ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="#fff" />
                  <Text style={styles.loadingText}>Saving...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Continue</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
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
    fontWeight: '500',
  },
  maxInterestsReached: {
    color: '#FF4B7F',
    fontWeight: '600',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedChip: {
    backgroundColor: 'rgba(255, 75, 127, 0.1)',
    borderWidth: 1,
    borderColor: '#FF4B7F',
    shadowColor: '#FF4B7F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
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
    shadowColor: '#FF4B7F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
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
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default InterestsScreen;
