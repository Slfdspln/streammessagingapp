require('dotenv').config();

module.exports = ({ config }) => ({
  ...config,
  plugins: [
    "react-native-video",
    "expo-secure-store"
  ],
  name: 'DatingApp20',
  slug: 'DatingApp20',
  scheme: 'datingapp20',
  version: '1.0.0',
  orientation: 'portrait',
  // Temporarily using default Expo assets
  // icon: './assets/icon.png',
  // splash: {
  //   image: './assets/splash.png',
  //   resizeMode: 'contain',
  //   backgroundColor: '#ffffff',
  // },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.yourcompany.datingapp',
    scheme: 'datingapp20',
    infoPlist: {
      NSPhotoLibraryUsageDescription: "We need access to your photos so you can add profile pictures.",
      NSPhotoLibraryAddUsageDescription: "We need permission to save edited photos to your library.",
      NSCameraUsageDescription: "We need access to your camera to take a profile photo.",
      NSAppTransportSecurity: {
        NSAllowsLocalNetworking: true,
        NSExceptionDomains: {
          // Supabase domains
          'supabase.co': {
            NSIncludesSubdomains: true,
            NSExceptionAllowsInsecureHTTPLoads: false,
            NSExceptionRequiresForwardSecrecy: true,
            NSExceptionMinimumTLSVersion: 'TLSv1.2',
          },
          // Stream Chat domains
          'stream-io-cdn.com': {
            NSIncludesSubdomains: true,
            NSExceptionAllowsInsecureHTTPLoads: false,
            NSExceptionRequiresForwardSecrecy: true,
            NSExceptionMinimumTLSVersion: 'TLSv1.2',
          },
          'getstream.io': {
            NSIncludesSubdomains: true,
            NSExceptionAllowsInsecureHTTPLoads: false,
            NSExceptionRequiresForwardSecrecy: true,
            NSExceptionMinimumTLSVersion: 'TLSv1.2',
          },
        },
      },
      CFBundleURLTypes: [
        {
          CFBundleURLSchemes: ['datingapp20'],
        },
      ],
    },
  },
  android: {
    // Temporarily commenting out adaptive icon to fix prebuild issues
    // adaptiveIcon: {
    //   backgroundColor: '#FFFFFF',
    // },
    package: 'com.anonymous.datingapp2.x0',
    scheme: 'datingapp20',
    intentFilters: [
      {
        action: 'VIEW',
        autoVerify: true,
        data: [
          {
            scheme: 'datingapp20',
          },
        ],
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ],
  },
  extra: {
    ...config.extra,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    STREAM_CHAT_API_KEY: process.env.STREAM_CHAT_API_KEY,
    APP_ENV: process.env.APP_ENV || 'development',
    STORAGE_BUCKET: 'profile-photos',
    eas: {
      projectId: 'your-project-id',
    },
  },
});
