import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import type {
  UpdateProfileRequest,
  ProfileResponse,
  UpdateProfileResponse,
  AvatarUploadResponse
} from '@/types/api/profile'

const PROFILE_QUERY_KEY = ['profile']

export const useProfile = () => {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: async () => {
      const response = await apiClient.get<ProfileResponse>('/users/profile')
      return response.data
    }
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateProfileRequest) => {
      const response = await apiClient.patch<UpdateProfileResponse>('/users/profile', data)
      return response
    },
    onSuccess: () => {
      // Invalidate profile query to refetch updated data
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY })
    },
    onError: (error) => {
      console.error('Update profile failed:', error)
    }
  })
}

export const useUploadAvatar = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('avatar', file)
      const response = await apiClient.patch<AvatarUploadResponse>('/users/upload-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response
    },
    onSuccess: () => {
      // Invalidate profile query to refetch updated data
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY })
    },
    onError: (error) => {
      console.error('Upload avatar failed:', error)
    }
  })
}
