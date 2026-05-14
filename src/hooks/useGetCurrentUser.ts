import type { User } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'
import { getSession } from '@/api/auth'
import { queryKeys } from '@/api/queryKeys'

interface CurrentUserResult {
  user: User | null
  isPending: boolean
}

export function useGetCurrentUser(): CurrentUserResult {
  const { data, isPending } = useQuery({
    queryKey: queryKeys.auth.session(),
    queryFn: getSession,
    staleTime: 60 * 1000,
  })

  return {
    user: data?.session?.user ?? null,
    isPending,
  }
}
