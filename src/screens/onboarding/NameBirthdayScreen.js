import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../../contexts/AuthContext';
import { useOnboarding } from '../../contexts/OnboardingContext';

const NameBirthdayScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { onboardingData, updateOnboardingData } = useOnboarding();

  const [firstName, setFirstName] = useState(onboardingData.firstName);
  const [lastName, setLastName] = useState(onboardingData.lastName);
  const [birthdate, setBirthdate] = useState(onboardingData.birthdate);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Calculate age from birthdate
  const calculateAge = birthDate => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(birthdate);

  // Format date as MM/DD/YYYY
  const formatDate = date => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthdate;
    setShowDatePicker(Platform.OS === 'ios');
    setBirthdate(currentDate);
  };

  const handleContinue = () => {
    if (firstName.trim() && lastName.trim() && age >= 18) {
      // Save data to context
      updateOnboardingData({
        firstName,
        lastName,
        birthdate,
      });

      // Navigate to next screen
      navigation.navigate('Gender');
    }
  };

  const isButtonEnabled = firstName.trim() && lastName.trim() && age >= 18;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header with back button */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={28} color="#000" />
            </TouchableOpacity>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progress, { width: '25%' }]} />
              </View>
            </View>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title}>My first name is</Text>

            <TextInput
              style={styles.input}
              placeholder="First name"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
              autoCorrect={false}
            />

            <Text style={[styles.title, { marginTop: 24 }]}>My last name is</Text>

            <TextInput
              style={styles.input}
              placeholder="Last name"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
              autoCorrect={false}
            />

            <Text style={[styles.title, { marginTop: 24 }]}>My birthday is</Text>

            <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.dateText}>{formatDate(birthdate)}</Text>
            </TouchableOpacity>

            {age < 18 && (
              <Text style={styles.ageWarning}>
                You must be at least 18 years old to use this app
              </Text>
            )}

            {showDatePicker && (
              <DateTimePicker
                value={birthdate}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}
          </View>
        </ScrollView>

        {/* Continue Button */}
        <View style={[styles.buttonContainer, { paddingBottom: insets.bottom || 16 }]}>
          <TouchableOpacity
            style={[styles.continueButton, !isButtonEnabled && styles.disabledButton]}
            onPress={handleContinue}
            disabled={!isButtonEnabled}
          >
            <LinearGradient
              colors={isButtonEnabled ? ['#FF655B', '#FF5864', '#FD297B'] : ['#cccccc', '#bbbbbb']}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoid: {
    flex: 1,
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
    marginBottom: 16,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  dateInput: {
    height: 56,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
  },
  ageWarning: {
    color: '#FF4B7F',
    marginTop: 8,
    fontSize: 14,
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

export default NameBirthdayScreen;
