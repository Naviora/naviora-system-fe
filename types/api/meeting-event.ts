import { z } from 'zod'

// Meeting Event API Types using Zod

// Invitee schema
const inviteeSchema = z.array(z.string())

// Request body schema for creating a meeting event
export const createMeetingEventRequestSchema = z
  .object({
    class_id: z.string().min(1, 'class_id là bắt buộc'),
    host_by: z.string().min(1, 'host_by là bắt buộc'),
    title: z.string().min(1, 'title là bắt buộc'),
    description: z.string().optional(),
    note: z.string().optional(),
    invitees: z.array(z.string()).optional(), // Array of user IDs
    start_time: z.string().datetime('Thời gian bắt đầu phải là ISO 8601 datetime string'),
    end_time: z.string().datetime('Thời gian kết thúc phải là ISO 8601 datetime string')
  })
  .refine((data) => new Date(data.end_time) > new Date(data.start_time), {
    message: 'end_time phải lớn hơn start_time',
    path: ['end_time']
  })

// Export type from schema
export type CreateMeetingEventRequest = z.infer<typeof createMeetingEventRequestSchema>

// Meeting Event response schema
export const meetingEventSchema = z.object({
  id: z.string(),
  class_id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  note: z.string().optional(),
  invitees: z.array(inviteeSchema).optional(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional()
})

// Export type from schema
export type MeetingEvent = z.infer<typeof meetingEventSchema>

// Pagination schema
const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
  hasNext: z.boolean(),
  hasPrev: z.boolean()
})

// List meeting events response schema
export const meetingEventsListResponseSchema = z.object({
  status_code: z.number(),
  message: z.string(),
  data: z.array(meetingEventSchema),
  pagination: paginationSchema.optional()
})

// Export type from schema
export type MeetingEventsListResponse = z.infer<typeof meetingEventsListResponseSchema>

// Update meeting event request schema
export const updateMeetingEventRequestSchema = z
  .object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    note: z.string().optional(),
    invitees: z.array(z.string()).optional(),
    start_time: z.string().datetime().optional(),
    end_time: z.string().datetime().optional()
  })
  .refine(
    (data) => {
      if (data.start_time && data.end_time) {
        return new Date(data.end_time) > new Date(data.start_time)
      }
      return true
    },
    {
      message: 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu',
      path: ['end_time']
    }
  )

// Export type from schema
export type UpdateMeetingEventRequest = z.infer<typeof updateMeetingEventRequestSchema>

// Weekly meeting events query params schema
export const weeklyMeetingEventsQuerySchema = z.object({
  start: z.string().datetime('start phải là ISO 8601 datetime string'),
  end: z.string().datetime('end phải là ISO 8601 datetime string'),
  class_id: z.string().uuid('class_id phải là UUID').optional()
})

// Export type from schema
export type WeeklyMeetingEventsQuery = z.infer<typeof weeklyMeetingEventsQuerySchema>
