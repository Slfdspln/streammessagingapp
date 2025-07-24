# Dating App - Chat Proof of Concept

This is a simple React Native (Expo) application demonstrating a basic integration of the [Stream Chat SDK](https://getstream.io/chat/sdk/react-native/). The app sets up a native iOS project, connects a user to the Stream service, and displays a functional chat interface with a channel list and a message screen.

This project serves as the foundational chat feature for a dating application.

## Features

- **React Native (Expo)**: Built with Expo for a streamlined development experience.
- **Native iOS Build**: Configured with a development build to support native modules.
- **Stream Chat Integration**: Utilizes `stream-chat-react-native` for core chat functionality.
- **Basic UI**: Implements the essential `<ChannelList />` and `<Channel />` components to create a complete chat experience.
- **User Authentication**: Connects a hardcoded user to the Stream backend using a generated token.

## Setup & Installation

Follow these steps to run the project locally.

### Prerequisites

- Node.js (LTS version)
- Xcode and Command Line Tools
- CocoaPods (`sudo gem install cocoapods`)
- An active Stream account and a **Development App** set up on the [Stream Dashboard](https://getstream.io/dashboard).

### Installation Steps

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd <your-repo-name>
    ```

2.  **Install NPM packages:**
    ```bash
    npm install
    ```

3.  **Configure Stream Credentials:**
    Open the `App.js` file and replace the placeholder credentials with your own:
    -   `YOUR_DEV_API_KEY`: Your API Key from your **Development App** on the Stream Dashboard.
    -   `YOUR_USER_TOKEN`: A permanent user token generated from the Stream Dashboard's Chat Explorer or via the Stream CLI.

4.  **Install iOS Dependencies:**
    Navigate to the `ios` directory and install the pods.
    ```bash
    cd ios
    pod install
    cd ..
    ```

5.  **Run the application:**
    This command will build the native app and launch it in an iOS simulator.
    ```bash
    npx expo run:ios
    ```

## Next Steps

This is a basic proof of concept. The next steps in developing the chat feature would include:
-   **UI Customization**: Theming the components to match the dating app's brand.
-   **Dynamic Channel Creation**: Programmatically creating new chat channels when two users "match".
-   **User Management**: Integrating with the app's own user authentication system instead of using a hardcoded user.
