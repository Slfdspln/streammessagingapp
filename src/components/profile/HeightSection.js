import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

const HeightSection = () => {
  const [height, setHeight] = useState(166); // Default height in cm
  const [unit, setUnit] = useState('cm'); // 'cm' or 'ft'
  const [modalVisible, setModalVisible] = useState(false);

  const cmToFeet = cm => {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}'${inches}"`;
  };

  const displayHeight = unit === 'cm' ? `${height} cm` : cmToFeet(height);

  const heightOptions = Array.from({ length: 61 }, (_, i) => 140 + i); // 140cm to 200cm

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>HEIGHT</Text>

      <TouchableOpacity style={styles.heightSelector} onPress={() => setModalVisible(true)}>
        <View style={styles.heightDisplay}>
          <Ionicons name="resize" size={20} color="#666" style={styles.icon} />
          <Text style={styles.heightText}>Add height</Text>
        </View>
        <Text style={styles.heightValue}>{displayHeight}</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Height</Text>
              <TouchableOpacity style={styles.doneButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.doneText}>DONE</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Here's where you can add your height to your profile.
            </Text>

            <View style={styles.heightPickerContainer}>
              <Text style={styles.currentHeight}>{height} cm</Text>

              <View style={styles.sliderContainer}>
                <Text style={styles.sliderMinValue}>140 cm</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={140}
                  maximumValue={200}
                  step={1}
                  value={height}
                  onValueChange={setHeight}
                  minimumTrackTintColor="#FF5864"
                  maximumTrackTintColor="#EEEEEE"
                  thumbTintColor="#FF5864"
                />
                <Text style={styles.sliderMaxValue}>200 cm</Text>
              </View>
            </View>

            <View style={styles.unitToggleContainer}>
              <Text style={styles.unitToggleLabel}>Height unit</Text>
              <View style={styles.unitToggle}>
                <TouchableOpacity
                  style={[styles.unitButton, unit === 'ft' && styles.activeUnitButton]}
                  onPress={() => setUnit('ft')}
                >
                  <Text
                    style={[styles.unitButtonText, unit === 'ft' && styles.activeUnitButtonText]}
                  >
                    ft in
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.unitButton, unit === 'cm' && styles.activeUnitButton]}
                  onPress={() => setUnit('cm')}
                >
                  <Text
                    style={[styles.unitButtonText, unit === 'cm' && styles.activeUnitButtonText]}
                  >
                    cm
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.removeHeightButton}
              onPress={() => {
                setHeight(166); // Reset to default
                setModalVisible(false);
              }}
            >
              <Text style={styles.removeHeightText}>Remove height</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  heightSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  heightDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  heightText: {
    fontSize: 16,
  },
  heightValue: {
    fontSize: 16,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  closeButton: {
    padding: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  doneButton: {
    padding: 5,
  },
  doneText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF5864',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    padding: 16,
    lineHeight: 22,
  },
  heightPickerContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  currentHeight: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    paddingHorizontal: 10,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderMinValue: {
    fontSize: 12,
    color: '#999',
    marginRight: 10,
  },
  sliderMaxValue: {
    fontSize: 12,
    color: '#999',
    marginLeft: 10,
  },
  unitToggleContainer: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  unitToggleLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  unitToggle: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    overflow: 'hidden',
  },
  unitButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  activeUnitButton: {
    backgroundColor: '#FF5864',
  },
  unitButtonText: {
    fontSize: 16,
    color: '#666',
  },
  activeUnitButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  removeHeightButton: {
    marginTop: 30,
    alignItems: 'center',
    paddingVertical: 15,
  },
  removeHeightText: {
    fontSize: 16,
    color: '#FF5864',
    fontWeight: '500',
  },
});

export default HeightSection;
