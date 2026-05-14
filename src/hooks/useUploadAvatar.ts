import { useMutation } from '@tanstack/react-query'
import { uploadAvatar } from '@/api/storage'

interface UploadAvatarInput {
  userId: string
  file: File
}

export function useUploadAvatar() {
  return useMutation({
    mutationFn: ({ userId, file }: UploadAvatarInput) =>
      uploadAvatar(userId, file),
  })
}
