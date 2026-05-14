import { supabase } from '@/lib/supabaseClient'
import type { Database } from '@/types/database.types'

type ProfileRow = Database['public']['Tables']['profiles']['Row']
type ProfileUpdate = Omit<
  Database['public']['Tables']['profiles']['Update'],
  'id' | 'created_at' | 'updated_at'
>

export async function getProfile(userId: string): Promise<ProfileRow> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url, bio, created_at, updated_at')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}

export async function updateProfile(
  userId: string,
  updates: ProfileUpdate
): Promise<ProfileRow> {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select('id, username, display_name, avatar_url, bio, created_at, updated_at')
    .single()
  if (error) throw error
  return data
}
