import { useQuery } from '@tanstack/react-query'
import { Navigate, Outlet } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'

export function ProtectedRoute() {
  const { data, isPending } = useQuery({
    queryKey: ['auth', 'session'],
    queryFn: () => supabase.auth.getSession(),
    staleTime: 60 * 1000,
  })

  if (isPending) return null

  const session = data?.data.session
  if (!session) return <Navigate to="/login" replace />

  return <Outlet />
}
