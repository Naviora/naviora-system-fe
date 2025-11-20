import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'

export interface StreakData {
  streak_id: string
  student_id: string
  current_streak: number
  longest_streak: number
  last_activity_date: string
  updated_at: string
}

export const useGetStreak = () => {
  return useQuery({
    queryKey: ['streaks', 'me'],
    queryFn: () => apiClient.get<StreakData>('/streaks/me')
  })
}
