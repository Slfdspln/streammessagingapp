import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import LinearGradient from 'react-native-linear-gradient';
import { useOnboarding } from '../../contexts/OnboardingContext';

const GenderScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { onboardingData, updateOnboardingData } = useOnboarding();

  const [selectedGender, setSelectedGender] = useState(onboardingData.gender || null);
  const [showGender, setShowGender] = useState(
    onboardingData.showGender !== undefined ? onboardingData.showGender : true
  );

  const genderOptions = [
    { id: 'woman', label: 'Woman' },
    { id: 'man', label: 'Man' },
    { id: 'nonbinary', label: 'Non-binary' },
    { id: 'other', label: 'Other' },
  ];

  const handleContinue = () => {
    if (selectedGender) {
      // Save gender selection to context
      updateOnboardingData({
        gender: selectedGender,
        showGender,
      });

      // Navigate to next screen
      navigation.navigate('OnboardingPhotos');
    }
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
              <View style={[styles.progress, { width: '50%' }]} />
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>I am a</Text>

          {/* Gender Options */}
          <View style={styles.optionsContainer}>
            {genderOptions.map(option => (
              <TouchableOpacity
                key={option.id}
                style={[styles.optionButton, selectedGender === option.id && styles.selectedOption]}
                onPress={() => setSelectedGender(option.id)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedGender === option.id && styles.selectedOptionText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Show Gender Toggle */}
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>Show gender on my profile</Text>
            <TouchableOpacity
              style={[styles.toggle, showGender && styles.toggleActive]}
              onPress={() => setShowGender(!showGender)}
            >
              <View style={[styles.toggleHandle, showGender && styles.toggleHandleActive]} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={[styles.buttonContainer, { paddingBottom: insets.bottom || 16 }]}>
        <TouchableOpacity
          style={[styles.continueButton, !selectedGender && styles.disabledButton]}
          onPress={handleContinue}
          disabled={!selectedGender}
        >
          <LinearGradient
            colors={selectedGender ? ['#FF655B', '#FF5864', '#FD297B'] : ['#cccccc', '#bbbbbb']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>Continue</Text>
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
    marginBottom: 24,
  },
  optionsContainer: {
    marginBottom: 32,
  },
  optionButton: {
    height: 56,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  selectedOption: {
    borderColor: '#FF4B7F',
    backgroundColor: 'rgba(255, 75, 127, 0.05)',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#FF4B7F',
    fontWeight: '500',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  toggleLabel: {
    fontSize: 16,
    color: '#333',
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
    padding: 2,
  },
  toggleActive: {
    backgroundColor: '#FF4B7F',
  },
  toggleHandle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  toggleHandleActive: {
    transform: [{ translateX: 20 }],
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

export default GenderScreen;
