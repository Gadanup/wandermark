import { renderHook, waitFor } from '@testing-library/react'
import type { User } from '@supabase/supabase-js'
import { getSession } from '@/api/auth'
import { createWrapper } from '@/test/utils'
import { useGetCurrentUser } from '../useGetCurrentUser'

vi.mock('@/api/auth', () => ({
  getSession: vi.fn(),
}))

const mockGetSession = vi.mocked(getSession)

describe('useGetCurrentUser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('starts with isPending true', () => {
    mockGetSession.mockReturnValue(new Promise(() => {}))

    const { result } = renderHook(() => useGetCurrentUser(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isPending).toBe(true)
  })

  it('returns null user when there is no session', async () => {
    mockGetSession.mockResolvedValue({ session: null })

    const { result } = renderHook(() => useGetCurrentUser(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isPending).toBe(false))
    expect(result.current.user).toBeNull()
  })

  it('returns user when a session exists', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' } as User
    mockGetSession.mockResolvedValue({
      session: { user: mockUser } as never,
    })

    const { result } = renderHook(() => useGetCurrentUser(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isPending).toBe(false))
    expect(result.current.user).toEqual(mockUser)
  })
})
