import { useQuery } from '@tanstack/react-query'
import { axios_instance } from '@/lib/api/client'

export interface StreakData {
  streak_id: string
  student_id: string
  current_streak: number
  longest_streak: number
  last_activity_date: string
  updated_at: string
}

interface StreakResponse {
  status_code: number
  message: string
  data: StreakData
}

export function useGetStreak() {
  return useQuery({
    queryKey: ['streak'],
    queryFn: async () => {
      const response = await axios_instance.get<StreakResponse>('/streaks/me')
      return response.data.data
    },
    staleTime: 1000 * 60 * 5 // 5 minutes
  })
}
