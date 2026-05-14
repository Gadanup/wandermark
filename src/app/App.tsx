import { getInitColorSchemeScript } from '@mui/material/styles'
import { AppProviders } from './AppProviders'
import { AppRoutes } from '@/routes/AppRoutes'

export function App() {
  return (
    <>
      {getInitColorSchemeScript({ defaultMode: 'system' })}
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </>
  )
}
