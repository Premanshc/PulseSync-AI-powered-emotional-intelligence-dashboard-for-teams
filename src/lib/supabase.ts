import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Types for our database
export interface SentimentData {
  id: string
  user_id: string
  message: string
  sentiment: 'positive' | 'negative' | 'neutral'
  emotion: string
  confidence: number
  timestamp: string
  team_id?: string
}

export interface UserProfile {
  id: string
  email: string
  name: string
  team_id?: string
  preferences: {
    notifications: boolean
    music_enabled: boolean
    wellness_nudges: boolean
  }
  created_at: string
}
