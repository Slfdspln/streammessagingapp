# Dating App - Chat Application

This is a React Native (Expo) application with Stream Chat integration for real-time messaging. The app provides user authentication via Supabase, profile management, user discovery, and a complete chat experience with online presence indicators.

## Features

- **React Native (Expo)**: Built with Expo SDK 53 for a streamlined development experience
- **Native iOS/Android Build**: Configured with development builds to support native modules
- **Stream Chat Integration**: Utilizes `stream-chat-react-native` v8.2.0 for core chat functionality
- **Supabase Authentication**: Secure user authentication and profile management
- **Edge Functions**: Secure token generation for Stream Chat
- **User Discovery**: Find and connect with other users
- **Real-time Presence**: Online status indicators and last active timestamps
- **Profile Management**: Edit and update user profiles

## Setup & Installation

Follow these steps to run the project locally.

### Prerequisites

- Node.js (LTS version)
- Xcode 15+ and Command Line Tools (for iOS)
- Android Studio and SDK (for Android)
- CocoaPods (`sudo gem install cocoapods`)
- Supabase account
- Stream Chat account

### Version Compatibility

This project uses pinned versions to ensure compatibility between Expo and Stream Chat:

```json
{
  "expo": "53.0.20",
  "react": "19.0.0",
  "react-native": "0.79.5",
  "stream-chat": "9.11.0",
  "stream-chat-react-native": "8.2.0"
}
```

### Required Expo Modules

The following Expo modules are required for Stream Chat to work properly:

- `react-native-gesture-handler`: Required for Stream Chat UI interactions
- `react-native-reanimated`: Required for animations in Stream Chat
- `react-native-svg`: Required for icons and UI elements
- `@react-native-community/netinfo`: Required for network status detection
- `@react-native-async-storage/async-storage`: Required for token storage
- `react-native-safe-area-context`: Required for proper UI layout

### Android-Specific Requirements

When building for Android, you may need additional configuration:

1. Ensure your `android/app/build.gradle` has the correct minSdkVersion (21+)
2. You may need to add the following to your `android/app/src/main/AndroidManifest.xml`:
   ```xml
   <uses-permission android:name="android.permission.CAMERA" />
   <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
   <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
   ```

### Installation Steps

1. **Clone the repository:**

   ```bash
   git clone <your-repo-url>
   cd <your-repo-name>
   ```

2. **Install NPM packages:**

   ```bash
   npm install
   ```

3. **Set up Supabase:**
   - Create a new Supabase project
   - Enable Email authentication
   - Create a `profiles` table with appropriate fields
   - Deploy the Edge Functions for Stream Chat token generation

4. **Configure Environment Variables:**
   - Copy the `.env.example` file to create your own `.env` file:
     ```bash
     cp .env.example .env
     ```
   - Edit the `.env` file with your own credentials:

     ```
     # Supabase Configuration
     SUPABASE_URL=https://your-project-id.supabase.co
     SUPABASE_ANON_KEY=your-anon-key-here

     # Stream Chat Configuration
     STREAM_CHAT_API_KEY=your-stream-chat-api-key-here
     STREAM_CHAT_API_SECRET=your-stream-chat-api-secret-here
     ```

5. **Install Native Dependencies:**

   ```bash
   npx expo prebuild
   ```

6. **Run the application:**

   ```bash
   # For iOS
   npx expo run:ios

   # For Android
   npx expo run:android
   ```

## Troubleshooting

### Common Issues

1. **Missing Native Modules**

   If you encounter errors about missing native modules, ensure you've run `npx expo prebuild` and installed all dependencies.

2. **Stream Chat Connection Issues**
   - Verify your Stream API key is correct
   - Ensure the Edge Function for token generation is deployed and working
   - Check that presence is enabled with `{ presence: true }` when watching channels

3. **Android Build Issues**
   - If you encounter `java.lang.UnsatisfiedLinkError` or similar, try clearing the build cache:
     ```bash
     cd android && ./gradlew clean
     ```

4. **iOS Build Issues**
   - If you encounter pod installation issues, try:
     ```bash
     cd ios
     pod deintegrate
     pod install
     ```

# app
