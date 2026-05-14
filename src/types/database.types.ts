// AUTO-GENERATED — do not edit manually.
// Regenerate after applying the schema: npx supabase gen types typescript --project-id <id> > src/types/database.types.ts
// See docs/DATABASE.md for the full schema.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      places: {
        Row: {
          id: string
          user_id: string
          name: string
          country_code: string
          country_name: string
          city: string | null
          latitude: number
          longitude: number
          maptiler_place_id: string | null
          visited_at: string | null
          notes: string | null
          is_bucket_list: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          country_code: string
          country_name: string
          city?: string | null
          latitude: number
          longitude: number
          maptiler_place_id?: string | null
          visited_at?: string | null
          notes?: string | null
          is_bucket_list?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          country_code?: string
          country_name?: string
          city?: string | null
          latitude?: number
          longitude?: number
          maptiler_place_id?: string | null
          visited_at?: string | null
          notes?: string | null
          is_bucket_list?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      ratings: {
        Row: {
          id: string
          place_id: string
          user_id: string
          food_drink: number | null
          safety: number | null
          beauty: number | null
          value_for_money: number | null
          vibe: number | null
          ease_of_travel: number | null
          mood_tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          place_id: string
          user_id: string
          food_drink?: number | null
          safety?: number | null
          beauty?: number | null
          value_for_money?: number | null
          vibe?: number | null
          ease_of_travel?: number | null
          mood_tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          place_id?: string
          user_id?: string
          food_drink?: number | null
          safety?: number | null
          beauty?: number | null
          value_for_money?: number | null
          vibe?: number | null
          ease_of_travel?: number | null
          mood_tags?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      photos: {
        Row: {
          id: string
          place_id: string
          user_id: string
          storage_path: string
          public_url: string
          caption: string | null
          private_note: string | null
          category: string
          taken_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          place_id: string
          user_id: string
          storage_path: string
          public_url: string
          caption?: string | null
          private_note?: string | null
          category?: string
          taken_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          place_id?: string
          user_id?: string
          storage_path?: string
          public_url?: string
          caption?: string | null
          private_note?: string | null
          category?: string
          taken_at?: string | null
          created_at?: string
        }
      }
      trips: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          cover_photo_id: string | null
          started_at: string | null
          ended_at: string | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          cover_photo_id?: string | null
          started_at?: string | null
          ended_at?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          cover_photo_id?: string | null
          started_at?: string | null
          ended_at?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      trip_places: {
        Row: {
          trip_id: string
          place_id: string
          added_at: string
        }
        Insert: {
          trip_id: string
          place_id: string
          added_at?: string
        }
        Update: {
          trip_id?: string
          place_id?: string
          added_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
