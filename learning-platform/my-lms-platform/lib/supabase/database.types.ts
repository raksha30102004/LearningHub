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
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'student' | 'instructor' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'student' | 'instructor' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'student' | 'instructor' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string | null
          instructor_id: string
          thumbnail_url: string | null
          category: string | null
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          instructor_id: string
          thumbnail_url?: string | null
          category?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          instructor_id?: string
          thumbnail_url?: string | null
          category?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      enrollments: {
        Row: {
          id: string
          user_id: string
          course_id: string
          enrolled_at: string
          progress: number
          completed: boolean
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          enrolled_at?: string
          progress?: number
          completed?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          enrolled_at?: string
          progress?: number
          completed?: boolean
        }
      }
      videos: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string | null
          video_url: string
          duration: number | null
          order_index: number
          is_free_preview: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description?: string | null
          video_url: string
          duration?: number | null
          order_index: number
          is_free_preview?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          description?: string | null
          video_url?: string
          duration?: number | null
          order_index?: number
          is_free_preview?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      video_progress: {
        Row: {
          id: string
          user_id: string
          video_id: string
          progress: number
          completed: boolean
          last_watched: string
        }
        Insert: {
          id?: string
          user_id: string
          video_id: string
          progress?: number
          completed?: boolean
          last_watched?: string
        }
        Update: {
          id?: string
          user_id?: string
          video_id?: string
          progress?: number
          completed?: boolean
          last_watched?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'student' | 'instructor' | 'admin'
    }
  }
}
