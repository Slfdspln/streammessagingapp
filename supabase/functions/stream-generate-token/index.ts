// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { StreamChat } from 'https://esm.sh/stream-chat@8.14.1';

// Simple in-memory rate limiting store
// In production, consider using Redis or another distributed store
interface RateLimitEntry {
  count: number;
  resetAt: number;
}
const rateLimits = new Map<string, RateLimitEntry>();

// Rate limit configuration
const RATE_LIMIT_MAX = 10; // Max requests per window
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window

// This is a secure server-side endpoint to generate Stream Chat tokens
// It should NEVER be exposed to the client directly

console.log('Stream Chat Token Generator Edge Function started');

serve(async req => {
  try {
    // Strict CORS headers - only allow requests from your app domains
    const allowedOrigins = [
      'https://yourappdomain.com',  // Production domain
      'http://localhost:19000',     // Expo development
      'http://localhost:19006',     // Expo web
      'exp://localhost:19000',      // Expo Go
    ];
    
    const origin = req.headers.get('Origin') || '';
    const isAllowedOrigin = allowedOrigins.includes(origin) || origin.startsWith('exp://');
    
    const headers = {
      'Access-Control-Allow-Origin': isAllowedOrigin ? origin : allowedOrigins[0],
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'Access-Control-Allow-Credentials': 'true',
    };

    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers });
    }

    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        status: 401,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }
    
    // Apply rate limiting based on IP address
    const clientIP = req.headers.get('X-Forwarded-For')?.split(',')[0] || 'unknown';
    
    // Check if the IP is rate limited
    const now = Date.now();
    const rateLimit = rateLimits.get(clientIP) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
    
    // Reset counter if the window has expired
    if (now > rateLimit.resetAt) {
      rateLimit.count = 0;
      rateLimit.resetAt = now + RATE_LIMIT_WINDOW_MS;
    }
    
    // Increment counter and check limit
    rateLimit.count++;
    rateLimits.set(clientIP, rateLimit);
    
    if (rateLimit.count > RATE_LIMIT_MAX) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
        status: 429,
        headers: { 
          ...headers, 
          'Content-Type': 'application/json',
          'Retry-After': `${Math.ceil((rateLimit.resetAt - now) / 1000)}`,
        },
      });
    }

    // Create a Supabase client with the auth header
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      // Create client with Auth context of the user that called the function.
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get the user from the auth header
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid user token' }), {
        status: 401,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }
    
    // Parse request body to get the requested user_id
    let requestData;
    try {
      requestData = await req.json();
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Invalid request body' }), {
        status: 400,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }
    
    // Validate that the requested user_id matches the authenticated user's ID
    // This prevents token generation for other users
    if (requestData.user_id && requestData.user_id !== user.id) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Cannot generate token for another user' }), {
        status: 403,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }
    
    // Use the authenticated user's ID
    const userId = user.id;

    // Get Stream Chat API key and secret from environment variables
    const streamApiKey = Deno.env.get('STREAM_CHAT_API_KEY');
    const streamApiSecret = Deno.env.get('STREAM_CHAT_API_SECRET');

    if (!streamApiKey || !streamApiSecret) {
      return new Response(JSON.stringify({ error: 'Stream Chat credentials not configured' }), {
        status: 500,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Stream Chat client
    const serverClient = StreamChat.getInstance(streamApiKey, streamApiSecret);

    // Generate a token for the user with a short TTL (24 hours)
    const expiresAt = Math.floor(Date.now() / 1000) + 24 * 60 * 60; // 24 hours from now
    const token = serverClient.createToken(userId, expiresAt);

    // Return the token
    return new Response(JSON.stringify({ token }), {
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // Return error response
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
