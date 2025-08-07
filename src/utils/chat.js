// chat.js
// Centralized Stream Chat client initialization

import { StreamChat } from 'stream-chat';

// Stream Chat API key
export const chatApiKey = 'yw2nup36tnpk';

// Initialize and export the client instance directly
export const client = StreamChat.getInstance(chatApiKey);
