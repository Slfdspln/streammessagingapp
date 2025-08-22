import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const InterestsSection = () => {
  const [selectedInterests, setSelectedInterests] = useState([
    'Self Care',
    'Travel',
    'Movies',
    'Walking',
    'Running',
  ]);

  const allInterests = [
    'Self Care',
    'Travel',
    'Movies',
    'Walking',
    'Running',
    'Cooking',
    'Reading',
    'Gaming',
    'Music',
    'Art',
    'Photography',
    'Hiking',
    'Yoga',
    'Dancing',
    'Fitness',
  ];

  const toggleInterest = interest => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(item => item !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>INTERESTS</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.interestsContainer}
      >
        {selectedInterests.map((interest, index) => (
          <View key={index} style={styles.interestChip}>
            <Text style={styles.interestText}>{interest}</Text>
            <TouchableOpacity style={styles.removeButton} onPress={() => toggleInterest(interest)}>
              <Ionicons name="close" size={16} color="#666" />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            // Open interest selection modal
          }}
        >
          <Ionicons name="add" size={24} color="#FF5864" />
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.interestSelectionContainer}>
        <Text style={styles.selectionTitle}>Popular</Text>
        <View style={styles.interestGrid}>
          {allInterests.map((interest, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.interestOption,
                selectedInterests.includes(interest) && styles.selectedInterest,
              ]}
              onPress={() => toggleInterest(interest)}
            >
              <Text
                style={[
                  styles.interestOptionText,
                  selectedInterests.includes(interest) && styles.selectedInterestText,
                ]}
              >
                {interest}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 8,
    borderBottomColor: '#F5F5F5',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  interestsContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  interestText: {
    fontSize: 14,
    marginRight: 6,
  },
  removeButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  interestSelectionContainer: {
    marginTop: 16,
  },
  selectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  interestGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestOption: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedInterest: {
    backgroundColor: '#FFE9EA',
  },
  interestOptionText: {
    fontSize: 14,
    color: '#333',
  },
  selectedInterestText: {
    color: '#FF5864',
  },
});

export default InterestsSection;
