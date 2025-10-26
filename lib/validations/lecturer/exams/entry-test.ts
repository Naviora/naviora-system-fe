import { z } from 'zod'

export const createEntryTestSchema = z.object({
  title: z.string(),
  description: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  questionSets: z.array(z.string())
})

export const entryTestSchema = z.object({
  entry_test_id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum(['ACTIVE', 'CLOSED', 'DRAFT', 'ARCHIVED', 'PENDING', 'ENDED']),
  start_time: z.string(),
  end_time: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),
  version: z.number(),
  question_sets: z.array(z.string().uuid()),
  created_by: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    avatar: z.string().nullable(),
    phone: z.string(),
    address: z.string(),
    gender: z.string(),
    date_of_birth: z.string(),
    status: z.string(),
    office_phone_number: z.string().nullable(),
    point: z.any().nullable(),
    username: z.string().nullable(),
    has_participated_entry_test: z.boolean(),
    created_at: z.string(),
    updated_at: z.string(),
    deleted_at: z.string().nullable(),
    version: z.number(),
    role: z.object({
      id: z.number(),
      name: z.string(),
      description: z.string(),
      is_active: z.boolean(),
      permissions: z.string(),
      created_at: z.string(),
      updated_at: z.string(),
      deleted_at: z.string().nullable(),
      version: z.number()
    })
  }),
  updated_by: z.any().nullable()
})

export const getEntryTestsResponseSchema = z.object({
  entry_tests: z.array(entryTestSchema),
  pagination: z.object({
    limit: z.number(),
    current_page: z.number(),
    total_records: z.number(),
    total_pages: z.number()
  })
})

export type CreateEntryTestRequest = z.infer<typeof createEntryTestSchema>
export type EntryTest = z.infer<typeof entryTestSchema>
export type GetEntryTestsResponse = z.infer<typeof getEntryTestsResponseSchema>
