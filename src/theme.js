import { Streami18n } from 'stream-chat-react-native';

// A custom theme object for our dating app.
// We are extending the default Stream theme with our own colors and fonts.
export const datingAppTheme = {
  // We'll start with colors. You can change these hex codes to any color you like.
  colors: {
    accent_blue: '#FF6B81', // A soft, romantic rose color for main accents
    black: '#2E2E2E', // A softer black for text
    primary_prpl: '#FF6B81', // Used for the unread indicator
    white: '#FFFFFF',
    white_smoke: '#F5F5F5', // A light grey for backgrounds and message bubbles
  },
  // We can also define custom styles for specific components.
  // Here, we'll style the message bubbles to look more like iMessage.
  messageSimple: {
    content: {
      container: {
        backgroundColor: '#F5F5F5', // Their message bubble color
        borderWidth: 0,
      },
      text: {
        color: '#2E2E2E', // Their message text color
      },
    },
    content_sender: {
      container: {
        backgroundColor: '#FF6B81', // Your message bubble color
        borderWidth: 0,
      },
      text: {
        color: '#FFFFFF', // Your message text color
      },
    },
  },
};

// We also need an i18n instance for translations
export const streami18n = new Streami18n({
  language: 'en',
});
