export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      trainings: {
        Row: {
          id: string
          user_id: string
          duration: number
          distance: number
          pace: number
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          duration: number
          distance: number
          pace: number
          date?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          duration?: number
          distance?: number
          pace?: number
          date?: string
          created_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          user_id: string
          type: string
          value: string
          unlocked_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          value: string
          unlocked_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          value?: string
          unlocked_at?: string
          created_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          title: string
          description: string | null
          duration: number
          thumbnail_url: string | null
          video_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          duration: number
          thumbnail_url?: string | null
          video_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          duration?: number
          thumbnail_url?: string | null
          video_url?: string | null
          created_at?: string
        }
      }
      lesson_progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          completed: boolean
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
        }
      }
    }
  }
}