import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { useAuth } from '../../contexts/AuthContext';
import { saveName, saveBasics, savePhotoUrls } from '../../api/profile';
import { uploadPhotoToSupabase } from '../../utils/uploadToSupabase';

const OnboardingAuthScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const { onboardingData } = useOnboarding();
  const { signInWithMagicLink, signInWithOtp, verifyOtp } = useAuth();
  const otpInputRef = useRef(null);

  // Listen for deep links (for magic link auth)
  useEffect(() => {
    const handleDeepLink = async (event) => {
      const url = event.url;
      if (url && url.includes('auth-callback')) {
        setLoading(true);
        try {
          // Wait a moment for auth to complete
          setTimeout(async () => {
            // User is authenticated, save onboarding data
            await syncOnboardingData();
            navigation.replace('Interests');
          }, 1000);
        } catch (error) {
          console.error('Error handling deep link:', error);
          setLoading(false);
        }
      }
    };

    // Set up linking listeners
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Check if app was opened with a URL
    Linking.getInitialURL().then((url) => {
      if (url && url.includes('auth-callback')) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // User is already authenticated, sync data and proceed
          await syncOnboardingData();
          navigation.replace('Interests');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      }
    };
    
    checkAuth();
  }, []);
  
  // Focus OTP input when showing
  useEffect(() => {
    if (showOtpInput && otpInputRef.current) {
      setTimeout(() => {
        otpInputRef.current.focus();
      }, 100);
    }
  }, [showOtpInput]);

  // Sync local onboarding data to Supabase after authentication
  const syncOnboardingData = async () => {
    try {
      setLoading(true);
      
      // Save name
      if (onboardingData.firstName && onboardingData.lastName) {
        await saveName(onboardingData.firstName, onboardingData.lastName);
      }
      
      // Save basics (birthdate, gender)
      await saveBasics({
        birthdate: onboardingData.birthdate.toISOString().split('T')[0],
        gender: onboardingData.gender,
        show_gender: onboardingData.showGender
      });
      
      // Upload photos if available
      if (onboardingData.photos && onboardingData.photos.length > 0) {
        const photoUrls = [];
        
        for (const photo of onboardingData.photos) {
          // Check if it's already a URL or a local file
          if (photo.startsWith('http')) {
            photoUrls.push(photo);
          } else {
            const photoFile = { uri: photo };
            const publicUrl = await uploadPhotoToSupabase(photoFile);
            photoUrls.push(publicUrl);
          }
        }
        
        await savePhotoUrls(photoUrls);
      }
      
      return true;
    } catch (error) {
      console.error('Error syncing onboarding data:', error);
      Alert.alert('Error', 'Failed to save your profile data. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Send magic link or OTP
  const onSubmitEmail = async () => {
    if (!email || !email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }
    
    try {
      setLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const redirectUrl = Platform.OS === 'ios' 
        ? 'com.slfdspln.datingapp://auth-callback' 
        : 'datingapp://auth-callback';
      
      // Send magic link
      const { error } = await signInWithMagicLink(email, redirectUrl);
      
      if (error) throw error;
      
      setEmailSent(true);
      setShowOtpInput(true); // Show OTP input as fallback
      
      Alert.alert(
        'Check your email',
        'We sent you a magic link to sign in. Tap the link in your email to continue, or enter the code below.'
      );
    } catch (error) {
      console.error('Error sending magic link:', error);
      Alert.alert('Error', error.message || 'Failed to send login link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Resend the magic link
  const resendMagicLink = async () => {
    if (!email) return;
    
    try {
      setLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      const redirectUrl = Platform.OS === 'ios' 
        ? 'com.slfdspln.datingapp://auth-callback' 
        : 'datingapp://auth-callback';
      
      const { error } = await signInWithMagicLink(email, redirectUrl);
      
      if (error) throw error;
      
      Alert.alert(
        'Email Resent',
        'We sent you another magic link. Check your email.'
      );
    } catch (error) {
      console.error('Error resending magic link:', error);
      Alert.alert('Error', error.message || 'Failed to resend login link. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Verify OTP code
  const onVerifyOtp = async () => {
    if (!otpCode || otpCode.length < 6) {
      Alert.alert('Invalid Code', 'Please enter the 6-digit code from your email');
      return;
    }
    
    try {
      setLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const { data, error } = await verifyOtp(email, otpCode);
      
      if (error) throw error;
      
      if (data?.session) {
        // User is authenticated, save onboarding data
        await syncOnboardingData();
        navigation.replace('Interests');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      Alert.alert('Error', error.message || 'Invalid or expired code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '80%' }]} />
          </View>
          <Text style={styles.progressText}>Step 4 of 5</Text>
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={styles.title}>
            {emailSent ? 'Check your email' : 'Save your progress'}
          </Text>
          
          <Text style={styles.subtitle}>
            {emailSent 
              ? 'We sent a magic link to your email. Tap it to continue setting up your profile.' 
              : 'Enter your email to save your progress and continue.'}
          </Text>
          
          {!emailSent ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Your email address"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCompleteType="email"
                textContentType="emailAddress"
              />
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={styles.backButton}
                  disabled={loading}
                >
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={onSubmitEmail}
                  disabled={loading || !email}
                  style={[
                    styles.buttonWrapper,
                    (!email || loading) && styles.disabledButton,
                  ]}
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
                      <Text style={styles.buttonText}>Continue</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.emailSentContainer}>
              <Text style={styles.emailSentText}>
                We sent a link to:
              </Text>
              <Text style={styles.emailAddress}>{email}</Text>
              
              {showOtpInput && (
                <>
                  <Text style={styles.otpInstructionText}>
                    Or enter the 6-digit code from your email:
                  </Text>
                  <TextInput
                    ref={otpInputRef}
                    style={styles.otpInput}
                    placeholder="6-digit code"
                    placeholderTextColor="#999"
                    value={otpCode}
                    onChangeText={setOtpCode}
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                  
                  <TouchableOpacity
                    onPress={onVerifyOtp}
                    disabled={loading || otpCode.length < 6}
                    style={[
                      styles.otpButton,
                      (loading || otpCode.length < 6) && styles.disabledButton,
                    ]}
                  >
                    <Text style={styles.otpButtonText}>
                      {loading ? 'Verifying...' : 'Verify Code'}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
              
              <TouchableOpacity
                onPress={resendMagicLink}
                disabled={loading}
                style={styles.resendButton}
              >
                <Text style={styles.resendButtonText}>
                  {loading ? 'Sending...' : 'Resend Link'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => {
                  setEmailSent(false);
                  setShowOtpInput(false);
                  setOtpCode('');
                }}
                style={styles.changeEmailButton}
              >
                <Text style={styles.changeEmailText}>Change Email</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
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
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    lineHeight: 22,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 24,
    backgroundColor: '#F9F9F9',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
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
    width: '70%',
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
  },
  disabledButton: {
    opacity: 0.6,
  },
  emailSentContainer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  emailSentText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  emailAddress: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 32,
  },
  otpInstructionText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  otpInput: {
    height: 56,
    width: '60%',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 20,
    marginBottom: 16,
    backgroundColor: '#F9F9F9',
    textAlign: 'center',
    letterSpacing: 4,
  },
  otpButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginBottom: 24,
  },
  otpButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resendButton: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginBottom: 16,
  },
  resendButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
  },
  changeEmailButton: {
    paddingVertical: 12,
  },
  changeEmailText: {
    color: '#666',
    fontSize: 16,
  },
});

export default OnboardingAuthScreen;
