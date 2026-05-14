import { useMutation, useQueryClient } from '@tanstack/react-query'
import { signUp } from '@/api/auth'
import { queryKeys } from '@/api/queryKeys'

interface SignUpInput {
  email: string
  password: string
}

export function useSignUp() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ email, password }: SignUpInput) => signUp(email, password),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.all })
    },
  })
}
