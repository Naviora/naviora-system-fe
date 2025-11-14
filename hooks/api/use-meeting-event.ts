import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import type {
  CreateMeetingEventRequest,
  MeetingEvent,
  MeetingEventsListResponse,
  WeeklyMeetingEventsQuery
} from '@/types/api/meeting-event'

const MEETING_EVENTS_QUERY_KEY = ['meeting-events']

export const useCreateMeetingEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateMeetingEventRequest) => {
      const response = await apiClient.post<MeetingEvent>('/meeting-events', data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEETING_EVENTS_QUERY_KEY })
    },
    onError: (error) => {
      console.error('Create meeting event failed:', error)
    }
  })
}

export const useGetMeetingEvents = (params: WeeklyMeetingEventsQuery) => {
  return useQuery({
    queryKey: [...MEETING_EVENTS_QUERY_KEY, 'weekly', params],
    queryFn: async () => {
      // apiClient.get already extracts data.data, so we get the response structure directly
      const data = await apiClient.get<MeetingEventsListResponse>('/meeting-events/weekly', { params })
      return data
    }
  })
}
