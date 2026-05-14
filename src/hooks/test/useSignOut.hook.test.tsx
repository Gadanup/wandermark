import { act, renderHook, waitFor } from '@testing-library/react'
import { signOut } from '@/api/auth'
import { createWrapper } from '@/test/utils'
import { useSignOut } from '../useSignOut'

vi.mock('@/api/auth', () => ({
  signOut: vi.fn(),
}))

const mockSignOut = vi.mocked(signOut)

describe('useSignOut', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls signOut on mutate', async () => {
    mockSignOut.mockResolvedValue(undefined)

    const { result } = renderHook(() => useSignOut(), { wrapper: createWrapper() })

    act(() => {
      result.current.mutate()
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockSignOut).toHaveBeenCalledOnce()
  })

  it('sets isError when sign-out fails', async () => {
    mockSignOut.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useSignOut(), { wrapper: createWrapper() })

    act(() => {
      result.current.mutate()
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error?.message).toBe('Network error')
  })
})
