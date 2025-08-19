import { createClient } from '@supabase/supabase-js'
import { supabaseConfig } from './config'

/**
 * Supabase client setup
 * Used for authentication and real-time features
 */

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey)

// Server-side client with service role key
export const supabaseAdmin = createClient(
  supabaseConfig.url,
  supabaseConfig.serviceRoleKey
)
