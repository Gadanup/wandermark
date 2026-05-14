import { useRef, useState, useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Navigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useAuth } from '@/context/AuthContext'
import { APP_NAME, AUTH_LABELS, BUTTON_LABELS } from '@/constants/const'
import { useSignIn } from '@/hooks/useSignIn'
import { useSignUp } from '@/hooks/useSignUp'

type Mode = 'sign-in' | 'sign-up' | 'magic-link'

interface FormValues {
  email: string
  password: string
}

const passwordSchema = yup.object({
  email: yup
    .string()
    .email(AUTH_LABELS.emailInvalid)
    .required(AUTH_LABELS.emailRequired),
  password: yup
    .string()
    .min(8, AUTH_LABELS.passwordMinLength)
    .required(AUTH_LABELS.passwordRequired),
})

const magicLinkSchema = yup.object({
  email: yup
    .string()
    .email(AUTH_LABELS.emailInvalid)
    .required(AUTH_LABELS.emailRequired),
  password: yup.string(),
})

export function LoginPage() {
  const modeRef = useRef<Mode>('sign-in')
  const goToOnboardingRef = useRef(false)

  const [mode, setMode] = useState<Mode>('sign-in')
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  modeRef.current = mode

  const { session, isLoading: authLoading } = useAuth()
  const signIn = useSignIn()
  const signUp = useSignUp()

  const {
    control,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { email: '', password: '' },
    resolver: yupResolver(
      yup.lazy(() =>
        modeRef.current === 'magic-link' ? magicLinkSchema : passwordSchema
      ) as unknown as typeof passwordSchema
    ),
  })

  const switchMode = useCallback(
    (newMode: Mode) => {
      setMode(newMode)
      reset({ email: getValues('email'), password: '' })
    },
    [getValues, reset]
  )

  const onSubmit = handleSubmit(({ email, password }) => {
    if (mode === 'magic-link') {
      signIn.mutate(
        { mode: 'magic-link', email },
        { onSuccess: () => setMagicLinkSent(true) }
      )
      return
    }
    if (mode === 'sign-in') {
      signIn.mutate({ mode: 'password', email, password })
    } else {
      goToOnboardingRef.current = true
      signUp.mutate(
        { email, password },
        { onError: () => { goToOnboardingRef.current = false } }
      )
    }
  })

  if (!authLoading && session) {
    return <Navigate to={goToOnboardingRef.current ? '/onboarding' : '/map'} replace />
  }

  if (magicLinkSent) {
    return (
      <Box
        sx={{
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Paper sx={{ p: 4, maxWidth: 400, width: '100%', textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            {AUTH_LABELS.magicLinkSentTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {AUTH_LABELS.magicLinkSent}
          </Typography>
        </Paper>
      </Box>
    )
  }

  const isPending = signIn.isPending || signUp.isPending
  const error = signIn.error ?? signUp.error

  const titles: Record<Mode, string> = {
    'sign-in': AUTH_LABELS.signInTitle,
    'sign-up': AUTH_LABELS.signUpTitle,
    'magic-link': AUTH_LABELS.magicLinkTitle,
  }

  const subtitles: Record<Mode, string> = {
    'sign-in': AUTH_LABELS.signInSubtitle,
    'sign-up': AUTH_LABELS.signUpSubtitle,
    'magic-link': AUTH_LABELS.magicLinkSubtitle,
  }

  const submitLabels: Record<Mode, string> = {
    'sign-in': BUTTON_LABELS.signIn,
    'sign-up': BUTTON_LABELS.signUp,
    'magic-link': BUTTON_LABELS.sendMagicLink,
  }

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper sx={{ p: { xs: 3, sm: 4 }, maxWidth: 400, width: '100%' }}>
        <Typography variant="h4" gutterBottom>
          {APP_NAME}
        </Typography>
        <Typography variant="h6" gutterBottom>
          {titles[mode]}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {subtitles[mode]}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.message}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={onSubmit}
          noValidate
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={AUTH_LABELS.emailLabel}
                type="email"
                autoComplete="email"
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
              />
            )}
          />

          {mode !== 'magic-link' && (
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={AUTH_LABELS.passwordLabel}
                  type="password"
                  autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  fullWidth
                />
              )}
            />
          )}

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isPending}
            fullWidth
          >
            {submitLabels[mode]}
          </Button>
        </Box>

        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {mode === 'sign-in' && (
            <>
              <Typography variant="body2">
                {AUTH_LABELS.noAccount}{' '}
                <Link
                  component="button"
                  type="button"
                  onClick={() => switchMode('sign-up')}
                  underline="hover"
                >
                  {BUTTON_LABELS.signUp}
                </Link>
              </Typography>
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={() => switchMode('magic-link')}
                underline="hover"
                sx={{ textAlign: 'left' }}
              >
                {AUTH_LABELS.useMagicLink}
              </Link>
            </>
          )}
          {mode === 'sign-up' && (
            <Typography variant="body2">
              {AUTH_LABELS.hasAccount}{' '}
              <Link
                component="button"
                type="button"
                onClick={() => switchMode('sign-in')}
                underline="hover"
              >
                {BUTTON_LABELS.signIn}
              </Link>
            </Typography>
          )}
          {mode === 'magic-link' && (
            <Link
              component="button"
              type="button"
              variant="body2"
              onClick={() => switchMode('sign-in')}
              underline="hover"
              sx={{ textAlign: 'left' }}
            >
              {AUTH_LABELS.usePassword}
            </Link>
          )}
        </Box>
      </Paper>
    </Box>
  )
}
