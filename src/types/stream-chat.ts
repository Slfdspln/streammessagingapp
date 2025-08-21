import { StreamChat } from 'stream-chat';

/**
 * Extended user type for Stream Chat with dating app specific fields
 */
export type StreamChatUser = {
  id: string;
  name: string;
  image?: string;
  online?: boolean;
  last_active?: Date;
  role?: string;
  // Dating app specific fields
  age?: number;
  bio?: string;
  interested_in?: string[];
  location?: string;
  gender?: string;
  looking_for?: string[];
};

/**
 * Extended channel type for Stream Chat
 */
export type StreamChatChannel = {
  id: string;
  type: 'messaging';
  members: Record<string, { user_id: string }>;
  created_at?: Date;
  updated_at?: Date;
  last_message_at?: Date;
  created_by?: StreamChatUser;
  // Dating app specific fields
  match_date?: Date;
  match_score?: number;
  is_favorite?: boolean;
};

/**
 * Extended message type for Stream Chat
 */
export type StreamChatMessage = {
  id: string;
  text: string;
  user: StreamChatUser;
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;
  attachments?: any[];
  mentioned_users?: StreamChatUser[];
  reaction_counts?: Record<string, number>;
  reaction_scores?: Record<string, number>;
  status?: 'sending' | 'sent' | 'received' | 'read' | 'failed';
  // Dating app specific fields
  is_system_message?: boolean;
  contains_media?: boolean;
};

/**
 * Custom generics for Stream Chat in our dating app
 */
export type AppStreamChatGenerics = {
  attachmentType: any;
  channelType: StreamChatChannel;
  commandType: string;
  eventType: any;
  messageType: StreamChatMessage;
  reactionType: any;
  userType: StreamChatUser;
};
