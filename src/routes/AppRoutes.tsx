import { useQuery } from '@tanstack/react-query'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import { AlbumPage } from '@/pages/AlbumPage'
import { LoginPage } from '@/pages/LoginPage'
import { MapPage } from '@/pages/MapPage'
import { OnboardingPage } from '@/pages/OnboardingPage'
import { PlacePage } from '@/pages/PlacePage'
import { ProfilePage } from '@/pages/ProfilePage'
import { TripPage } from '@/pages/TripPage'
import { TripsPage } from '@/pages/TripsPage'
import { ProtectedRoute } from './ProtectedRoute'

function RootRedirect() {
  const { data, isPending } = useQuery({
    queryKey: ['auth', 'session'],
    queryFn: () => supabase.auth.getSession(),
    staleTime: 60 * 1000,
  })

  if (isPending) return null

  const session = data?.data.session
  return <Navigate to={session ? '/map' : '/login'} replace />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/map" element={<MapPage />} />
        <Route path="/places/:id" element={<PlacePage />} />
        <Route path="/album" element={<AlbumPage />} />
        <Route path="/trips" element={<TripsPage />} />
        <Route path="/trips/:id" element={<TripPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  )
}
