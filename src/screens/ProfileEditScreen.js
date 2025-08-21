import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import InterestsSection from '../components/profile/InterestsSection';
import HeightSection from '../components/profile/HeightSection';
import LifestyleSection from '../components/profile/LifestyleSection';
import PhotoOptionsSection from '../components/profile/PhotoOptionsSection';
import PromptsSection from '../components/profile/PromptsSection';

const ProfileEditScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('edit'); // 'edit' or 'preview'

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Edit info</Text>
        <TouchableOpacity style={styles.doneButton} onPress={() => navigation.goBack()}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'edit' && styles.activeTab]}
          onPress={() => setActiveTab('edit')}
        >
          <Text style={[styles.tabText, activeTab === 'edit' && styles.activeTabText]}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'preview' && styles.activeTab]}
          onPress={() => setActiveTab('preview')}
        >
          <Text style={[styles.tabText, activeTab === 'preview' && styles.activeTabText]}>
            Preview
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'edit' ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{
            paddingBottom: insets.bottom + 20,
          }}
        >
          <InterestsSection />
          <HeightSection />
          <LifestyleSection />
          <PhotoOptionsSection />
          <PromptsSection />
        </ScrollView>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{
            paddingBottom: insets.bottom + 20,
          }}
        >
          {/* Preview content will go here */}
          <Text style={styles.previewText}>Profile Preview</Text>
        </ScrollView>
      )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  doneButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0084FF',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF5864',
  },
  tabText: {
    fontSize: 16,
    color: '#999999',
  },
  activeTabText: {
    color: '#FF5864',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  previewText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
  },
});

export default ProfileEditScreen;
