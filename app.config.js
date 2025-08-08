import 'dotenv/config';

export default {
  expo: {
    name: 'Dating App',
    slug: 'dating-app',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.yourcompany.datingapp',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF',
      },
      package: 'com.yourcompany.datingapp',
    },
    extra: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      streamChatApiKey: process.env.STREAM_CHAT_API_KEY,
      appEnv: process.env.APP_ENV || 'development',
      eas: {
        projectId: 'your-project-id',
      },
    },
  },
};
