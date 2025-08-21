import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LifestyleSection = () => {
  const [lifestyleOptions, setLifestyleOptions] = useState({
    smoking: null, // null, 'never', 'socially', 'regularly'
    drinking: null, // null, 'never', 'socially', 'regularly'
    exercise: null, // null, 'never', 'sometimes', 'regularly'
    pets: null, // null, 'has_pets', 'no_pets', 'wants_pets'
  });

  const [showOptions, setShowOptions] = useState({
    smoking: false,
    drinking: false,
    exercise: false,
    pets: false,
  });

  const [visibilitySettings, setVisibilitySettings] = useState({
    smoking: true,
    drinking: true,
    exercise: true,
    pets: true,
  });

  const toggleVisibility = option => {
    setVisibilitySettings({
      ...visibilitySettings,
      [option]: !visibilitySettings[option],
    });
  };

  const toggleOptions = option => {
    setShowOptions({
      ...showOptions,
      [option]: !showOptions[option],
    });
  };

  const selectOption = (category, value) => {
    setLifestyleOptions({
      ...lifestyleOptions,
      [category]: value,
    });
    toggleOptions(category);
  };

  const getDisplayText = category => {
    if (lifestyleOptions[category] === null) {
      return 'Add';
    }

    switch (category) {
      case 'smoking':
        return lifestyleOptions[category] === 'never'
          ? "Don't smoke"
          : lifestyleOptions[category] === 'socially'
            ? 'Smoke socially'
            : 'Smoke regularly';
      case 'drinking':
        return lifestyleOptions[category] === 'never'
          ? "Don't drink"
          : lifestyleOptions[category] === 'socially'
            ? 'Drink socially'
            : 'Drink regularly';
      case 'exercise':
        return lifestyleOptions[category] === 'never'
          ? "Don't exercise"
          : lifestyleOptions[category] === 'sometimes'
            ? 'Exercise sometimes'
            : 'Exercise regularly';
      case 'pets':
        return lifestyleOptions[category] === 'has_pets'
          ? 'Have pets'
          : lifestyleOptions[category] === 'no_pets'
            ? "Don't have pets"
            : 'Want pets';
      default:
        return 'Add';
    }
  };

  const renderOptions = category => {
    if (!showOptions[category]) return null;

    let options = [];
    switch (category) {
      case 'smoking':
      case 'drinking':
        options = [
          { value: 'never', label: category === 'smoking' ? "Don't smoke" : "Don't drink" },
          {
            value: 'socially',
            label: category === 'smoking' ? 'Smoke socially' : 'Drink socially',
          },
          {
            value: 'regularly',
            label: category === 'smoking' ? 'Smoke regularly' : 'Drink regularly',
          },
        ];
        break;
      case 'exercise':
        options = [
          { value: 'never', label: "Don't exercise" },
          { value: 'sometimes', label: 'Exercise sometimes' },
          { value: 'regularly', label: 'Exercise regularly' },
        ];
        break;
      case 'pets':
        options = [
          { value: 'has_pets', label: 'Have pets' },
          { value: 'no_pets', label: "Don't have pets" },
          { value: 'wants_pets', label: 'Want pets' },
        ];
        break;
    }

    return (
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionItem}
            onPress={() => selectOption(category, option.value)}
          >
            <Text style={styles.optionText}>{option.label}</Text>
            {lifestyleOptions[category] === option.value && (
              <Ionicons name="checkmark" size={20} color="#FF5864" />
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>LIFESTYLE</Text>

      <View style={styles.optionRow}>
        <View style={styles.optionLeft}>
          <Ionicons name="smoking" size={20} color="#666" style={styles.icon} />
          <Text style={styles.optionLabel}>Smoking</Text>
        </View>
        <TouchableOpacity style={styles.optionRight} onPress={() => toggleOptions('smoking')}>
          <Text
            style={[
              styles.optionValue,
              lifestyleOptions.smoking === null && styles.optionPlaceholder,
            ]}
          >
            {getDisplayText('smoking')}
          </Text>
          <Ionicons
            name={showOptions.smoking ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      </View>
      {renderOptions('smoking')}

      <View style={styles.visibilityToggle}>
        <Text style={styles.visibilityText}>Show on profile</Text>
        <Switch
          trackColor={{ false: '#DDDDDD', true: '#FF5864' }}
          thumbColor={'#FFFFFF'}
          ios_backgroundColor="#DDDDDD"
          onValueChange={() => toggleVisibility('smoking')}
          value={visibilitySettings.smoking}
        />
      </View>

      <View style={styles.divider} />

      <View style={styles.optionRow}>
        <View style={styles.optionLeft}>
          <Ionicons name="wine" size={20} color="#666" style={styles.icon} />
          <Text style={styles.optionLabel}>Drinking</Text>
        </View>
        <TouchableOpacity style={styles.optionRight} onPress={() => toggleOptions('drinking')}>
          <Text
            style={[
              styles.optionValue,
              lifestyleOptions.drinking === null && styles.optionPlaceholder,
            ]}
          >
            {getDisplayText('drinking')}
          </Text>
          <Ionicons
            name={showOptions.drinking ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      </View>
      {renderOptions('drinking')}

      <View style={styles.visibilityToggle}>
        <Text style={styles.visibilityText}>Show on profile</Text>
        <Switch
          trackColor={{ false: '#DDDDDD', true: '#FF5864' }}
          thumbColor={'#FFFFFF'}
          ios_backgroundColor="#DDDDDD"
          onValueChange={() => toggleVisibility('drinking')}
          value={visibilitySettings.drinking}
        />
      </View>

      <View style={styles.divider} />

      <View style={styles.optionRow}>
        <View style={styles.optionLeft}>
          <Ionicons name="fitness" size={20} color="#666" style={styles.icon} />
          <Text style={styles.optionLabel}>Exercise</Text>
        </View>
        <TouchableOpacity style={styles.optionRight} onPress={() => toggleOptions('exercise')}>
          <Text
            style={[
              styles.optionValue,
              lifestyleOptions.exercise === null && styles.optionPlaceholder,
            ]}
          >
            {getDisplayText('exercise')}
          </Text>
          <Ionicons
            name={showOptions.exercise ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      </View>
      {renderOptions('exercise')}

      <View style={styles.visibilityToggle}>
        <Text style={styles.visibilityText}>Show on profile</Text>
        <Switch
          trackColor={{ false: '#DDDDDD', true: '#FF5864' }}
          thumbColor={'#FFFFFF'}
          ios_backgroundColor="#DDDDDD"
          onValueChange={() => toggleVisibility('exercise')}
          value={visibilitySettings.exercise}
        />
      </View>

      <View style={styles.divider} />

      <View style={styles.optionRow}>
        <View style={styles.optionLeft}>
          <Ionicons name="paw" size={20} color="#666" style={styles.icon} />
          <Text style={styles.optionLabel}>Pets</Text>
        </View>
        <TouchableOpacity style={styles.optionRight} onPress={() => toggleOptions('pets')}>
          <Text
            style={[styles.optionValue, lifestyleOptions.pets === null && styles.optionPlaceholder]}
          >
            {getDisplayText('pets')}
          </Text>
          <Ionicons
            name={showOptions.pets ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      </View>
      {renderOptions('pets')}

      <View style={styles.visibilityToggle}>
        <Text style={styles.visibilityText}>Show on profile</Text>
        <Switch
          trackColor={{ false: '#DDDDDD', true: '#FF5864' }}
          thumbColor={'#FFFFFF'}
          ios_backgroundColor="#DDDDDD"
          onValueChange={() => toggleVisibility('pets')}
          value={visibilitySettings.pets}
        />
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
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  optionLabel: {
    fontSize: 16,
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionValue: {
    fontSize: 16,
    color: '#666',
    marginRight: 8,
  },
  optionPlaceholder: {
    color: '#999',
  },
  visibilityToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingLeft: 30,
  },
  visibilityText: {
    fontSize: 14,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 8,
  },
  optionsContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 12,
    marginLeft: 30,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  optionText: {
    fontSize: 16,
  },
});

export default LifestyleSection;
