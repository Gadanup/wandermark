import { supabase } from '@/lib/supabaseClient'

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${userId}/avatar.${ext}`

  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true })
  if (error) throw error

  const {
    data: { publicUrl },
  } = supabase.storage.from('avatars').getPublicUrl(data.path)

  return publicUrl
}
