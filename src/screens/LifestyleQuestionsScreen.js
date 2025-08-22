import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import BottomStickyCTA from '../components/BottomStickyCTA';

const LifestyleQuestionsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [drinkingAnswer, setDrinkingAnswer] = useState('On special occasions');
  const [smokingAnswer, setSmokingAnswer] = useState('Non-smoker');
  const [workoutAnswer, setWorkoutAnswer] = useState('Sometimes');
  const [petsAnswer, setPetsAnswer] = useState([]);

  const renderSelectionButton = (text, selectedValue, setter, value) => {
    const isSelected = selectedValue === value;

    return (
      <TouchableOpacity
        style={[styles.selectionButton, isSelected && styles.selectedButton]}
        onPress={() => setter(value)}
      >
        <Text style={[styles.selectionButtonText, isSelected && styles.selectedButtonText]}>
          {text}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderPetButton = (text, value) => {
    const isSelected = petsAnswer.includes(value);

    const togglePet = () => {
      if (isSelected) {
        setPetsAnswer(petsAnswer.filter(pet => pet !== value));
      } else {
        setPetsAnswer([...petsAnswer, value]);
      }
    };

    return (
      <TouchableOpacity
        style={[styles.selectionButton, isSelected && styles.selectedButton]}
        onPress={togglePet}
      >
        <Text style={[styles.selectionButtonText, isSelected && styles.selectedButtonText]}>
          {text}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top gradient bar */}
      <LinearGradient
        colors={['#FF655B', '#FF5864', '#FD297B']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('AddPics')}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => navigation.navigate('RelationshipGoals')}
        >
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          paddingBottom: 100, // Increased padding to account for bottom CTA
        }}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
      >
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Let's talk lifestyle habits, Judy</Text>
          <Text style={styles.subtitle}>Do their habits match yours? You go first.</Text>
        </View>

        {/* Drinking Question */}
        <View style={styles.questionContainer}>
          <View style={styles.questionIconContainer}>
            <Ionicons name="wine-outline" size={24} color="#666" />
          </View>
          <Text style={styles.questionText}>How often do you drink?</Text>
        </View>

        <View style={styles.optionsContainer}>
          {renderSelectionButton('Not for me', drinkingAnswer, setDrinkingAnswer, 'Not for me')}
          {renderSelectionButton('Sober', drinkingAnswer, setDrinkingAnswer, 'Sober')}
          {renderSelectionButton(
            'Sober curious',
            drinkingAnswer,
            setDrinkingAnswer,
            'Sober curious'
          )}
          {renderSelectionButton(
            'On special occasions',
            drinkingAnswer,
            setDrinkingAnswer,
            'On special occasions'
          )}
          {renderSelectionButton(
            'Socially on weekends',
            drinkingAnswer,
            setDrinkingAnswer,
            'Socially on weekends'
          )}
          {renderSelectionButton('Most Nights', drinkingAnswer, setDrinkingAnswer, 'Most Nights')}
        </View>

        {/* Smoking Question */}
        <View style={styles.questionContainer}>
          <View style={styles.questionIconContainer}>
            <Ionicons name="flame-outline" size={24} color="#666" />
          </View>
          <Text style={styles.questionText}>How often do you smoke?</Text>
        </View>

        <View style={styles.optionsContainer}>
          {renderSelectionButton('Social smoker', smokingAnswer, setSmokingAnswer, 'Social smoker')}
          {renderSelectionButton(
            'Smoker when drinking',
            smokingAnswer,
            setSmokingAnswer,
            'Smoker when drinking'
          )}
          {renderSelectionButton('Non-smoker', smokingAnswer, setSmokingAnswer, 'Non-smoker')}
          {renderSelectionButton('Smoker', smokingAnswer, setSmokingAnswer, 'Smoker')}
          {renderSelectionButton(
            'Trying to quit',
            smokingAnswer,
            setSmokingAnswer,
            'Trying to quit'
          )}
        </View>

        {/* Workout Question */}
        <View style={styles.questionContainer}>
          <View style={styles.questionIconContainer}>
            <Ionicons name="barbell-outline" size={24} color="#666" />
          </View>
          <Text style={styles.questionText}>Do you workout?</Text>
        </View>

        <View style={styles.optionsContainer}>
          {renderSelectionButton('Everyday', workoutAnswer, setWorkoutAnswer, 'Everyday')}
          {renderSelectionButton('Often', workoutAnswer, setWorkoutAnswer, 'Often')}
          {renderSelectionButton('Sometimes', workoutAnswer, setWorkoutAnswer, 'Sometimes')}
          {renderSelectionButton('Never', workoutAnswer, setWorkoutAnswer, 'Never')}
        </View>

        {/* Pets Question */}
        <View style={styles.questionContainer}>
          <View style={styles.questionIconContainer}>
            <Ionicons name="paw-outline" size={24} color="#666" />
          </View>
          <Text style={styles.questionText}>Do you have any pets?</Text>
        </View>

        <View style={styles.optionsContainer}>
          {renderPetButton('Dog', 'Dog')}
          {renderPetButton('Cat', 'Cat')}
          {renderPetButton('Reptile', 'Reptile')}
          {renderPetButton('Amphibian', 'Amphibian')}
          {renderPetButton('Bird', 'Bird')}
        </View>
      </ScrollView>

      {/* Bottom CTA using the new component */}
      <BottomStickyCTA label="Next" onPress={() => navigation.navigate('RelationshipGoals')} />

      {/* Bottom indicator */}
      <View style={[styles.bottomIndicator, { marginBottom: insets.bottom }]} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerGradient: {
    height: 4,
    width: '100%',
    position: 'absolute',
    top: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  backButton: {
    padding: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButton: {
    padding: 10,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  questionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  questionIconContainer: {
    marginRight: 10,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectionButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    margin: 5,
  },
  selectedButton: {
    borderColor: '#FF4B7F',
    backgroundColor: 'rgba(255, 75, 127, 0.1)',
  },
  selectionButtonText: {
    color: '#666',
  },
  selectedButtonText: {
    color: '#FF4B7F',
    fontWeight: '500',
  },
  // Bottom button styles removed as we're using BottomStickyCTA component
  bottomIndicator: {
    width: 60,
    height: 5,
    backgroundColor: '#000',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
});

export default LifestyleQuestionsScreen;
