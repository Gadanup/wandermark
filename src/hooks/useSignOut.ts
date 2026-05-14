import { useMutation, useQueryClient } from '@tanstack/react-query'
import { signOut } from '@/api/auth'
import { queryKeys } from '@/api/queryKeys'

export function useSignOut() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.all })
    },
  })
}
