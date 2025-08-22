import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import BottomStickyCTA from '../components/BottomStickyCTA';

const RelationshipGoalsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [selectedGoal, setSelectedGoal] = useState('Still figuring it out');

  const goals = [
    {
      id: 'long-term',
      emoji: '💞',
      title: 'Long-term partner',
      selected: selectedGoal === 'Long-term partner',
    },
    {
      id: 'long-term-short',
      emoji: '😍',
      title: 'Long-term, open to short',
      selected: selectedGoal === 'Long-term, open to short',
    },
    {
      id: 'short-term-long',
      emoji: '🥂',
      title: 'Short-term, open to long',
      selected: selectedGoal === 'Short-term, open to long',
    },
    {
      id: 'short-term',
      emoji: '🎉',
      title: 'Short-term fun',
      selected: selectedGoal === 'Short-term fun',
    },
    {
      id: 'new-friends',
      emoji: '👋',
      title: 'New friends',
      selected: selectedGoal === 'New friends',
    },
    {
      id: 'figuring-out',
      emoji: '🤔',
      title: 'Still figuring it out',
      selected: selectedGoal === 'Still figuring it out',
    },
  ];

  const handleGoalSelect = title => {
    setSelectedGoal(title);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with gradient */}
      <LinearGradient
        colors={['#FF655B', '#FF5864', '#FD297B']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />

      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('LifestyleQuestions')}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back" size={28} color="#000" />
      </TouchableOpacity>

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
          <Text style={styles.title}>Right now I'm looking for...</Text>
          <Text style={styles.subtitle}>Increase compatibility by sharing yours!</Text>
        </View>

        {/* Goals grid */}
        <View style={styles.goalsGrid}>
          {goals.map(goal => (
            <TouchableOpacity
              key={goal.id}
              style={[styles.goalCard, goal.selected && styles.selectedGoalCard]}
              onPress={() => handleGoalSelect(goal.title)}
            >
              <Text style={styles.goalEmoji}>{goal.emoji}</Text>
              <Text style={styles.goalTitle}>{goal.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom CTA using the new component */}
      <BottomStickyCTA label="Next" onPress={() => navigation.navigate('Profile')} />

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
  backButton: {
    position: 'absolute',
    top: 60,
    left: 15,
    zIndex: 10,
    padding: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    marginTop: 50,
  },
  titleContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  goalCard: {
    width: '48%',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    height: 140,
    justifyContent: 'center',
  },
  selectedGoalCard: {
    borderWidth: 2,
    borderColor: '#FF4B7F',
  },
  goalEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  goalTitle: {
    fontSize: 16,
    textAlign: 'center',
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

export default RelationshipGoalsScreen;
