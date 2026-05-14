import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProfile } from '@/api/profiles'
import { queryKeys } from '@/api/queryKeys'
import type { Database } from '@/types/database.types'

type ProfileUpdate = Omit<
  Database['public']['Tables']['profiles']['Update'],
  'id' | 'created_at' | 'updated_at'
>

interface UpdateProfileInput {
  userId: string
  updates: ProfileUpdate
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, updates }: UpdateProfileInput) =>
      updateProfile(userId, updates),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.profile.all })
    },
  })
}
