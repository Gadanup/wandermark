export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    session: () => ['auth', 'session'] as const,
  },
  profile: {
    all: ['profile'] as const,
    current: () => ['profile', 'current'] as const,
    byId: (id: string) => ['profile', id] as const,
  },
} as const
