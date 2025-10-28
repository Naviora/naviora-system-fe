export interface UserProfile {
  account_id: string
  name: string
  email: string
  avatar: string
  phone: string
  address: string
  gender: 'male' | 'female' | 'other'
  date_of_birth: string
  status: string
  rank: string
  role: string
}

export interface UpdateProfileRequest {
  name?: string
  phone?: string
  address?: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other'
}

export interface ProfileResponse {
  status_code: number
  message: string
  data: UserProfile
}

export interface UpdateProfileResponse {
  status_code: number
  message: string
  data: {
    status_code: number
    message: string
  }
}

export interface AvatarUploadResponse {
  status_code: number
  message: string
  data?: {
    status_code: number
    message: string
  }
}
