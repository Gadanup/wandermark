import { useQuery } from '@tanstack/react-query'
import { getProfile } from '@/api/profiles'
import { queryKeys } from '@/api/queryKeys'

export function useGetProfile(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.profile.current(),
    queryFn: () => getProfile(userId!),
    enabled: !!userId,
    staleTime: 60 * 1000,
  })
}
