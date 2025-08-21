import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Gradient Overlay */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
        style={styles.gradient}
      />

      {/* Content Container */}
      <SafeAreaView style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.appName}>DatingApp</Text>
        </View>

        <View style={styles.bottomContent}>
          <Text style={styles.title}>Find your perfect match</Text>
          <Text style={styles.subtitle}>
            Join our community and discover meaningful connections with people who share your
            interests
          </Text>

          <TouchableOpacity
            style={styles.createAccountButton}
            onPress={() => navigation.navigate('NameBirthday')}
          >
            <Text style={styles.buttonText}>Create account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.signInText}>Sign in</Text>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    position: 'absolute',
    width: width,
    height: height,
    top: 0,
    left: 0,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: height,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  bottomContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e0e0',
    marginBottom: 32,
    lineHeight: 24,
  },
  createAccountButton: {
    backgroundColor: '#FF4B7F',
    borderRadius: 30,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  signInButton: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  signInText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  termsText: {
    color: '#a0a0a0',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default OnboardingScreen;
