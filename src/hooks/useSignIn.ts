import { useMutation, useQueryClient } from '@tanstack/react-query'
import { signInWithMagicLink, signInWithPassword } from '@/api/auth'
import { queryKeys } from '@/api/queryKeys'

type SignInInput =
  | { mode: 'password'; email: string; password: string }
  | { mode: 'magic-link'; email: string }

export function useSignIn() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: SignInInput) => {
      if (input.mode === 'password') {
        return signInWithPassword(input.email, input.password)
      }
      return signInWithMagicLink(input.email)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.all })
    },
  })
}
