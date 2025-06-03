import { SupabaseClient } from '@supabase/supabase-js'

declare global {
  interface Database {
    public: {
      Tables: {
        pomodoro_sessions: {
          Row: {
            id: number
            user_id: string
            duration_minutes: number
            completed_at: string
          }
          Insert: {
            id?: number
            user_id: string
            duration_minutes: number
            completed_at: string
          }
          Update: {
            id?: number
            user_id?: string
            duration_minutes?: number
            completed_at?: string
          }
        }
        goals: {
          Row: {
            id: number
            user_id: string
            is_completed: boolean
            created_at: string
          }
          Insert: {
            id?: number
            user_id: string
            is_completed: boolean
            created_at: string
          }
          Update: {
            id?: number
            user_id?: string
            is_completed?: boolean
            created_at?: string
          }
        }
        profiles: {
          Row: {
            id: string
            study_streak: number
            total_study_hours: number
            full_name: string | null
          }
          Insert: {
            id: string
            study_streak: number
            total_study_hours: number
            full_name?: string | null
          }
          Update: {
            id?: string
            study_streak?: number
            total_study_hours?: number
            full_name?: string | null
          }
        }
      }
    }
  }
}

export type TypedSupabaseClient = SupabaseClient<Database> 