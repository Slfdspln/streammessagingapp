import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { useAuth } from '../../contexts/AuthContext';
import { markOnboardingComplete } from '../../api/profile';

const OnboardingReviewScreen = ({ navigation }) => {
  const { onboardingData } = useOnboarding();
  const { completeOnboarding } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;
  const sectionAnims = useRef([
    new Animated.Value(0), // Photos section
    new Animated.Value(0), // Basic info section
    new Animated.Value(0), // Interests section
  ]).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  
  // Run animations on mount
  useEffect(() => {
    // Sequence of animations
    Animated.stagger(150, [
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease)
      }),
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease)
      }),
      Animated.timing(subtitleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease)
      }),
      ...sectionAnims.map(anim => 
        Animated.timing(anim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease)
        })
      )
    ]).start();
  }, []);

  // Format birthdate for display
  const formatBirthdate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Animate button press
  const animateButtonPress = () => {
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }),
    ]).start();
  };
  
  // Handle back button press
  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };
  
  // Complete onboarding and navigate to main app
  const handleComplete = async () => {
    try {
      animateButtonPress();
      setLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // Mark onboarding as complete in Supabase
      await markOnboardingComplete();
      
      // Update local auth state
      await completeOnboarding();
      
      // Navigate to main app
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } catch (error) {
      console.error('Error completing onboarding:', error);
      Alert.alert(
        'Error',
        'Failed to complete onboarding. Please try again.',
        [{ text: 'OK' }]
      );
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '100%' }]} />
        </View>
        <Text style={styles.progressText}>Step 5 of 5</Text>
      </View>
      
      <Animated.Text 
        style={[styles.title, { 
          opacity: titleAnim,
          transform: [{
            translateY: titleAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0]
            })
          }]
        }]}
      >
        Review Your Profile
      </Animated.Text>
      
      <Animated.Text 
        style={[styles.subtitle, { 
          opacity: subtitleAnim,
          transform: [{
            translateY: subtitleAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [15, 0]
            })
          }]
        }]}
      >
        Here's how your profile will appear to others. You can edit these details later.
      </Animated.Text>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Photos section */}
        <Animated.View 
          style={[styles.section, { 
            opacity: sectionAnims[0],
            transform: [{
              translateY: sectionAnims[0].interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0]
              })
            }]
          }]}
        >
          <Text style={styles.sectionTitle}>Photos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosContainer}>
            {onboardingData.photos && onboardingData.photos.length > 0 ? (
              onboardingData.photos.map((photo, index) => (
                <View key={index} style={styles.photoWrapper}>
                  <Image source={{ uri: photo }} style={styles.photo} />
                </View>
              ))
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text style={styles.photoPlaceholderText}>No photos added</Text>
              </View>
            )}
          </ScrollView>
        </Animated.View>
        
        {/* Basic info section */}
        <Animated.View 
          style={[styles.section, { 
            opacity: sectionAnims[1],
            transform: [{
              translateY: sectionAnims[1].interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0]
              })
            }]
          }]}
        >
          <Text style={styles.sectionTitle}>Basic Info</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>
              {onboardingData.firstName} {onboardingData.lastName}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Birthdate</Text>
            <Text style={styles.infoValue}>
              {formatBirthdate(onboardingData.birthdate)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Gender</Text>
            <Text style={styles.infoValue}>{onboardingData.gender}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Show Gender</Text>
            <Text style={styles.infoValue}>
              {onboardingData.showGender ? 'Yes' : 'No'}
            </Text>
          </View>
        </Animated.View>
        
        {/* Interests section */}
        <Animated.View 
          style={[styles.section, { 
            opacity: sectionAnims[2],
            transform: [{
              translateY: sectionAnims[2].interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0]
              })
            }]
          }]}
        >
          <Text style={styles.sectionTitle}>Interests</Text>
          <View style={styles.interestsContainer}>
            {onboardingData.interests && onboardingData.interests.length > 0 ? (
              onboardingData.interests.map((interest, index) => (
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noInterestsText}>No interests selected</Text>
            )}
          </View>
        </Animated.View>
      </ScrollView>
      
      {/* Bottom buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          disabled={loading}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        
        <Animated.View style={{ transform: [{ scale: buttonScaleAnim }], width: '70%' }}>
          <TouchableOpacity
            onPress={handleComplete}
            disabled={loading}
            style={[styles.buttonWrapper, loading && styles.disabledButton]}
            activeOpacity={0.8}
          >
          <LinearGradient
            colors={['#FF6B6B', '#FF8E53']}
            style={styles.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Complete</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  progressContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: 6,
    backgroundColor: '#FF6B6B',
    borderRadius: 3,
  },
  progressText: {
    color: '#666',
    fontSize: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    paddingHorizontal: 24,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    paddingHorizontal: 24,
    lineHeight: 22,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  photosContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  photoWrapper: {
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  photo: {
    width: 120,
    height: 160,
    borderRadius: 8,
  },
  photoPlaceholder: {
    width: 120,
    height: 160,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderText: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestTag: {
    backgroundColor: '#FF6B6B20',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  interestText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '500',
  },
  noInterestsText: {
    color: '#999',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
  },
  backButton: {
    padding: 12,
  },
  backButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonWrapper: {
    borderRadius: 30,
    overflow: 'hidden',
    width: '100%',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default OnboardingReviewScreen;
