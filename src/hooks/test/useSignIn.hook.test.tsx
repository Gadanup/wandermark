import { act, renderHook, waitFor } from '@testing-library/react'
import { signInWithMagicLink, signInWithPassword } from '@/api/auth'
import { createWrapper } from '@/test/utils'
import { useSignIn } from '../useSignIn'

vi.mock('@/api/auth', () => ({
  signInWithPassword: vi.fn(),
  signInWithMagicLink: vi.fn(),
}))

const mockSignInWithPassword = vi.mocked(signInWithPassword)
const mockSignInWithMagicLink = vi.mocked(signInWithMagicLink)

describe('useSignIn', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls signInWithPassword with correct args when mode is password', async () => {
    mockSignInWithPassword.mockResolvedValue({ user: {} as never, session: {} as never })

    const { result } = renderHook(() => useSignIn(), { wrapper: createWrapper() })

    act(() => {
      result.current.mutate({ mode: 'password', email: 'a@b.com', password: 'pass1234' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockSignInWithPassword).toHaveBeenCalledWith('a@b.com', 'pass1234')
  })

  it('calls signInWithMagicLink with correct email when mode is magic-link', async () => {
    mockSignInWithMagicLink.mockResolvedValue({} as never)

    const { result } = renderHook(() => useSignIn(), { wrapper: createWrapper() })

    act(() => {
      result.current.mutate({ mode: 'magic-link', email: 'a@b.com' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockSignInWithMagicLink).toHaveBeenCalledWith('a@b.com')
  })

  it('sets isError when sign-in fails', async () => {
    mockSignInWithPassword.mockRejectedValue(new Error('Invalid login credentials'))

    const { result } = renderHook(() => useSignIn(), { wrapper: createWrapper() })

    act(() => {
      result.current.mutate({ mode: 'password', email: 'a@b.com', password: 'wrong' })
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error?.message).toBe('Invalid login credentials')
  })
})
